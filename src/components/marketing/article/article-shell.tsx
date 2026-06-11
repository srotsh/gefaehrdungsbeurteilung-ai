import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, User } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/marketing/section";
import { LeadMagnetCTA } from "@/components/marketing/lead-magnet-cta";

/**
 * ArticleShell — replacement für das alte `<article className="mx-auto max-w-3xl">`-Pattern.
 *
 * Liefert:
 *  - Konsistenten Pergament-Pagebreak
 *  - Eyebrow + große Title-Headline + Meta-Zeile (Datum, Lesezeit, Autor)
 *  - Optional: Hero-Image
 *  - Article-Container mit Prose-Styles für lange DE-Sätze
 *
 * Artikel selbst übergeben Title/Meta/Image und ihre Inhalte als children.
 */

export interface ArticleHeadProps {
  category: string;
  title: string;
  subtitle?: string;
  date: string; // ISO date
  readingTime: number; // minutes
  author?: string;
  heroSrc?: string;
  heroAlt?: string;
}

export function ArticleHead({
  category,
  title,
  subtitle,
  date,
  readingTime,
  author = "Sebastian Rötsch",
  heroSrc,
  heroAlt,
}: ArticleHeadProps) {
  const formattedDate = new Date(date).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <Section tone="default" className="relative pt-12 pb-8 md:pt-16">
      <div className="absolute inset-0 bg-parchment-grain opacity-30" aria-hidden />
      <Container size="narrow" className="relative">
        <Link
          href="/ratgeber"
          className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cognac-600 hover:text-cognac-700"
        >
          ← Ratgeber
        </Link>
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cognac-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cognac-700">
          {category}
        </p>
        <h1 className="mt-5 font-display text-display-lg leading-[1.1] text-balance text-ink">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 text-[1.125rem] leading-relaxed text-ink-muted text-pretty">
            {subtitle}
          </p>
        )}
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> {formattedDate}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {readingTime} Min. Lesezeit
          </span>
          <span className="inline-flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> {author}
          </span>
        </div>

        {heroSrc && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-parchment-200 shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroSrc}
              alt={heroAlt || title}
              className="aspect-[2/1] w-full"
              width={1200}
              height={600}
              loading="eager"
            />
          </div>
        )}
      </Container>
    </Section>
  );
}

/**
 * Container für den eigentlichen Body. Nutzt die `prose-de`-Class aus
 * globals.css für Hyphenation, plus eigene Tailwind-Typografie für h2/h3/p/ul/ol.
 *
 * Children sind das eigentliche article-Markup.
 */
export function ArticleBody({
  children,
  className = "",
  withLeadMagnet = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Lead-Magnet am Artikelende (CRO B5). Pillar-Artikel mit eigenem
   *  Inline-Magnet können das abschalten. */
  withLeadMagnet?: boolean;
}) {
  return (
    <Section tone="default" className="pb-16 md:pb-20">
      <Container size="narrow">
        <div
          className={`prose-de
            [&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:font-display [&_h2]:text-display-md [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:text-balance
            [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-[1.35rem] [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:leading-snug
            [&_h4]:mt-7 [&_h4]:mb-2 [&_h4]:font-display [&_h4]:text-[1.05rem] [&_h4]:font-semibold [&_h4]:text-ink
            [&_p]:my-5 [&_p]:text-[1.05rem] [&_p]:leading-[1.75] [&_p]:text-ink [&_p]:text-pretty
            [&_ul]:my-5 [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul>li]:relative [&_ul>li]:text-[1.05rem] [&_ul>li]:leading-relaxed [&_ul>li]:text-ink
            [&_ul>li]:before:absolute [&_ul>li]:before:left-[-22px] [&_ul>li]:before:top-[0.7em] [&_ul>li]:before:h-1.5 [&_ul>li]:before:w-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-cognac-500
            [&_ol]:my-5 [&_ol]:space-y-2 [&_ol]:pl-6 [&_ol>li]:text-[1.05rem] [&_ol>li]:leading-relaxed [&_ol>li]:text-ink [&_ol>li]:marker:font-semibold [&_ol>li]:marker:text-cognac-600
            [&_strong]:font-semibold [&_strong]:text-ink
            [&_em]:italic [&_em]:text-ink-muted
            [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:bg-parchment-200/60 [&_code]:text-petrol-700 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
            [&_a]:text-petrol-700 [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-cognac-300 [&_a:hover]:decoration-cognac-500 [&_a:hover]:text-cognac-700
            [&>:first-child]:mt-0
            ${className}`}
        >
          {children}
        </div>
        {withLeadMagnet && <LeadMagnetCTA />}
      </Container>
    </Section>
  );
}
