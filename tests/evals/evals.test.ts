/**
 * Golden-File-Generation-Evals (live). Nur mit EVAL_LIVE=1 + ANTHROPIC_API_KEY.
 * Snapshot-Refresh: UPDATE_SNAPSHOTS=1. Ohne EVAL_LIVE: Suite geskippt.
 */
import { describe, it, expect } from "vitest";
import path from "node:path";
import {
  runEval,
  loadAllFixtures,
  assertSchema,
  assertSnapshot,
  assertCustom,
  generateDocument,
} from "@flow/ai";
import { systemPromptFor } from "@/lib/ai/system-prompt";
import { GbuDataSchema, type Branche, type GbuData } from "@/lib/validations";

interface EvalInput {
  branche: Branche;
  transcript: string;
  structuredData: Record<string, unknown>;
}

interface EvalExpected {
  minTaetigkeiten?: number;
  mustMentionFaktoren?: string[];
}

const LIVE = process.env.EVAL_LIVE === "1" && !!process.env.ANTHROPIC_API_KEY;
const FIXTURES_DIR = path.join(__dirname, "../fixtures");
const SNAPSHOTS_DIR = path.join(__dirname, "../__snapshots__");

describe.skipIf(!LIVE)("generation evals (live)", () => {
  const fixtures = loadAllFixtures<EvalInput, EvalExpected>(FIXTURES_DIR);

  for (const [name, fix] of fixtures) {
    it(
      name,
      async () => {
        const result = await runEval<EvalInput, GbuData>({
          name,
          tags: fix.tags,
          input: fix.input,
          generate: async (i) =>
            (
              await generateDocument({
                systemPrompt: systemPromptFor(i.branche),
                inputs: { transcript: i.transcript, structuredData: i.structuredData },
                outputSchema: GbuDataSchema,
                model: "reasoning",
                temperature: 0.1,
              })
            ).output as GbuData,
          assertions: [
            assertSchema(GbuDataSchema),
            assertCustom("Tätigkeiten-Mindestanzahl", (out) =>
              out.taetigkeiten.length >= (fix.expected?.minTaetigkeiten ?? 1)
                ? true
                : `nur ${out.taetigkeiten.length} Tätigkeiten`
            ),
            assertCustom("Pflicht-Gefährdungsfaktoren erkannt", (out) => {
              const vorhanden = new Set(
                out.taetigkeiten.flatMap((t) => t.gefaehrdungen.map((g) => g.faktor))
              );
              const fehlend = (fix.expected?.mustMentionFaktoren ?? []).filter(
                (f) => !vorhanden.has(f as never)
              );
              return fehlend.length === 0 ? true : `fehlende Faktoren: ${fehlend.join(", ")}`;
            }),
            assertCustom("Psychische Belastung immer vorhanden", (out) => {
              const hat = out.taetigkeiten.some((t) =>
                t.gefaehrdungen.some((g) => g.faktor === "psychische_belastung")
              );
              return hat ? true : "keine Gefährdung mit Faktor psychische_belastung";
            }),
            assertCustom("Keine erfundenen Grenzwerte", (out) => {
              // Transcript nennt keine dB/mg-Werte → Output darf keine erfinden.
              const json = JSON.stringify(out);
              return /\d+\s*(dB|mg\/m|µg\/m|ppm)/i.test(json)
                ? "Grenzwert-Angabe im Output gefunden"
                : true;
            }),
            assertSnapshot({ dir: SNAPSHOTS_DIR, name }),
          ],
        });
        expect(result.failures, result.failures.join("; ")).toEqual([]);
      },
      240_000
    );
  }
});
