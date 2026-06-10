import { NextResponse } from "next/server";
import { createServiceClient } from "@flow/db";
import { generateDocument } from "@flow/ai";
import {
  enforceRateLimit,
  RateLimitError,
  recordUsage,
  STANDARD_LIMITS,
  getApiIdentity,
  checkUsageLimit,
} from "@flow/core";
import { systemPromptFor, PROMPT_VERSION } from "@/lib/ai/system-prompt";
import { GbuDataSchema, type Branche } from "@/lib/validations";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const identity = await getApiIdentity();
  if (!identity) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  const { gbuId } = (await req.json()) as { gbuId?: string };
  if (!gbuId) return NextResponse.json({ error: "gbuId fehlt" }, { status: 400 });

  const admin = createServiceClient();
  const { data: gbu, error } = await admin
    .from("gbus")
    .select("id, account_id, arbeitsbereich_id, transcript_raw")
    .eq("id", gbuId)
    .single();
  if (error || !gbu || gbu.account_id !== identity.accountId) {
    return NextResponse.json({ error: "Beurteilung nicht gefunden" }, { status: 404 });
  }
  if (!gbu.transcript_raw) {
    return NextResponse.json(
      { error: "Eingabe fehlt — bitte erst transkribieren oder Checkliste ausfüllen." },
      { status: 400 }
    );
  }

  const usage = await checkUsageLimit(identity.accountId, "gefaehrdungsbeurteilung");
  if (!usage.allowed) {
    return NextResponse.json(
      { error: `Monatslimit erreicht (${usage.used}/${usage.limit}, Plan ${usage.plan}). Bitte upgraden.` },
      { status: 402 }
    );
  }

  try {
    await enforceRateLimit({
      accountId: identity.accountId,
      product: "gefaehrdungsbeurteilung",
      eventType: "generate-gbu",
      windows: STANDARD_LIMITS.generate,
    });
  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json(
        { error: err.message },
        { status: 429, headers: { "Retry-After": String(err.retryAfterSeconds) } }
      );
    }
    throw err;
  }

  const { data: bereich } = await admin
    .from("arbeitsbereiche")
    .select("name, branche, standort, beschreibung")
    .eq("id", gbu.arbeitsbereich_id)
    .single();
  if (!bereich) {
    return NextResponse.json({ error: "Arbeitsbereich nicht gefunden" }, { status: 404 });
  }

  try {
    const result = await generateDocument({
      systemPrompt: systemPromptFor(bereich.branche as Branche),
      inputs: {
        transcript: gbu.transcript_raw,
        structuredData: {
          arbeitsbereich_name: bereich.name,
          branche: bereich.branche,
          standort: bereich.standort,
          beschreibung: bereich.beschreibung,
        },
      },
      outputSchema: GbuDataSchema,
      // Sensible, rechtlich relevante Strukturierung → reasoning-Modell.
      model: "reasoning",
      temperature: 0.1,
    });

    await admin
      .from("gbus")
      .update({
        gbu_data: result.output,
        pruefen_markers: result.pruefenMarkers,
        status: "review",
      })
      .eq("id", gbuId);

    await recordUsage({
      accountId: identity.accountId,
      userId: identity.userId,
      product: "gefaehrdungsbeurteilung",
      eventType: "generate-gbu",
      metadata: {
        gbu_id: gbuId,
        tokens_used: result.tokensUsed,
        cost_eur_cents: result.costEurCents,
        prompt_version: PROMPT_VERSION,
      },
    });

    return NextResponse.json({
      ok: true,
      tokensUsed: result.tokensUsed,
      pruefenMarkers: result.pruefenMarkers.length,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
