/**
 * @flow/billing — Stripe Multi-Product Subscription-Engine.
 *
 * Apps integrieren so:
 *   - Checkout-Route ruft `createCheckoutSession({ product, plan, interval, accountId, ... })`
 *   - Portal-Route ruft `createPortalSession({ stripeCustomerId, returnUrl })`
 *   - Webhook-Route ruft `handleStripeWebhook(req, "<product-slug>")`
 *
 * Subscription-State landet in der Shared-Tabelle `product_subscriptions`
 * (Migration 005). Pro Account × Produkt eine Row.
 */

export { getStripe, __resetStripeForTests } from "./stripe-client";
export {
  createCheckoutSession,
  createPortalSession,
  type CreateCheckoutSessionOptions,
} from "./checkout";
export { handleStripeWebhook, type WebhookResult } from "./webhook";
export { reconcileBundleDiscount, maybeReconcileBundle } from "./bundle";
export {
  PRODUCTS,
  getProductPrice,
  getPlanFromPriceId,
  type ProductSlug,
  type Plan,
  type BillingInterval,
  type ProductConfig,
  type PlanLimits,
  type PlanPricing,
} from "./catalog";
