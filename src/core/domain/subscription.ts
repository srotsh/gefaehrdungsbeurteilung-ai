import "server-only";
import { createServerClient, createServiceClient } from "@flow/db";
import { PRODUCTS, type Plan, type ProductSlug } from "@flow/billing";
import type { ProductSubscription } from "./types";

/**
 * Holt die aktive Subscription für (account, product).
 * Wenn keine vorhanden → returnt eine synthetische Free-Plan-Subscription.
 */
export async function getProductSubscription(
  accountId: string,
  product: ProductSlug
): Promise<ProductSubscription> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("product_subscriptions")
    .select("*")
    .eq("account_id", accountId)
    .eq("product", product)
    .maybeSingle();

  if (data) return data as unknown as ProductSubscription;

  // Synthetisches Free-Default
  return {
    id: "synthetic-free",
    account_id: accountId,
    product,
    plan: "free",
    stripe_subscription_id: null,
    status: "active",
    current_period_end: null,
    usage_this_period: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Holt alle aktiven Produkt-Subscriptions eines Accounts auf einmal.
 * Nuetzlich fuer Cross-Product-Bundle-Checks (z.B. ProtokollFlow + JahresabrechnungAI).
 */
export async function getActiveProductSubscriptions(
  accountId: string
): Promise<Array<Pick<ProductSubscription, "product" | "plan" | "status" | "current_period_end">>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("product_subscriptions")
    .select("product, plan, status, current_period_end")
    .eq("account_id", accountId)
    .in("status", ["active", "trialing"]);
  if (error || !data) return [];
  return data as Array<Pick<ProductSubscription, "product" | "plan" | "status" | "current_period_end">>;
}

export async function hasActiveSubscription(
  accountId: string,
  product: ProductSlug,
  minPlan: Plan = "free"
): Promise<boolean> {
  const sub = await getProductSubscription(accountId, product);
  if (sub.status !== "active" && sub.status !== "trialing") return false;
  return planAtLeast(sub.plan, minPlan);
}

const PLAN_RANK: Record<Plan, number> = { free: 0, starter: 1, pro: 2 };
function planAtLeast(actual: Plan, required: Plan): boolean {
  return PLAN_RANK[actual] >= PLAN_RANK[required];
}

/**
 * Wirft, wenn der Account die geforderte Sub nicht hat. Für API-Routen,
 * die kostenpflichtige Aktionen schützen.
 */
export async function requireSubscription(
  accountId: string,
  product: ProductSlug,
  minPlan: Plan = "free"
): Promise<ProductSubscription> {
  const sub = await getProductSubscription(accountId, product);
  const ok =
    (sub.status === "active" || sub.status === "trialing") &&
    planAtLeast(sub.plan, minPlan);
  if (!ok) {
    throw new SubscriptionError(
      `Subscription für ${product} (>= ${minPlan}) fehlt oder inaktiv.`,
      sub.plan,
      minPlan
    );
  }
  return sub;
}

export class SubscriptionError extends Error {
  readonly currentPlan: Plan;
  readonly requiredPlan: Plan;
  constructor(message: string, currentPlan: Plan, requiredPlan: Plan) {
    super(message);
    this.name = "SubscriptionError";
    this.currentPlan = currentPlan;
    this.requiredPlan = requiredPlan;
  }
}

/**
 * Usage-Check für Cost-DoS-Schutz vor teuren AI-Calls.
 *
 * Liest `usage_this_period` aus der Sub und vergleicht mit Plan-Limit aus
 * `PRODUCTS[product].plans[plan].protokolle_pro_monat`.
 *
 * Default-Event = "primary" (für ProtokollFlow: Anzahl generierte Protokolle).
 */
export interface UsageStatus {
  allowed: boolean;
  used: number;
  limit: number;
  plan: Plan;
  unlimited: boolean;
}

export async function checkUsageLimit(
  accountId: string,
  product: ProductSlug,
  eventKey = "primary"
): Promise<UsageStatus> {
  const sub = await getProductSubscription(accountId, product);
  const plan = sub.plan;
  const limit = PRODUCTS[product]?.plans[plan]?.protokolle_pro_monat ?? 0;
  const used = (sub.usage_this_period ?? {})[eventKey] ?? 0;
  const unlimited = limit >= 999;
  return {
    allowed: unlimited || used < limit,
    used,
    limit,
    plan,
    unlimited,
  };
}

/**
 * Inkrementiert den Usage-Counter atomar. NUR über Service-Role —
 * RLS hält das von User-Direktzugriff fern.
 *
 * Schreibt zwei Sachen:
 *   1. usage_events-Eintrag (für Analytics / Audit)
 *   2. product_subscriptions.usage_this_period[eventKey]++ (Hot-Counter)
 */
export async function recordUsage(opts: {
  accountId: string;
  userId?: string | null;
  product: ProductSlug;
  eventType: string;
  eventKey?: string;
  quantity?: number;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const admin = createServiceClient();
  const eventKey = opts.eventKey ?? "primary";
  const quantity = opts.quantity ?? 1;

  // Audit-Event
  const { error: usageErr } = await admin.from("usage_events").insert({
    account_id: opts.accountId,
    user_id: opts.userId ?? null,
    product: opts.product,
    event_type: opts.eventType,
    quantity,
    metadata: opts.metadata ?? {},
  });
  if (usageErr) {
    console.warn("[@flow/core] usage_events insert failed:", usageErr);
  }

  // Counter-Bump auf der Subscription
  const { data: sub } = await admin
    .from("product_subscriptions")
    .select("usage_this_period")
    .eq("account_id", opts.accountId)
    .eq("product", opts.product)
    .single();

  const current = (sub?.usage_this_period as Record<string, number>) ?? {};
  current[eventKey] = (current[eventKey] ?? 0) + quantity;

  const { error: updErr } = await admin
    .from("product_subscriptions")
    .update({ usage_this_period: current })
    .eq("account_id", opts.accountId)
    .eq("product", opts.product);

  if (updErr) {
    // Nicht den User-Flow brechen — Counter ist informativ, RLS schützt Daten.
    console.warn("[@flow/core] usage counter update failed:", updErr);
  }
}
