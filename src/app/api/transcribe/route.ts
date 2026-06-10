import { NextResponse } from "next/server";
import { createServiceClient } from "@flow/db";
import { getSignedUrl } from "@flow/storage";
import { transcribe } from "@flow/ai";
import {
  enforceRateLimit,
  RateLimitError,
  STANDARD_LIMITS,
  getApiIdentity,
  recordUsage,
} from "@flow/core";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const identity = await getApiIdentity();
  if (!identity) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  const { gbuId } = (await req.json()) as { gbuId?: string };
  if (!gbuId) return NextResponse.json({ error: "gbuId fehlt" }, { status: 400 });

  const admin = createServiceClient();
  const { data: gbu } = await admin
    .from("gbus")
    .select("id, recording_path, account_id")
    .eq("id", gbuId)
    .single();
  if (!gbu?.recording_path || gbu.account_id !== identity.accountId) {
    return NextResponse.json({ error: "Beurteilung oder Audio nicht gefunden" }, { status: 404 });
  }

  try {
    await enforceRateLimit({
      accountId: identity.accountId,
      product: "gefaehrdungsbeurteilung",
      eventType: "transcribe",
      windows: STANDARD_LIMITS.transcribe,
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

  try {
    const url = await getSignedUrl({
      bucket: "gefaehrdungsbeurteilung-recordings",
      path: gbu.recording_path,
      expiresInSeconds: 3600,
    });
    const audioRes = await fetch(url);
    if (!audioRes.ok) throw new Error(`Audio-Download HTTP ${audioRes.status}`);
    const blob = await audioRes.blob();

    const { text } = await transcribe(
      blob,
      gbu.recording_path.split("/").pop() ?? "rundgang.bin",
      "de"
    );
    await admin.from("gbus").update({ transcript_raw: text }).eq("id", gbuId);

    // eventKey "transcribe": zählt fürs Rate-Limit, nicht fürs Plan-Limit ("primary").
    await recordUsage({
      accountId: identity.accountId,
      userId: identity.userId,
      product: "gefaehrdungsbeurteilung",
      eventType: "transcribe",
      eventKey: "transcribe",
      metadata: { gbu_id: gbuId },
    });

    // Auto-Generate anstoßen — Session-Cookies weiterreichen, /api/generate prüft Auth.
    void fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") ?? "",
      },
      body: JSON.stringify({ gbuId }),
    }).catch(() => undefined);

    return NextResponse.json({ ok: true, length: text.length });
  } catch (err) {
    const msg = (err as Error).message;
    await admin
      .from("gbus")
      .update({ pruefen_markers: [{ stage: "transcribe", error: msg }] })
      .eq("id", gbuId);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
