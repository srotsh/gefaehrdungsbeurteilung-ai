import "server-only";
import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Stripe-Client (lazy + Singleton). Apps müssen STRIPE_SECRET_KEY in der
 * Environment setzen.
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("[@flow/billing] STRIPE_SECRET_KEY nicht gesetzt.");
    }
    _stripe = new Stripe(key, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

/**
 * Test-Helper: Singleton resetten.
 */
export function __resetStripeForTests(): void {
  _stripe = null;
}
