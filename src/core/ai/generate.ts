import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z, type ZodSchema } from "zod";
import { DEFAULT_LLM_TIMEOUT_MS, MAX_TRANSCRIPT_CHARS } from "./limits";
import { GenerationError } from "./errors";
import { extractJson, extractPruefenMarkers, safeParseErrorMessage, type PruefenMarker } from "./parse";

/**
 * Model-Cascade:
 *  - bulk: Haiku 4.5 — schnell + günstig, für strukturierte JSON-Extraktion
 *  - reasoning: Sonnet 4.5 — für user-getriggerte Refinements
 */
const BULK_MODEL = process.env.ANTHROPIC_BULK_MODEL ?? "claude-haiku-4-5";
const REFINE_MODEL = process.env.ANTHROPIC_REASONING_MODEL ?? process.env.ANTHROPIC_REFINE_MODEL ?? "claude-sonnet-4-5";
const DEFAULT_MAX_TOKENS = 8192;
const DEFAULT_TEMPERATURE = 0.2;

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new GenerationError("api", "ANTHROPIC_API_KEY ist nicht gesetzt.");
    }
    _client = new Anthropic({
      apiKey: key,
      timeout: DEFAULT_LLM_TIMEOUT_MS,
      // SDK-Retry mit Backoff für transiente API-Fehler (429/5xx/Netz).
      // Unsere eigene Retry-Schleife behandelt nur Parse-/Schema-Fehler.
      maxRetries: 2,
    });
  }
  return _client;
}

export interface GenerateDocumentOptions<TOutput> {
  /** Per-Produkt System-Prompt (Domain-Wissen, Output-Schema-Beschreibung) */
  systemPrompt: string;
  /** Inputs, die das LLM sieht — Transcript, strukturierte Daten, Referenz-Dokumente */
  inputs: {
    transcript?: string;
    structuredData?: Record<string, unknown>;
    referenceDocuments?: string[];
    /** Custom user-prompt builder. Wenn nicht gesetzt, wird ein Default genutzt. */
    userPrompt?: string;
  };
  /** Per-Produkt Zod-Schema, das den Output validiert */
  outputSchema: ZodSchema<TOutput>;
  /** Optional: 2-Stage-Refinement (z. B. juristische Politur des ersten Drafts) */
  twoStage?: {
    refinementSystemPrompt: string;
    refinementUserPrompt: (firstDraft: TOutput) => string;
  };
  /** Default: bulk (Haiku). Für sensible Generationen: reasoning (Sonnet) */
  model?: "bulk" | "reasoning";
  /** Default: 2 — bei JSON-Parse-Fehler retry mit kurzem "Fix the JSON"-Prompt */
  maxRetries?: number;
  /** Default: 8192 (bulk), 2048 (refinement) */
  maxTokens?: number;
  /** Default: 0.2 */
  temperature?: number;
}

export interface GenerateDocumentResult<TOutput> {
  output: TOutput;
  pruefenMarkers: PruefenMarker[];
  tokensUsed: { input: number; output: number };
  costEurCents: number;
  modelUsed: string;
  retryCount: number;
}

/**
 * Generic LLM-Document-Generator. Per-Produkt: System-Prompt + Schema.
 *
 * Garantiert:
 *  - JSON-Parse mit Retry-on-Failure (bis maxRetries)
 *  - Schema-Validation via Zod
 *  - Prompt-Caching auf System-Prompt (90% Token-Discount nach erstem Hit)
 *  - Strukturierte Errors (api / parse / validate)
 *  - [PRÜFEN]-Marker-Extraktion aus dem Output
 */
export async function generateDocument<TOutput>(
  opts: GenerateDocumentOptions<TOutput>
): Promise<GenerateDocumentResult<TOutput>> {
  // Cost-DoS-Schutz
  if (opts.inputs.transcript && opts.inputs.transcript.length > MAX_TRANSCRIPT_CHARS) {
    throw new GenerationError(
      "validate",
      `Transcript zu lang (${opts.inputs.transcript.length} Zeichen, Max ${MAX_TRANSCRIPT_CHARS}).`
    );
  }

  const modelName = opts.model === "reasoning" ? REFINE_MODEL : BULK_MODEL;
  const maxTokens = opts.maxTokens ?? DEFAULT_MAX_TOKENS;
  const temperature = opts.temperature ?? DEFAULT_TEMPERATURE;
  const maxRetries = opts.maxRetries ?? 2;

  const userPrompt = opts.inputs.userPrompt ?? buildDefaultUserPrompt(opts.inputs);

  let lastError: Error | null = null;
  let retryCount = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let lastRawText = "";

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const repairHint = attempt > 0 && lastRawText
        ? `\n\nWICHTIG: Dein vorheriger Output war kein valides JSON oder hat das Schema verletzt. Liefere reines JSON ohne Erklärungen.`
        : "";

      const response = await client().messages.create({
        model: modelName,
        max_tokens: maxTokens,
        temperature,
        system: [
          {
            type: "text",
            text: opts.systemPrompt,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          {
            role: "user",
            content: userPrompt + repairHint,
          },
        ],
      });

      totalInputTokens += response.usage.input_tokens;
      totalOutputTokens += response.usage.output_tokens;

      const textBlock = response.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new GenerationError("parse", "Keine Text-Antwort von Claude.");
      }
      lastRawText = textBlock.text;

      const jsonStr = extractJson(textBlock.text);
      let parsed: unknown;
      try {
        parsed = JSON.parse(jsonStr);
      } catch (err) {
        throw new GenerationError("parse", safeParseErrorMessage(err, textBlock.text));
      }

      // Zod-Validation
      const result = opts.outputSchema.safeParse(parsed);
      if (!result.success) {
        const issue = result.error.issues[0];
        throw new GenerationError(
          "validate",
          `Schema-Validation fehlgeschlagen: ${issue?.path.join(".")} – ${issue?.message}`
        );
      }

      let output = result.data;

      // 2-Stage-Refinement
      if (opts.twoStage) {
        const refinement = await client().messages.create({
          model: REFINE_MODEL,
          max_tokens: maxTokens,
          temperature,
          system: [
            {
              type: "text",
              text: opts.twoStage.refinementSystemPrompt,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: [
            {
              role: "user",
              content: opts.twoStage.refinementUserPrompt(output),
            },
          ],
        });
        totalInputTokens += refinement.usage.input_tokens;
        totalOutputTokens += refinement.usage.output_tokens;

        const refTextBlock = refinement.content.find((b) => b.type === "text");
        if (refTextBlock && refTextBlock.type === "text") {
          const refJson = extractJson(refTextBlock.text);
          try {
            const refParsed = JSON.parse(refJson);
            const refResult = opts.outputSchema.safeParse(refParsed);
            if (refResult.success) output = refResult.data;
          } catch {
            // Refinement-Fehler ignorieren — wir haben den Stage-1-Output
            console.warn("[@flow/ai] refinement failed, keeping stage-1 output");
          }
        }
      }

      return {
        output,
        pruefenMarkers: extractPruefenMarkers(output),
        tokensUsed: { input: totalInputTokens, output: totalOutputTokens },
        costEurCents: estimateCostCents(modelName, totalInputTokens, totalOutputTokens),
        modelUsed: modelName,
        retryCount,
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      retryCount = attempt + 1;
      if (attempt >= maxRetries) break;

      // Bei API-Fehlern (z. B. 5xx, Rate Limit) NICHT retryen — das macht
      // der Anthropic-Client selbst (maxRetries=2 mit Backoff).
      // Hier retryen wir nur Parse/Schema-Fehler.
      if (err instanceof GenerationError && err.stage !== "api") {
        continue;
      }
      break;
    }
  }

  // Wenn wir hier ankommen, sind alle Retries gescheitert.
  if (lastError instanceof GenerationError) throw lastError;
  throw new GenerationError(
    "api",
    `Generation nach ${retryCount} Versuchen fehlgeschlagen: ${lastError?.message ?? "unbekannt"}`
  );
}

function buildDefaultUserPrompt(inputs: GenerateDocumentOptions<unknown>["inputs"]): string {
  const parts: string[] = [];
  if (inputs.structuredData) {
    parts.push("## Kontext\n```json\n" + JSON.stringify(inputs.structuredData, null, 2) + "\n```");
  }
  if (inputs.referenceDocuments?.length) {
    parts.push("## Referenz-Dokumente\n" + inputs.referenceDocuments.join("\n\n---\n\n"));
  }
  if (inputs.transcript) {
    parts.push("## Transkript\n" + inputs.transcript);
  }
  parts.push("\nLiefere den strukturierten Output als reines JSON, ohne Erklärungen.");
  return parts.join("\n\n");
}

/**
 * Sehr grobe Cost-Schätzung in EUR-Cents (für Telemetry-Reports).
 * Anthropic-Preise (April 2026):
 *   Haiku 4.5:  ~$0.80 / 1M input tokens, $4.00 / 1M output tokens
 *   Sonnet 4.5: ~$3.00 / 1M input tokens, $15.00 / 1M output tokens
 *   1 USD ≈ 0.92 EUR
 */
function estimateCostCents(model: string, inputTokens: number, outputTokens: number): number {
  const isHaiku = model.toLowerCase().includes("haiku");
  const inputUsdPerToken = isHaiku ? 0.80 / 1_000_000 : 3.0 / 1_000_000;
  const outputUsdPerToken = isHaiku ? 4.0 / 1_000_000 : 15.0 / 1_000_000;
  const usdCents = (inputTokens * inputUsdPerToken + outputTokens * outputUsdPerToken) * 100;
  return Math.round(usdCents * 0.92);
}

/**
 * Schmaler Helper für per-Section Refinement (z. B. "AI improve" auf einem
 * einzelnen TOP). Re-Use des generateDocument-Pfads, aber mit reasoning-Modell.
 */
export async function refineSection<TOutput>(opts: Omit<GenerateDocumentOptions<TOutput>, "model"> & {
  maxTokens?: number;
}): Promise<GenerateDocumentResult<TOutput>> {
  return generateDocument({
    ...opts,
    model: "reasoning",
    maxTokens: opts.maxTokens ?? 2048,
  });
}

// Re-export Zod helper für Konsumenten
export { z };
export type { ZodSchema };
