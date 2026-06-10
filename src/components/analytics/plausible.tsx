/* AUTO-GENERATED via shared-core/scripts/gen-analytics.py
 *
 * Plausible Analytics — cookieless, DSGVO-konform, EU-Hosting möglich.
 * Wird nur geladen wenn NEXT_PUBLIC_PLAUSIBLE_DOMAIN gesetzt ist.
 *
 * Custom Events: window.plausible("Event Name", { props: {...} })
 * Helper: import { track } from "@/components/analytics/plausible";
 */
import Script from "next/script";

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

const DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const HOST = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST ?? "https://plausible.io";

export function PlausibleAnalytics() {
  if (!DOMAIN) return null;
  return (
    <Script
      strategy="afterInteractive"
      data-domain={DOMAIN}
      src={`${HOST}/js/script.tagged-events.outbound-links.js`}
    />
  );
}

/**
 * Fire a Plausible custom event. Safe to call on server (no-op) and
 * before the script loads (no-op).
 *
 * Standard funnel events:
 *  - "Signup Started"     fired when form first focused
 *  - "Signup Completed"   fired after successful signup
 *  - "Pricing Toggle"     props: { interval: "monthly" | "yearly" }
 *  - "Plan CTA"           props: { plan: "free" | "starter" | "pro" }
 *  - "Article Read"       props: { slug }  (auto via tagged-events)
 */
export function track(
  event: string,
  props?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;
  if (typeof window.plausible !== "function") return;
  window.plausible(event, props ? { props } : undefined);
}
