/* AUTO-GENERATED via shared-core/scripts/gen-ratgeber-index.py */
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock, Star } from "lucide-react";
import {
  RATGEBER_ARTICLES,
  type RatgeberCategory,
} from "@/components/marketing/ratgeber-articles";
import { Container, Section, Eyebrow } from "@/components/marketing/section";


export const metadata: Metadata = {
  title: "Ratgeber — GefaehrdungsbeurteilungAI",
  description: "Gefaehrdungsbeurteilung nach Paragraph 5/6 ArbSchG. Audit-sicher. In Stunden statt Wochen. Praxis-Artikel mit konkreten Vorlagen, Rechtsbezügen und Doku-Mustern.",
  alternates: { canonical: "/ratgeber" },
  openGraph: {
    title: "Ratgeber — GefaehrdungsbeurteilungAI",
    description: "Gefaehrdungsbeurteilung nach Paragraph 5/6 ArbSchG. Audit-sicher. In Stunden statt Wochen.",
    type: "website",
    images: [{ url: "/api/og?title=Ratgeber%20GefaehrdungsbeurteilungAI&category=Praxiswissen", width: 1200, height: 630 }],
  },
};

const CATEGORY_ORDER: RatgeberCategory[] = [
  "Grundlagen",
  "Recht",
  "Beschluesse",
  "Finanzen",
  "Versammlung",
  "Verwalter",
  "Spezialthemen",
  "Methoden",
  "Branchen-Muster",
];

const CATEGORY_LABEL: Record<RatgeberCategory, string> = {
  "Grundlagen": "Grundlagen",
    "Recht": "Rechtsgrundlagen",
    "Beschluesse": "Beschlüsse & Vorlagen",
    "Finanzen": "Finanzen",
    "Versammlung": "Sitzung / Gespräch",
    "Verwalter": "Praxis",
    "Spezialthemen": "Spezialthemen",
    "Methoden": "Methoden",
    "Branchen-Muster": "Branchen-Muster",
};

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://gefaehrdungsbeurteilung-ai.de";

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Ratgeber — GefaehrdungsbeurteilungAI",
  url: `${BASE_URL}/ratgeber`,
  hasPart: RATGEBER_ARTICLES.map((a) => ({
    "@type": "Article",
    headline: a.title,
    url: `${BASE_URL}/ratgeber/${a.slug}`,
    description: a.excerpt,
  })),
};

export default function RatgeberIndex() {
  const pillar = RATGEBER_ARTICLES.find((a) => a.isPillar);
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    articles: RATGEBER_ARTICLES.filter((a) => a.category === cat && !a.isPillar),
  })).filter((g) => g.articles.length > 0);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />

      {/* HERO */}
      <Section tone="default" className="pt-14 pb-12 md:pt-20 md:pb-14">
        <Container size="narrow">
          <Eyebrow>Ratgeber</Eyebrow>
          <h1 className="mt-3 font-display text-display-lg md:text-display-xl text-balance text-ink">
            Praxis-Wissen aus dem Maschinenraum.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted text-pretty max-w-2xl">
            Gefaehrdungsbeurteilung nach Paragraph 5/6 ArbSchG. Audit-sicher. In Stunden statt Wochen. {RATGEBER_ARTICLES.length} Artikel mit
            konkreten Vorlagen, Rechtsbezügen und Doku-Mustern — geschrieben
            für Profis, die ihre Doku in Stunden statt Tagen erledigen wollen.
          </p>
        </Container>
      </Section>

      {/* PILLAR HIGHLIGHT */}
      {pillar && (
        <Section tone="warm" className="py-14 md:py-16">
          <Container size="narrow">
            <Link
              href={`/ratgeber/${pillar.slug}`}
              className="group block rounded-2xl border border-parchment-300 bg-white p-7 md:p-9 shadow-card transition hover:border-cognac-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-cognac-700">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>Pillar-Artikel · {CATEGORY_LABEL[pillar.category]}</span>
              </div>
              <h2 className="mt-3 font-display text-2xl md:text-3xl font-semibold leading-tight text-ink group-hover:text-petrol-700">
                {pillar.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">
                {pillar.excerpt}
              </p>
              <div className="mt-5 flex items-center gap-4 text-xs text-ink-subtle">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {pillar.readingTime} Min
                </span>
                <span className="inline-flex items-center gap-1 text-cognac-700">
                  Pillar lesen <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </Container>
        </Section>
      )}

      {/* GROUPED ARTICLES */}
      <Section tone="default" className="pb-20 md:pb-24">
        <Container>
          <div className="space-y-14">
            {grouped.map((group) => (
              <div key={group.category}>
                <div className="mb-5 flex items-baseline justify-between">
                  <h2 className="font-display text-2xl font-semibold text-ink">
                    {CATEGORY_LABEL[group.category]}
                  </h2>
                  <span className="text-xs text-ink-subtle">
                    {group.articles.length} Artikel
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {group.articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/ratgeber/${article.slug}`}
                      className="group flex flex-col rounded-xl border border-parchment-300 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-cognac-300 hover:shadow-card"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cognac-700">
                        <span>{CATEGORY_LABEL[group.category]}</span>
                      </div>
                      <h3 className="mt-2 font-display text-base font-semibold leading-snug text-ink group-hover:text-petrol-700">
                        {article.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
                        {article.excerpt}
                      </p>
                      <div className="mt-auto pt-4 flex items-center justify-between text-xs text-ink-subtle">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {article.readingTime} Min
                        </span>
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:text-cognac-700" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section tone="warm" className="py-14 md:py-18">
        <Container size="narrow" className="text-center">
          <h2 className="font-display text-display-md text-ink">
            Aus Wissen wird Workflow.
          </h2>
          <p className="mt-4 text-base text-ink-muted max-w-xl mx-auto">
            Die Artikel zeigen das Wie. GefaehrdungsbeurteilungAI liefert die
            Pipeline — Audio rein, fertige Doku raus, in Minuten.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-cognac-600 px-7 py-3.5 text-sm font-semibold text-white shadow-card transition hover:bg-cognac-700"
            >
              Kostenlos starten <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/preise"
              className="inline-flex items-center gap-2 rounded-full border border-parchment-300 bg-white px-7 py-3.5 text-sm font-semibold text-ink hover:border-cognac-300"
            >
              Preise ansehen
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
