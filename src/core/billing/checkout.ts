import "server-only";
import { getStripe } from "./stripe-client";
import {
  getProductPrice,
  type BillingInterval,
  type Plan,
  type ProductSlug,
} from "./catalog";

export interface CreateCheckoutSessionOptions {
  product: ProductSlug;
  plan: Exclude<Plan, "free">;
  interval: BillingInterval;
  /** Account-ID — wird als metadata.account_id in Stripe gesetzt */
  accountId: string;
  /** Optional: Customer-Email vorbefüllen */
  customerEmail?: string;
  /** Optional: existierende Stripe-Customer-ID (z. B. für Cross-Product) */
  stripeCustomerId?: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Erstellt eine Stripe-Checkout-Session und liefert die URL zum Redirect zurück.
 * Setzt `metadata.product` und `metadata.account_id`, damit der Webhook später
 * die Subscription dem richtigen Produkt + Account zuordnen kann.
 */
export async function createCheckoutSession(
  opts: CreateCheckoutSessionOptions
): Promise<{ url: string; sessionId: string }> {
  const priceId = getProductPrice(opts.product, opts.plan, opts.interval);
  if (!priceId) {
    throw new Error(
      `[@flow/billing] Kein Stripe-Preis konfiguriert für ${opts.product}/${opts.plan}/${opts.interval}`
    );
  }

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card", "sepa_debit"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer: opts.stripeCustomerId,
    customer_email: opts.stripeCustomerId ? undefined : opts.customerEmail,
    client_reference_id: opts.accountId,
    metadata: {
      product: opts.product,
      account_id: opts.accountId,
      plan: opts.plan,
      interval: opts.interval,
    },
    subscription_data: {
      metadata: {
        product: opts.product,
        account_id: opts.accountId,
      },
    },
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    allow_promotion_codes: true,
  });

  if (!session.url) {
    throw new Error("[@flow/billing] Stripe lieferte keine Checkout-URL");
  }

  return { url: session.url, sessionId: session.id };
}

/**
 * Erstellt eine Customer-Portal-Session für Self-Service (Plan ändern,
 * Zahlungsmethode aktualisieren, Sub kündigen).
 */
export async function createPortalSession(opts: {
  stripeCustomerId: string;
  returnUrl: string;
}): Promise<{ url: string }> {
  const portal = await getStripe().billingPortal.sessions.create({
    customer: opts.stripeCustomerId,
    return_url: opts.returnUrl,
  });
  return { url: portal.url };
}
