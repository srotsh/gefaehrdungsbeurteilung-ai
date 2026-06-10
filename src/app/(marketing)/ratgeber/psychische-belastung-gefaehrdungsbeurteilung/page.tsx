/* AUTO-GENERATED skeleton — wird vom Generator ueberschrieben bis manuell ausgearbeitet. Marker entfernen um Schutz zu aktivieren. */
import type { Metadata } from "next";
import { ArticleHead, ArticleBody, Callout } from "@/components/marketing/article";

export const metadata: Metadata = {
  title: "Psychische Belastung in der Gefährdungsbeurteilung: Pflicht seit 2013",
  description: "80 % der Betriebe vergessen sie — was die GB psych enthalten muss, welche Methoden anerkannt sind und was die Gewerbeaufsicht prüft.",
  alternates: { canonical: "/ratgeber/psychische-belastung-gefaehrdungsbeurteilung" },
  openGraph: { title: "Psychische Belastung in der Gefährdungsbeurteilung: Pflicht seit 2013", description: "80 % der Betriebe vergessen sie — was die GB psych enthalten muss, welche Methoden anerkannt sind und was die Gewerbeaufsicht prüft." },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Psychische Belastung in der Gefährdungsbeurteilung: Pflicht seit 2013",
  datePublished: "2026-05-08",
  dateModified: "2026-05-08",
  author: { "@type": "Organization", name: "GefaehrdungsbeurteilungAI" },
  publisher: {
    "@type": "Organization",
    name: "GefaehrdungsbeurteilungAI",
    logo: { "@type": "ImageObject", url: "https://gefaehrdungsbeurteilung-ai.de/logo.png" },
  },
  mainEntityOfPage: "https://gefaehrdungsbeurteilung-ai.de/ratgeber/psychische-belastung-gefaehrdungsbeurteilung",
};

export default function Page() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <ArticleHead
        category="Grundlagen"
        title="Psychische Belastung in der Gefährdungsbeurteilung: Pflicht seit 2013"
        subtitle="80 % der Betriebe vergessen sie — was die GB psych enthalten muss, welche Methoden anerkannt sind und was die Gewerbeaufsicht prüft."
        date="2026-05-08"
        readingTime={10}
      />

      <ArticleBody>
        <h2>§5 Abs. 3 Nr. 6 ArbSchG</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>GDA-Leitlinien</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Erhebungsmethoden</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Typische Belastungsfaktoren</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Maßnahmen</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Dokumentation</h2>
        <p>{/* TODO: Inhalt */}</p>

        <Callout variant="info">
          {/* Skeleton-Artikel — Inhalt wird sukzessive ausgearbeitet. */}
          "Skeleton-Artikel — Inhalt sukzessive ergaenzen."
        </Callout>
      </ArticleBody>
    </article>
  );
}
