/**
 * Lightweight health endpoint fuer Vercel/Uptime-Monitoring.
 *
 * Pruefungen:
 *   - Anwendung antwortet (Next.js + Runtime)
 *   - Kritische ENVs sind gesetzt (nicht: ob sie gueltig sind — das wuerde
 *     externe Services anstarten und Quota verbrauchen)
 *
 * Gibt 200 zurueck wenn alle erforderlichen ENVs vorhanden sind.
 * Gibt 503 zurueck wenn welche fehlen — fuer Vercel-Healthchecks geeignet.
 */
export const dynamic = "force-dynamic";

const REQUIRED_ENVS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

export async function GET() {
  const missing = REQUIRED_ENVS.filter((k) => !process.env[k]);
  const ok = missing.length === 0;

  return Response.json(
    {
      status: ok ? "ok" : "degraded",
      missing_envs: missing,
      product: process.env.PRODUCT_SLUG ?? "unknown",
      ts: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 }
  );
}
