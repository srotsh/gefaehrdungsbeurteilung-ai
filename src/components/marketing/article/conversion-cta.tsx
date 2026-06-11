import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RELATED_MAP } from "./related-map";
import { VARIANT_CONFIG } from "./cta-config";

/**
 * Konversions-CTA am Artikelende. Die Varianten-Inhalte sind PRODUKT-
 * SPEZIFISCH und werden von gen-ratgeber.py in ./cta-config.ts generiert
 * (Quelle: PRODUCT_REGISTRY) — hier liegt nur das Layout.
 *
 * Variante pro Artikel wird in `related-map.ts` gepflegt; Artikel können
 * Headline/Body/CTA per Props überschreiben (Legacy-API).
 */

export function ConversionCTA({
  slug,
  headline,
  body,
  ctaLabel,
  ctaHref,
}: {
  /** Modern: Variante kommt aus related-map.ts. */
  slug?: string;
  /** Legacy: Karte direkt parametrisieren. */
  headline?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const config = slug ? RELATED_MAP[slug] : undefined;
  const base = VARIANT_CONFIG[config?.cta ?? "protokoll"];
  if (!config && !headline) return null;
  const v = {
    ...base,
    headline: headline ?? base.headline,
    body: body ?? base.body,
    primary: ctaLabel || ctaHref
      ? { label: ctaLabel ?? base.primary.label, href: ctaHref ?? base.primary.href }
      : base.primary,
  };
  const Icon = v.Icon;

  return (
    <aside className="not-prose my-12 overflow-hidden rounded-2xl border border-petrol-700 bg-petrol-800 text-parchment-50 shadow-elevated">
      <div className="grid gap-0 lg:grid-cols-[1.6fr_1fr]">
        <div className="px-6 py-7 sm:px-8 sm:py-9">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cognac-500/20 text-cognac-300">
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cognac-300">
              {v.eyebrow}
            </span>
          </div>
          <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-parchment-50 sm:text-[1.65rem]">
            {v.headline}
          </h3>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-parchment-200">
            {v.body}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={v.primary.href}
              className="inline-flex items-center gap-1.5 rounded-md bg-cognac-500 px-4 py-2.5 text-sm font-semibold text-petrol-900 transition hover:bg-cognac-400"
            >
              {v.primary.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={v.secondary.href}
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-parchment-100 underline-offset-4 transition hover:text-cognac-300 hover:underline"
            >
              {v.secondary.label}
            </Link>
          </div>
        </div>
        <div className="border-t border-petrol-700 bg-petrol-900/40 px-6 py-7 sm:px-8 sm:py-9 lg:border-l lg:border-t-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cognac-300">
            Im Überblick
          </p>
          <ul className="mt-3 space-y-2.5 text-[0.92rem] leading-snug text-parchment-100">
            {v.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span aria-hidden className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-cognac-400" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
