/* AUTO-GENERATED skeleton — wird vom Generator ueberschrieben bis manuell ausgearbeitet. Marker entfernen um Schutz zu aktivieren. */
import type { Metadata } from "next";
import { ArticleHead, ArticleBody, Callout } from "@/components/marketing/article";

export const metadata: Metadata = {
  title: "Bin ich GBU-pflichtig? Der Schnell-Check für Arbeitgeber",
  description: "Ab dem ersten Beschäftigten gilt die Pflicht — was Gewerbeaufsicht und BG verlangen, welche Bußgelder drohen.",
  alternates: { canonical: "/ratgeber/gbu-pflicht-check" },
  openGraph: { title: "Bin ich GBU-pflichtig? Der Schnell-Check für Arbeitgeber", description: "Ab dem ersten Beschäftigten gilt die Pflicht — was Gewerbeaufsicht und BG verlangen, welche Bußgelder drohen." },
  // Skeleton-Artikel: erst indexieren lassen, wenn der Inhalt ausgearbeitet ist.
  robots: { index: false, follow: true },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Bin ich GBU-pflichtig? Der Schnell-Check für Arbeitgeber",
  datePublished: "2026-05-08",
  dateModified: "2026-05-08",
  author: { "@type": "Organization", name: "GefaehrdungsbeurteilungAI" },
  publisher: {
    "@type": "Organization",
    name: "GefaehrdungsbeurteilungAI",
    logo: { "@type": "ImageObject", url: "https://gefaehrdungsbeurteilung-ai.de/logo.png" },
  },
  mainEntityOfPage: "https://gefaehrdungsbeurteilung-ai.de/ratgeber/gbu-pflicht-check",
};

export default function Page() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <ArticleHead
        category="Recht"
        title="Bin ich GBU-pflichtig? Der Schnell-Check für Arbeitgeber"
        subtitle="Ab dem ersten Beschäftigten gilt die Pflicht — was Gewerbeaufsicht und BG verlangen, welche Bußgelder drohen."
        date="2026-05-08"
        readingTime={6}
      />

      <ArticleBody>
        <h2>Wer ist verpflichtet</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Ausnahmen-Mythen</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Bußgelder und Haftung</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Nach dem Arbeitsunfall</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Selbst-Check</h2>
        <p>{/* TODO: Inhalt */}</p>

        <Callout variant="info">
          {/* Skeleton-Artikel — Inhalt wird sukzessive ausgearbeitet. */}
          "Skeleton-Artikel — Inhalt sukzessive ergaenzen."
        </Callout>
      </ArticleBody>
    </article>
  );
}
