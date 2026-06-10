import "server-only";
import type Stripe from "stripe";
import { createServiceClient } from "@flow/db";
import { getStripe } from "./stripe-client";
import { getPlanFromPriceId, type ProductSlug, type Plan } from "./catalog";
import { maybeReconcileBundle } from "./bundle";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const HANDLED_EVENTS = new Set<Stripe.Event.Type>([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
]);

const VALID_PRODUCTS: ReadonlySet<ProductSlug> = new Set<ProductSlug>([
  "protokollflow",
  "jahresabrechnung",
  "beratungsprotokoll",
  "vorstandsprotokoll",
  "pflegedoku",
  "mitarbeitergespraech",
  "therapiedoku",
  "gefaehrdungsbeurteilung",
  "schaden",
]);

export interface WebhookResult {
  status: number;
  body: Record<string, unknown>;
}

/**
 * Multi-Product Stripe-Webhook-Handler.
 *
 * Routet Events an die richtige product_subscriptions-Row anhand
 * `metadata.product` (gesetzt beim Checkout in createCheckoutSession).
 *
 * Schreibt in `product_subscriptions` und parallel — für Backward-Compat
 * während Transition — in `profiles` (nur für protokollflow).
 *
 * App nutzt das so:
 * ```ts
 * export async function POST(req: Request) {
 *   const result = await handleStripeWebhook(req, "protokollflow");
 *   return NextResponse.json(result.body, { status: result.status });
 * }
 * ```
 */
export async function handleStripeWebhook(
  req: Request,
  /**
   * Default-Produkt für Events OHNE explizite `metadata.product`.
   * Subscriptions, die im aktuellen Stripe-Account existieren BEVOR die
   * Multi-Product-Migration lief, haben kein metadata.product — die werden
   * dem Default zugeordnet.
   */
  defaultProductSlug: ProductSlug
): Promise<WebhookResult> {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return {
      status: 400,
      body: { error: "Webhook-Signatur oder Secret fehlt." },
    };
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    return {
      status: 400,
      body: {
        error: `Signatur ungültig: ${err instanceof Error ? err.message : "unbekannt"}`,
      },
    };
  }

  const admin = createServiceClient();

  // Idempotenz: stripe_events-Insert.
  try {
    const { error: insErr } = await admin
      .from("stripe_events")
      .insert({ id: event.id, type: event.type });
    if (insErr) {
      const code = (insErr as { code?: string }).code;
      if (code === "23505") {
        return { status: 200, body: { received: true, duplicate: true } };
      }
      // Lauter Fehler: ohne funktionierendes Event-Log gibt es keine
      // Duplikat-Erkennung (z. B. Tabelle fehlt → Migration nicht applied).
      console.error("[@flow/billing] idempotency log FAILED — duplicates undetected:", insErr);
    }
  } catch (err) {
    console.error("[@flow/billing] idempotency log threw — duplicates undetected:", err);
  }

  if (!HANDLED_EVENTS.has(event.type)) {
    return { status: 200, body: { received: true, ignored: true } };
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const accountId = pickAccountId(session);
        const product = pickProduct(session.metadata, defaultProductSlug);
        const customerId =
          typeof session.customer === "string" ? session.customer : null;
        const subId =
          typeof session.subscription === "string"
            ? session.subscription
            : (session.subscription as Stripe.Subscription | null)?.id ?? null;

        if (accountId && customerId) {
          await admin
            .from("accounts")
            .update({ stripe_customer_id: customerId })
            .eq("id", accountId);
        }

        // Sub bevorzugt aus Event-Payload, sonst retrieve()
        let sub: Stripe.Subscription | null = null;
        if (
          session.subscription &&
          typeof session.subscription !== "string"
        ) {
          sub = session.subscription as Stripe.Subscription;
        } else if (subId) {
          try {
            sub = await getStripe().subscriptions.retrieve(subId);
          } catch (err) {
            console.warn("[@flow/billing] subscription retrieve failed:", err);
          }
        }
        if (sub) {
          await syncSubscription(admin, sub, accountId, product);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const accountId = pickAccountId(sub);
        const product = pickProduct(sub.metadata, defaultProductSlug);
        await syncSubscription(admin, sub, accountId, product);
        break;
      }

      case "invoice.paid": {
        // Status wird über subscription.updated synchronisiert.
        break;
      }

      case "invoice.payment_failed": {
        // Dunning-Signal: Subscription auf past_due setzen, damit die App
        // den Zustand anzeigen kann. Stripe Smart Retries laufen parallel.
        const invoice = event.data.object as Stripe.Invoice;
        const subId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : (invoice.subscription as Stripe.Subscription | null)?.id ?? null;
        if (subId) {
          const { error } = await admin
            .from("product_subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", subId);
          if (error) {
            throw new Error(
              `[@flow/billing] past_due update failed: ${error.message}`
            );
          }
        }
        break;
      }
    }
  } catch (err) {
    console.error(
      `[@flow/billing] handler failed for ${event.type} (${event.id}):`,
      err
    );
    // Idempotenz-Claim freigeben, sonst würde der Stripe-Retry als
    // Duplikat verschluckt, obwohl das Event nie verarbeitet wurde.
    try {
      await admin.from("stripe_events").delete().eq("id", event.id);
    } catch (delErr) {
      console.error("[@flow/billing] idempotency release failed:", delErr);
    }
    // 500 zurück, damit Stripe mit Backoff retried.
    return { status: 500, body: { received: false, handlerError: true } };
  }

  return { status: 200, body: { received: true } };
}

function pickAccountId(
  obj: Stripe.Checkout.Session | Stripe.Subscription
): string | null {
  const raw =
    obj.metadata?.account_id ??
    // Backward-Compat: alter Code setzte user_id statt account_id
    obj.metadata?.user_id ??
    ("client_reference_id" in obj
      ? (obj as Stripe.Checkout.Session).client_reference_id
      : undefined) ??
    null;
  if (typeof raw !== "string") return null;
  return UUID_RE.test(raw) ? raw : null;
}

function pickProduct(
  metadata: Stripe.Metadata | null | undefined,
  fallback: ProductSlug
): ProductSlug {
  const m = metadata?.product;
  if (typeof m === "string" && VALID_PRODUCTS.has(m as ProductSlug)) {
    return m as ProductSlug;
  }
  return fallback;
}

async function syncSubscription(
  admin: ReturnType<typeof createServiceClient>,
  sub: Stripe.Subscription,
  accountId: string | null,
  product: ProductSlug
): Promise<void> {
  if (!accountId) {
    console.warn(
      `[@flow/billing] sync skipped: no valid account_id in subscription ${sub.id}`
    );
    return;
  }

  const priceId = sub.items.data[0]?.price.id ?? "";
  const lookup = getPlanFromPriceId(priceId);
  const isTerminal =
    sub.status === "canceled" || sub.status === "incomplete_expired";
  const plan: Plan = isTerminal ? "free" : (lookup?.plan ?? "free");
  const periodEnd = sub.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;

  // Upsert nach (account_id, product) — eindeutiges Composite-Constraint.
  const { error } = await admin
    .from("product_subscriptions")
    .upsert(
      {
        account_id: accountId,
        product,
        plan,
        status: sub.status,
        stripe_subscription_id: isTerminal ? null : sub.id,
        current_period_end: periodEnd,
      },
      { onConflict: "account_id,product" }
    );

  if (error) {
    throw new Error(
      `[@flow/billing] product_subscriptions upsert failed: ${error.message}`
    );
  }

  // Cross-product: Bundle-Coupon nachpflegen (idempotent, no-op wenn ENV nicht gesetzt).
  await maybeReconcileBundle(accountId, product);

  // BACKWARD-COMPAT: Solange profiles noch existiert, parallel pflegen für
  // protokollflow. Wird in Cleanup-Migration nach R6 entfernt.
  if (product === "protokollflow") {
    try {
      // account_id → legacy_user_id (= alter profile.id) via accounts-Lookup.
      const { data: account } = await admin
        .from("accounts")
        .select("legacy_user_id")
        .eq("id", accountId)
        .single();
      if (account?.legacy_user_id) {
        await admin
          .from("profiles")
          .update({
            subscription_plan: plan,
            subscription_status: sub.status,
            stripe_subscription_id: isTerminal ? null : sub.id,
          })
          .eq("id", account.legacy_user_id);
      }
    } catch (err) {
      console.warn("[@flow/billing] legacy profiles sync failed:", err);
    }
  }
}
