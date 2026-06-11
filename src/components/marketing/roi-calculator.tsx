/* AUTO-GENERATED via shared-core/scripts/gen-landing-pages.py */
"use client";
import { useState } from "react";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { ArrowRight } from "lucide-react";

const YEARLY_FACTOR = 1;
const PRO_EUR_YEAR = 1788;

function fmt(n: number): string {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(n);
}

export function RoiCalculator() {
  const [count, setCount] = useState(5);
  const [hours, setHours] = useState(12);
  const [rate, setRate] = useState(90);

  const savedPerYear = Math.max(0, count * hours * rate * YEARLY_FACTOR);
  const net = savedPerYear - PRO_EUR_YEAR;

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-parchment-300 bg-white p-7 shadow-soft">
      <div className="grid gap-5 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="font-medium text-ink">Beurteilungen pro Jahr</span>
          <input
            type="number"
            min={0}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="mt-2 w-full rounded-lg border border-parchment-300 bg-parchment-50/50 px-3 py-2.5 text-sm focus:border-cognac-500 focus:outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Eingesparte Stunden je Vorgang</span>
          <input
            type="number"
            min={0}
            step={0.1}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="mt-2 w-full rounded-lg border border-parchment-300 bg-parchment-50/50 px-3 py-2.5 text-sm focus:border-cognac-500 focus:outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Ihr Stundensatz (EUR)</span>
          <input
            type="number"
            min={0}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="mt-2 w-full rounded-lg border border-parchment-300 bg-parchment-50/50 px-3 py-2.5 text-sm focus:border-cognac-500 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-7 rounded-xl bg-petrol-50/60 border border-petrol-200 p-5 text-center">
        <p className="text-sm text-ink-muted">Ihre Zeitersparnis ist wert:</p>
        <p className="mt-1 font-display text-4xl font-bold text-petrol-700">
          {fmt(savedPerYear)} EUR / Jahr
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Pro-Plan: {fmt(PRO_EUR_YEAR)} EUR/Jahr —{" "}
          {net > 0 ? (
            <span className="font-semibold text-petrol-700">bleiben {fmt(net)} EUR Netto-Ersparnis.</span>
          ) : (
            <span>rechnen Sie mit Ihren eigenen Zahlen.</span>
          )}
        </p>
        <TrackedLink
          href="/signup"
          event="Plan CTA"
          eventProps={{ plan: "free", source: "roi" }}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-cognac-600 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-cognac-700"
        >
          Kostenlos ausprobieren <ArrowRight className="h-4 w-4" />
        </TrackedLink>
      </div>
    </div>
  );
}
