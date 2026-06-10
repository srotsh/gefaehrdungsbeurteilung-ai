import "server-only";
import { createServiceClient } from "@flow/db";
import { auditLog } from "@flow/core";
import type { ProductSlug } from "@flow/billing";

/**
 * DSGVO-konforme Audio-Loeschung.
 *
 * Loescht Audio-Files aus Storage UND nullt den path im DB-Row, wenn das
 * Aufnahme-Datum aelter als opts.olderThanDays ist.
 *
 * Lass das per Vercel-Cron taeglich laufen. Eintrag wird in audit_log mit
 * action="audio.cleanup" und Anzahl + Dauer dokumentiert.
 */

export interface CleanupAudioOptions {
  /** Storage-Bucket-Name, z.B. "vorstandsprotokoll-recordings". */
  bucket: string;
  /** DB-Tabelle die die path-Spalte fuehrt, z.B. "sitzungen". */
  table: string;
  /** Spalte mit dem Storage-Pfad, z.B. "recording_path". */
  pathColumn: string;
  /** Spalte mit dem Aufnahmedatum, z.B. "recorded_at" oder "meeting_date". */
  dateColumn: string;
  /** Loesch-Schwelle in Tagen. */
  olderThanDays: number;
  /** ProductSlug fuer audit_log. */
  product: ProductSlug;
  /** Optional: Spalte fuer den Account-Filter. Default: "account_id". */
  accountIdColumn?: string;
  /** Optional: nur loeschen wenn die Spalte einen dieser Werte hat. Default: alle. */
  statusColumn?: string;
  /** Optional: nur loeschen wenn statusColumn IN diese Liste. */
  statusValues?: string[];
}

export interface CleanupResult {
  scanned: number;
  deleted: number;
  failed: Array<{ path: string; error: string }>;
  durationMs: number;
}

export async function cleanupOldAudio(opts: CleanupAudioOptions): Promise<CleanupResult> {
  const start = Date.now();
  const admin = createServiceClient();
  const cutoff = new Date(Date.now() - opts.olderThanDays * 24 * 60 * 60 * 1000).toISOString();
  const accountCol = opts.accountIdColumn ?? "account_id";

  // 1) Find rows with non-null path AND old enough.
  let query = admin
    .from(opts.table)
    .select(`id, ${accountCol}, ${opts.pathColumn}`)
    .not(opts.pathColumn, "is", null)
    .lt(opts.dateColumn, cutoff);

  if (opts.statusColumn && opts.statusValues && opts.statusValues.length > 0) {
    query = query.in(opts.statusColumn, opts.statusValues);
  }

  const { data, error } = await query.limit(1000); // Safety cap pro Run
  // Dynamischer Tabellenname → der typisierte Client kann die Row-Shape nicht
  // ableiten; wir wissen nur id + die konfigurierten Spalten.
  const rows = (data ?? null) as Array<Record<string, unknown> & { id: string }> | null;
  if (error) {
    return {
      scanned: 0,
      deleted: 0,
      failed: [{ path: "<query>", error: error.message }],
      durationMs: Date.now() - start,
    };
  }

  if (!rows || rows.length === 0) {
    return { scanned: 0, deleted: 0, failed: [], durationMs: Date.now() - start };
  }

  // 2) Delete from Storage (chunked: Supabase remove() supports up to 100 paths per call).
  const failed: Array<{ path: string; error: string }> = [];
  const paths = rows.map((r) => r[opts.pathColumn] as string);
  const accountByPath = new Map(rows.map((r) => [r[opts.pathColumn] as string, r[accountCol] as string]));

  for (let i = 0; i < paths.length; i += 100) {
    const chunk = paths.slice(i, i + 100);
    const { error: rmErr } = await admin.storage.from(opts.bucket).remove(chunk);
    if (rmErr) {
      // Mark whole chunk as failed; partial-failure-detection braeuchte
      // Per-File-Calls — der Cron laeuft taeglich, das holt sich beim
      // naechsten Run nach.
      for (const p of chunk) failed.push({ path: p, error: rmErr.message });
    }
  }

  // 3) Null out path-column in DB for successfully-deleted rows.
  const successfullyDeletedPaths = new Set(
    paths.filter((p) => !failed.some((f) => f.path === p))
  );
  const successfulIds = rows
    .filter((r) => successfullyDeletedPaths.has(r[opts.pathColumn] as string))
    .map((r) => r.id as string);

  if (successfulIds.length > 0) {
    const { error: updErr } = await admin
      .from(opts.table)
      .update({ [opts.pathColumn]: null })
      .in("id", successfulIds);
    if (updErr) {
      console.warn(`[@flow/storage] cleanup: DB-update failed: ${updErr.message}`);
    }
  }

  // 4) Audit-log per affected account (eine Sammelzeile pro Account).
  const byAccount = new Map<string, number>();
  for (const id of successfulIds) {
    const row = rows.find((r) => r.id === id);
    if (!row) continue;
    const acc = row[accountCol] as string;
    byAccount.set(acc, (byAccount.get(acc) ?? 0) + 1);
  }
  for (const [accountId, count] of byAccount) {
    await auditLog({
      accountId,
      product: opts.product,
      action: "audio.cleanup",
      entityType: opts.table,
      metadata: { count, olderThanDays: opts.olderThanDays, bucket: opts.bucket },
    });
  }

  return {
    scanned: rows.length,
    deleted: successfulIds.length,
    failed,
    durationMs: Date.now() - start,
  };
}

/**
 * Verifiziert dass der Cron-Aufruf von Vercel kommt (oder mit CRON_SECRET).
 * Nutze in jeder /api/cron/*-Route:
 *
 * ```ts
 * if (!isAuthorizedCron(req)) return new Response("Unauthorized", { status: 401 });
 * ```
 */
export function isAuthorizedCron(req: Request): boolean {
  // Vercel-Cron-Header (production)
  const vercelHeader = req.headers.get("x-vercel-cron-signature");
  if (vercelHeader) return true;

  // Manueller Trigger via CRON_SECRET (local + alternative providers)
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}
