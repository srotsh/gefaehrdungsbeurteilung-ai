import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RATGEBER_ARTICLES } from "@/components/marketing/ratgeber-articles";
import { RELATED_MAP } from "./related-map";

/**
 * "Weiterlesen"-Block am Artikelende. Rendert 4–5 thematisch
 * verwandte Artikel als kompakte Karten (Title, Kategorie, Lesezeit).
 *
 * Cross-Linking-Strategie:
 *  - Single-Source-of-Truth: RELATED_MAP (related-map.ts)
 *  - Karten zeigen Title + Excerpt — Excerpt kommt aus
 *    `RATGEBER_ARTICLES`, daher kein doppelter Pflegeaufwand.
 *  - Click-through-Optimiert: Hover-Lift + Pfeil-Icon
 */
export function RelatedArticles({ slug }: { slug: string }) {
  const config = RELATED_MAP[slug];
  if (!config) return null;

  const related = config.related
    .map((s) => RATGEBER_ARTICLES.find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  if (related.length === 0) return null;

  return (
    <section className="not-prose my-12">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-xl font-semibold text-ink">
          Weiterlesen
        </h2>
        <Link
          href="/ratgeber"
          className="text-xs font-medium text-cognac-700 underline-offset-4 hover:underline"
        >
          Alle Ratgeber-Artikel →
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {related.map((a) => (
          <Link
            key={a.slug}
            href={`/ratgeber/${a.slug}`}
            className="group relative flex flex-col rounded-xl border border-parchment-300 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-cognac-300 hover:shadow-card"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cognac-700">
                {a.category}
              </span>
              <span className="text-[10px] text-ink-subtle">
                · {a.readingTime} Min Lesezeit
              </span>
            </div>
            <h3 className="mt-2 text-[0.98rem] font-semibold leading-snug text-ink group-hover:text-petrol-700">
              {a.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">
              {a.excerpt}
            </p>
            <ArrowUpRight
              className="absolute right-4 top-4 h-4 w-4 text-ink-subtle transition group-hover:text-cognac-700"
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
