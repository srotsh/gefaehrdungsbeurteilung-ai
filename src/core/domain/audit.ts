import "server-only";
import { createServiceClient } from "@flow/db";
import type { ProductSlug } from "@flow/billing";

export interface AuditEntry {
  accountId: string;
  userId?: string | null;
  product?: ProductSlug | null;
  entityType?: string | null;
  entityId?: string | null;
  action: string;
  metadata?: Record<string, unknown>;
}

/**
 * Cross-cutting Audit-Logger. Schreibt in audit_log über Service-Role.
 * Schluckt Fehler — Audit darf nie den User-Flow brechen.
 */
export async function auditLog(entry: AuditEntry): Promise<void> {
  try {
    const admin = createServiceClient();
    await admin.from("audit_log").insert({
      account_id: entry.accountId,
      user_id: entry.userId ?? null,
      product: entry.product ?? null,
      entity_type: entry.entityType ?? null,
      entity_id: entry.entityId ?? null,
      action: entry.action,
      metadata: entry.metadata ?? {},
    });
  } catch (err) {
    console.warn("[@flow/core] audit insert failed:", err);
  }
}
