"use client";

import { useState, useTransition } from "react";
import type { ProductConfig, ProductSlug, Plan, BillingInterval } from "@flow/billing";
import { cn } from "@/lib/utils";

interface CurrentSub {
  plan: string | null;
  status: string;
  current_period_end: string | null;
  stripe_customer_id: string | null;
}

export function BillingPage({
  product,
  productConfig,
  currentSubscription,
}: {
  product: ProductSlug;
  productConfig: ProductConfig;
  currentSubscription: CurrentSub | null;
}) {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isActive = currentSubscription?.status === "active";
  const currentPlan = (currentSubscription?.plan as Plan | null) ?? "free";

  function startCheckout(plan: Exclude<Plan, "free">) {
    setError(null);
    start(async () => {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setError(json.error ?? "Checkout fehlgeschlagen.");
        return;
      }
      window.location.href = json.url;
    });
  }

  function openPortal() {
    setError(null);
    start(async () => {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setError(json.error ?? "Portal nicht verfügbar.");
        return;
      }
      window.location.href = json.url;
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-md border bg-card p-4">
        <h2 className="font-semibold mb-2">Aktueller Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg">
              <strong className="capitalize">{currentPlan}</strong>
              {isActive && currentSubscription?.current_period_end && (
                <span className="text-xs text-muted-foreground ml-2">
                  · läuft bis {new Date(currentSubscription.current_period_end).toLocaleDateString("de-DE")}
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              Status: {currentSubscription?.status ?? "free"}
            </p>
          </div>
          {isActive && currentSubscription?.stripe_customer_id && (
            <button
              type="button"
              onClick={openPortal}
              disabled={pending}
              className="rounded-md border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
            >
              {pending ? "…" : "Zahlungsmethode / Rechnungen"}
            </button>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Plan ändern</h2>
          <div className="inline-flex rounded-md border bg-card text-sm">
            <button
              type="button"
              onClick={() => setInterval("monthly")}
              className={cn("px-3 py-1.5", interval === "monthly" && "bg-primary text-primary-foreground rounded-md")}
            >
              Monatlich
            </button>
            <button
              type="button"
              onClick={() => setInterval("yearly")}
              className={cn("px-3 py-1.5", interval === "yearly" && "bg-primary text-primary-foreground rounded-md")}
            >
              Jährlich (~17% sparen)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(["free", "starter", "pro"] as Plan[]).map((plan) => {
            const cfg = productConfig.plans[plan];
            const price = interval === "monthly" ? cfg.monthly_eur : cfg.yearly_eur;
            const isCurrent = plan === currentPlan;
            return (
              <div
                key={plan}
                className={cn(
                  "rounded-md border bg-card p-4 flex flex-col",
                  plan === "pro" && "border-primary ring-1 ring-primary"
                )}
              >
                <h3 className="font-semibold capitalize">{plan}</h3>
                <p className="text-2xl font-bold mt-2">
                  {plan === "free" ? "0 €" : `${price} €`}
                  <span className="text-xs text-muted-foreground font-normal">
                    {plan === "free" ? "" : interval === "monthly" ? " / Monat" : " / Jahr"}
                  </span>
                </p>
                <ul className="mt-3 space-y-1 text-xs flex-1">
                  <li>{cfg.protokolle_pro_monat} Vorgänge {plan === "free" ? "/ Monat" : "/ Periode"}</li>
                  <li>{cfg.watermark ? "✗ Mit Wasserzeichen" : "✓ Ohne Wasserzeichen"}</li>
                  <li>{cfg.email_versand ? "✓ E-Mail-Versand" : "—"}</li>
                  <li>{cfg.custom_briefkopf ? "✓ Eigener Briefkopf" : "—"}</li>
                  <li>{cfg.api_zugang ? "✓ API-Zugang" : "—"}</li>
                  <li>{cfg.priority_processing ? "✓ Priority-Processing" : "—"}</li>
                </ul>
                <button
                  type="button"
                  disabled={pending || isCurrent || plan === "free"}
                  onClick={() => plan !== "free" && startCheckout(plan as Exclude<Plan, "free">)}
                  className={cn(
                    "mt-4 rounded-md px-4 py-2 text-sm font-medium",
                    isCurrent
                      ? "bg-muted text-muted-foreground cursor-default"
                      : plan === "free"
                      ? "bg-muted text-muted-foreground cursor-default"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  )}
                >
                  {isCurrent ? "Aktiv" : plan === "free" ? "Standard" : pending ? "…" : "Wechseln"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-muted-foreground">
        Zahlung via Stripe (Karte oder SEPA-Lastschrift). Sie können jederzeit über die
        Selbstverwaltung kündigen oder den Plan ändern.
      </p>
    </div>
  );
}
