import { NextResponse } from "next/server";
import { cleanupOldAudio, isAuthorizedCron } from "@flow/storage";


export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * DSGVO-Cron: Audios aelter als 30 Tage werden geloescht.
 * Vercel-Cron-Schedule in vercel.json.
 */
export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await cleanupOldAudio({
    bucket: "gefaehrdungsbeurteilung-recordings",
    table: "gbus",
    pathColumn: "recording_path",
    dateColumn: "created_at",
    olderThanDays: 30,
    product: "gefaehrdungsbeurteilung",
  });

  return NextResponse.json({
    ok: true,
    scanned: result.scanned,
    deleted: result.deleted,
    failedCount: result.failed.length,
    durationMs: result.durationMs,
  });
}
