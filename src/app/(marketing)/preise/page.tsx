/* AUTO-GENERATED via shared-core/scripts/gen-pricing-pages.py */
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Section, Container, Eyebrow } from "@/components/marketing/section";
import { PRODUCTS } from "@flow/billing/catalog";
import { track } from "@/components/analytics/plausible";

const PRODUCT_SLUG = "gefaehrdungsbeurteilung" as const;

type Interval = "monthly" | "yearly";

type PlanKey = "free" | "starter" | "pro";

const PLAN_META: { key: PlanKey; label: string; tagline: string; highlight: boolean }[] = [
  { key: "free",    label: "Free",    tagline: "Zum Ausprobieren — mit Wasserzeichen.", highlight: false },
  { key: "starter", label: "Starter", tagline: "Für Einzelnutzer und kleine Teams.",     highlight: false },
  { key: "pro",     label: "Pro",     tagline: "Für Vielnutzer und Agenturen.",          highlight: true  },
];

export default function PreisePage() {
  const [interval, setInterval] = useState<Interval>("monthly");
  const cfg = PRODUCTS[PRODUCT_SLUG];

  useEffect(() => {
    track("Pricing Viewed");
  }, []);

  function setIntervalTracked(next: Interval) {
    if (next !== interval) track("Pricing Toggle", { interval: next });
    setInterval(next);
  }

  return (
    <>
      <Section tone="default" className="pt-16 pb-10 md:pt-20">
        <Container size="narrow" className="text-center">
          <Eyebrow>Preise</Eyebrow>
          <h1 className="mt-3 font-display text-display-lg md:text-display-xl text-balance text-ink">
            Klein anfangen, mitwachsen.
          </h1>
          <p className="mt-5 text-lg text-ink-muted mx-auto max-w-2xl">
            Free zum Testen, ab 49 EUR/Monat im Starter, jederzeit kündbar.
            Jährlich zahlen spart 2 Monate.
          </p>

          <div className="mt-8 inline-flex rounded-full border border-parchment-300 bg-white p-1 text-sm">
            <button
              type="button"
              onClick={() => setIntervalTracked("monthly")}
              className={
                "rounded-full px-5 py-2 font-medium transition " +
                (interval === "monthly"
                  ? "bg-cognac-600 text-white shadow-soft"
                  : "text-ink hover:text-cognac-700")
              }
            >
              Monatlich
            </button>
            <button
              type="button"
              onClick={() => setIntervalTracked("yearly")}
              className={
                "rounded-full px-5 py-2 font-medium transition " +
                (interval === "yearly"
                  ? "bg-cognac-600 text-white shadow-soft"
                  : "text-ink hover:text-cognac-700")
              }
            >
              Jährlich
              <span className="ml-2 inline-flex items-center rounded-full bg-cognac-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cognac-700">
                −17 %
              </span>
            </button>
          </div>
        </Container>
      </Section>

      <Section tone="default" className="pb-16 md:pb-20">
        <Container>
          <div className="grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
            {PLAN_META.map((p) => {
              const c = cfg.plans[p.key];
              const price =
                p.key === "free"
                  ? 0
                  : interval === "monthly"
                    ? c.monthly_eur
                    : Math.round(c.yearly_eur / 12);
              const yearlyTotal = c.yearly_eur;
              return (
                <div
                  key={p.key}
                  className={
                    "relative flex flex-col rounded-2xl bg-white p-7 shadow-soft transition hover:-translate-y-0.5 " +
                    (p.highlight
                      ? "border-2 border-cognac-500 ring-1 ring-cognac-200"
                      : "border border-parchment-300")
                  }
                >
                  {p.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cognac-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      Beliebt
                    </span>
                  )}
                  <h2 className="font-display text-xl font-semibold text-ink">{p.label}</h2>
                  <p className="mt-1 text-sm text-ink-muted">{p.tagline}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="font-display text-5xl font-bold text-ink">{price}</span>
                    <span className="text-base text-ink-muted">EUR</span>
                    {p.key !== "free" && (
                      <span className="ml-1 text-sm text-ink-muted">/ Monat</span>
                    )}
                  </div>
                  {p.key !== "free" && interval === "yearly" && (
                    <p className="mt-1 text-xs text-cognac-700">
                      {yearlyTotal} EUR jährlich
                    </p>
                  )}
                  <ul className="mt-6 flex-1 space-y-2 text-sm">
                    <FeatureRow on={c.protokolle_pro_monat >= 999}>
                      {c.protokolle_pro_monat >= 999
                        ? "Unbegrenzte Vorgänge"
                        : c.protokolle_pro_monat + " Vorgänge / Monat"}
                    </FeatureRow>
                    <FeatureRow on={!c.watermark}>Ohne Wasserzeichen</FeatureRow>
                    <FeatureRow on={c.email_versand}>E-Mail-Versand</FeatureRow>
                    <FeatureRow on={c.custom_briefkopf}>Eigener Briefkopf</FeatureRow>
                    <FeatureRow on={c.priority_processing}>Priority-Processing</FeatureRow>
                    <FeatureRow on={c.api_zugang}>API-Zugang</FeatureRow>
                  </ul>
                  <Link
                    href="/signup"
                    onClick={() => track("Plan CTA", { plan: p.key, interval })}
                    className={
                      "mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition " +
                      (p.highlight
                        ? "bg-cognac-600 text-white hover:bg-cognac-700"
                        : "border border-parchment-300 bg-white text-ink hover:border-cognac-300")
                    }
                  >
                    {p.key === "free" ? "Kostenlos starten" : p.label + " buchen"}
                  </Link>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-ink-subtle">
            Alle Preise zzgl. gesetzlicher MwSt. SEPA oder Kreditkarte. Monatlich kündbar.
          </p>
        </Container>
      </Section>

      <Section tone="warm" className="py-16 md:py-20">
        <Container size="narrow">
          <div className="text-center mb-10">
            <Eyebrow>Häufige Fragen zur Abrechnung</Eyebrow>
            <h2 className="mt-3 font-display text-display-md text-ink">
              Faires Pricing — keine Kleinschrift.
            </h2>
          </div>
          <div className="space-y-4">
            <FaqItem q="Kann ich jederzeit kündigen?">
              Ja. Die Monats-Pläne kündigen Sie zum Ende der laufenden Periode,
              die Jahres-Pläne zum Vertragsende. Restguthaben verfällt nicht
              prorata, weil Sie für eine genutzte Periode bezahlen.
            </FaqItem>
            <FaqItem q="Wie funktioniert der Wechsel zwischen Plänen?">
              Up-Grade jederzeit, anteiliger Aufpreis wird automatisch berechnet
              (Stripe-Proration). Down-Grade zum Periodenende, kein Geld zurück
              für die laufende Periode.
            </FaqItem>
            <FaqItem q="Bekomme ich eine Rechnung mit MwSt-Ausweis?">
              Ja. Nach jeder Zahlung wird automatisch eine MwSt-konforme
              Rechnung als PDF im Customer-Portal hinterlegt und an die
              Rechnungs-Adresse versendet.
            </FaqItem>
            <FaqItem q="Was passiert mit meinen Daten beim Down-Grade auf Free?">
              Bestehende Vorgänge bleiben einsehbar, neue Vorgänge zählen gegen
              das Free-Limit von 2/Monat. Audio-Dateien werden nach unserem
              30-Tage-DSGVO-Lifecycle ohnehin gelöscht.
            </FaqItem>
            <FaqItem q="Bietet ihr Team-/Mehrplatz-Lizenzen?">
              Pro-Plan ist Single-Account. Für Agenturen / mehrere Standorte
              kontaktieren Sie uns für ein Enterprise-Paket — typischerweise
              5+ Sitze, individuelle SLA, Onboarding-Support.
            </FaqItem>
          </div>
        </Container>
      </Section>
    </>
  );
}

function FeatureRow({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      {on ? (
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-cognac-600" />
      ) : (
        <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" />
      )}
      <span className={on ? "text-ink" : "text-ink-subtle line-through"}>
        {children}
      </span>
    </li>
  );
}

function FaqItem({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-xl border border-parchment-300 bg-white p-5 open:border-cognac-300">
      <summary className="cursor-pointer font-display text-base font-semibold text-ink list-none flex items-center justify-between gap-4">
        {q}
        <span className="text-cognac-600 transition group-open:rotate-45 text-2xl leading-none">
          +
        </span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{children}</p>
    </details>
  );
}
