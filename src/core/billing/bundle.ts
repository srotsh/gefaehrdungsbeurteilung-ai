import "server-only";
import { createServiceClient } from "@flow/db";
import { getStripe } from "./stripe-client";
import type { ProductSlug } from "./catalog";

/**
 * Cross-Product Bundle-Pricing.
 *
 * Strategie aus den Per-Produkt-MDs:
 *   ProtokollFlow Pro (199 €/m) + JahresabrechnungAI Pro (299 €/m) = 498 €/m
 *   -> Bundle: 349 €/m -> 149 €/m gespart (~30 % Rabatt)
 *
 * Implementation: Ein Stripe-Coupon (z. B. `bundle_pro_30pct`) wird beiden
 * Subscriptions zugewiesen, wenn der Account beide Produkte aktiv hat. Wird
 * eines gekündigt, wird das Coupon vom verbleibenden Sub entfernt.
 *
 * Coupon-ID kommt aus ENV `STRIPE_COUPON_BUNDLE_PRO`. Wenn nicht gesetzt:
 * Funktion ist no-op (silent), damit Self-Hosting ohne Bundle-Setup nicht bricht.
 */

const BUNDLE_PAIR: ReadonlyArray<ProductSlug> = ["protokollflow", "jahresabrechnung"];

interface ActiveSubInfo {
  product: ProductSlug;
  plan: string | null;
  status: string;
  stripe_subscription_id: string | null;
}

async function loadBundleSubs(accountId: string): Promise<ActiveSubInfo[]> {
  const admin = createServiceClient();
  const { data } = await admin
    .from("product_subscriptions")
    .select("product, plan, status, stripe_subscription_id")
    .eq("account_id", accountId)
    .in("product", BUNDLE_PAIR as unknown as string[]);
  return (data ?? []) as unknown as ActiveSubInfo[];
}

function isEligible(s: ActiveSubInfo): boolean {
  return (
    (s.status === "active" || s.status === "trialing") &&
    s.plan === "pro" &&
    Boolean(s.stripe_subscription_id)
  );
}

/**
 * Pruefe Eligibility und wende Bundle-Coupon idempotent an. Wenn beide
 * Produkte den Pro-Plan aktiv haben: Coupon auf beide Stripe-Subs setzen.
 * Sonst: Coupon von beiden Subs entfernen.
 *
 * Idempotent: Stripe wirft nicht, wenn der Coupon bereits gleich ist.
 */
export async function reconcileBundleDiscount(accountId: string): Promise<{
  applied: boolean;
  affectedSubs: string[];
  reason: string;
}> {
  const couponId = process.env.STRIPE_COUPON_BUNDLE_PRO;
  if (!couponId) {
    return { applied: false, affectedSubs: [], reason: "STRIPE_COUPON_BUNDLE_PRO nicht gesetzt." };
  }

  const subs = await loadBundleSubs(accountId);
  const eligible = subs.filter(isEligible);
  const allEligible = eligible.length === BUNDLE_PAIR.length;

  const stripe = getStripe();
  const affected: string[] = [];

  if (allEligible) {
    // Apply coupon to both
    for (const s of eligible) {
      try {
        await stripe.subscriptions.update(s.stripe_subscription_id!, {
          discounts: [{ coupon: couponId }],
        });
        affected.push(s.stripe_subscription_id!);
      } catch (err) {
        console.warn(
          `[@flow/billing] bundle apply failed for ${s.product}/${s.stripe_subscription_id}:`,
          err instanceof Error ? err.message : err
        );
      }
    }
    return {
      applied: true,
      affectedSubs: affected,
      reason: `Bundle-Rabatt auf ${affected.length} Sub(s) angewendet.`,
    };
  }

  // Not eligible — remove coupon from any active sub of the bundle pair.
  for (const s of subs) {
    if (!s.stripe_subscription_id) continue;
    try {
      await stripe.subscriptions.update(s.stripe_subscription_id, { discounts: [] });
      affected.push(s.stripe_subscription_id);
    } catch (err) {
      console.warn(
        `[@flow/billing] bundle remove failed for ${s.product}/${s.stripe_subscription_id}:`,
        err instanceof Error ? err.message : err
      );
    }
  }
  return {
    applied: false,
    affectedSubs: affected,
    reason: `Bundle-Voraussetzung nicht erfuellt — Coupon von ${affected.length} Sub(s) entfernt.`,
  };
}

/**
 * Hilfsfunktion fuer Webhook-Hooks: triggert Bundle-Reconcile nur, wenn
 * das gerade verarbeitete Produkt zum Bundle gehoert.
 */
export async function maybeReconcileBundle(
  accountId: string,
  product: ProductSlug
): Promise<void> {
  if (!BUNDLE_PAIR.includes(product)) return;
  try {
    await reconcileBundleDiscount(accountId);
  } catch (err) {
    console.warn("[@flow/billing] bundle reconcile failed:", err);
  }
}
