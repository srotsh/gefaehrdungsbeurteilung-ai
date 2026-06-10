import "server-only";
import { createServiceClient } from "@flow/db";
import type { ProductSlug } from "@flow/billing";

/**
 * Sliding-Window Rate-Limit basierend auf der bestehenden `usage_events`-Tabelle.
 *
 * Idee:
 *   - Jeder API-Aufruf, der Cost-DoS-Risiko hat (Whisper, Claude), schreibt
 *     ein usage_events-Row.
 *   - VOR der teuren Operation: COUNT der letzten N Sekunden gegen Limit.
 *   - Wenn ueberschritten -> RateLimitError (Caller liefert 429).
 *
 * Vorteile:
 *   - Kein Redis. Postgres reicht. Funktioniert mit der existierenden Engine-Tabelle.
 *   - RLS-safe: Service-Client nutzt admin, RLS schuetzt User-Direktzugriff.
 *   - Atomar genug: Race-Condition zwischen check + insert toleriert kleine
 *     Ueberlaufe (1-2 Calls), nicht 100x.
 *
 * Performance-Hinweis: Index `idx_usage_events_account` (account_id, product, created_at)
 * ist in Migration 001 schon angelegt. COUNT-Query ist O(log n).
 */

export interface RateLimitWindow {
  /** Zeitfenster in Sekunden. Mehrere parallel moeglich (z.B. 60 + 3600). */
  windowSeconds: number;
  /** Maximale erlaubte Calls in diesem Fenster. */
  max: number;
}

export interface RateLimitOptions {
  accountId: string;
  product: ProductSlug;
  /** Event-Typ-Klassifizierer, z.B. "transcribe", "generate-protokoll". */
  eventType: string;
  /** Multiple Windows OR-verknuepft — alle muessen passen. */
  windows: RateLimitWindow[];
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Sekunden bis das engste Fenster wieder Platz hat (~). */
  retryAfterSeconds: number;
  /** Welches Window hat ausgeloest, falls !allowed. */
  triggeredWindow?: RateLimitWindow;
}

export async function checkRateLimit(
  opts: RateLimitOptions
): Promise<RateLimitResult> {
  const admin = createServiceClient();
  let minRemaining = Number.MAX_SAFE_INTEGER;
  let triggered: RateLimitWindow | undefined;
  let retryAfter = 0;

  for (const w of opts.windows) {
    const since = new Date(Date.now() - w.windowSeconds * 1000).toISOString();
    const { count, error } = await admin
      .from("usage_events")
      .select("*", { count: "exact", head: true })
      .eq("account_id", opts.accountId)
      .eq("product", opts.product)
      .eq("event_type", opts.eventType)
      .gte("created_at", since);

    if (error) {
      // Bei DB-Fehler nicht den User blocken, aber loggen
      console.warn("[@flow/core] rate-limit query failed:", error.message);
      continue;
    }

    const used = count ?? 0;
    const remaining = Math.max(0, w.max - used);
    if (remaining < minRemaining) minRemaining = remaining;
    if (used >= w.max) {
      triggered = w;
      retryAfter = Math.max(retryAfter, w.windowSeconds);
    }
  }

  return {
    allowed: !triggered,
    remaining: minRemaining === Number.MAX_SAFE_INTEGER ? 0 : minRemaining,
    retryAfterSeconds: retryAfter,
    triggeredWindow: triggered,
  };
}

/**
 * Wirft RateLimitError wenn Limit erreicht. Bequem fuer API-Routes:
 *
 * ```ts
 * try {
 *   await enforceRateLimit({ accountId, product: "pflegedoku", eventType: "transcribe",
 *     windows: [{ windowSeconds: 60, max: 10 }, { windowSeconds: 3600, max: 100 }] });
 * } catch (err) {
 *   if (err instanceof RateLimitError) {
 *     return new Response("Rate limit", { status: 429, headers: { "Retry-After": String(err.retryAfterSeconds) } });
 *   }
 *   throw err;
 * }
 * ```
 */
export async function enforceRateLimit(opts: RateLimitOptions): Promise<void> {
  const r = await checkRateLimit(opts);
  if (!r.allowed) {
    throw new RateLimitError(
      `Rate-Limit erreicht fuer ${opts.eventType}.`,
      r.retryAfterSeconds,
      r.triggeredWindow!
    );
  }
}

export class RateLimitError extends Error {
  readonly retryAfterSeconds: number;
  readonly window: RateLimitWindow;
  constructor(message: string, retryAfterSeconds: number, window: RateLimitWindow) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
    this.window = window;
  }
}

/**
 * Standard-Limits fuer typische LLM-Operationen. Apps koennen das nutzen
 * oder eigene definieren.
 */
export const STANDARD_LIMITS = {
  /** Transkription (Whisper). Realistisch ~1 pro Minute pro User. */
  transcribe: [
    { windowSeconds: 60, max: 10 },
    { windowSeconds: 3600, max: 100 },
    { windowSeconds: 86400, max: 500 },
  ] as RateLimitWindow[],

  /** Document-Generation (Claude). Teurer, deutlich strikter. */
  generate: [
    { windowSeconds: 60, max: 5 },
    { windowSeconds: 3600, max: 50 },
    { windowSeconds: 86400, max: 200 },
  ] as RateLimitWindow[],

  /** Bulk-Klassifikation (z.B. Jahresabrechnung CSV). Pro Account selten. */
  classify: [
    { windowSeconds: 60, max: 3 },
    { windowSeconds: 3600, max: 20 },
  ] as RateLimitWindow[],
};
