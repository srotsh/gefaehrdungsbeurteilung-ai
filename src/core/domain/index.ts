/**
 * @flow/core — Account-Modell, Subscription-Gate, Usage-Metering, Audit-Log.
 *
 * Verwendung in Server-Actions oder API-Routen:
 *
 * ```ts
 * import { requireAccount, requireSubscription, recordUsage, auditLog } from "@flow/core";
 *
 * export async function POST(req: Request) {
 *   const { account, user } = await requireAccount();
 *   await requireSubscription(account.id, "protokollflow", "free");
 *   // ... do work ...
 *   await recordUsage({
 *     accountId: account.id, userId: user.id,
 *     product: "protokollflow", eventType: "protokoll_generated",
 *   });
 *   await auditLog({
 *     accountId: account.id, userId: user.id, product: "protokollflow",
 *     entityType: "protokoll", entityId: "...", action: "generated",
 *   });
 * }
 * ```
 */

export {
  getCurrentUser,
  getCurrentAccount,
  requireUser,
  requireAccount,
  getAccountByIdAsAdmin,
  UnauthorizedError,
} from "./account";

export {
  getProductSubscription,
  getActiveProductSubscriptions,
  hasActiveSubscription,
  requireSubscription,
  checkUsageLimit,
  recordUsage,
  SubscriptionError,
  type UsageStatus,
} from "./subscription";

export { getApiIdentity, type ApiIdentity } from "./api-guard";

export { auditLog, type AuditEntry } from "./audit";

export {
  checkRateLimit,
  enforceRateLimit,
  RateLimitError,
  STANDARD_LIMITS,
  type RateLimitWindow,
  type RateLimitOptions,
  type RateLimitResult,
} from "./rate-limit";

export type { Account, User, ProductSubscription, ProductSlug, Plan } from "./types";
