/* AUTO-GENERATED skeleton — wird vom Generator ueberschrieben bis manuell ausgearbeitet. Marker entfernen um Schutz zu aktivieren. */
import type { Metadata } from "next";
import { ArticleHead, ArticleBody, Callout } from "@/components/marketing/article";

export const metadata: Metadata = {
  title: "Gefährdungsbeurteilung Lager/Logistik: Muster mit Stapler-Verkehr",
  description: "Flurförderzeuge, manuelle Lastenhandhabung, Verkehrswege — die Logistik-Vorlage.",
  alternates: { canonical: "/ratgeber/gefaehrdungsbeurteilung-lager-muster" },
  openGraph: { title: "Gefährdungsbeurteilung Lager/Logistik: Muster mit Stapler-Verkehr", description: "Flurförderzeuge, manuelle Lastenhandhabung, Verkehrswege — die Logistik-Vorlage." },
  // Skeleton-Artikel: erst indexieren lassen, wenn der Inhalt ausgearbeitet ist.
  robots: { index: false, follow: true },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Gefährdungsbeurteilung Lager/Logistik: Muster mit Stapler-Verkehr",
  datePublished: "2026-05-08",
  dateModified: "2026-05-08",
  author: { "@type": "Organization", name: "GefaehrdungsbeurteilungAI" },
  publisher: {
    "@type": "Organization",
    name: "GefaehrdungsbeurteilungAI",
    logo: { "@type": "ImageObject", url: "https://gefaehrdungsbeurteilung-ai.de/logo.png" },
  },
  mainEntityOfPage: "https://gefaehrdungsbeurteilung-ai.de/ratgeber/gefaehrdungsbeurteilung-lager-muster",
};

export default function Page() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <ArticleHead
        category="Branchen-Muster"
        title="Gefährdungsbeurteilung Lager/Logistik: Muster mit Stapler-Verkehr"
        subtitle="Flurförderzeuge, manuelle Lastenhandhabung, Verkehrswege — die Logistik-Vorlage."
        date="2026-05-08"
        readingTime={8}
      />

      <ArticleBody>
        <h2>Stapler und Verkehrswege</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Lastenhandhabung</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Schichtarbeit</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Muster-Struktur</h2>
        <p>{/* TODO: Inhalt */}</p>

        <Callout variant="info">
          {/* Skeleton-Artikel — Inhalt wird sukzessive ausgearbeitet. */}
          "Skeleton-Artikel — Inhalt sukzessive ergaenzen."
        </Callout>
      </ArticleBody>
    </article>
  );
}
