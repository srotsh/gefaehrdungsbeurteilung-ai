/* AUTO-GENERATED skeleton — wird vom Generator ueberschrieben bis manuell ausgearbeitet. Marker entfernen um Schutz zu aktivieren. */
import type { Metadata } from "next";
import { ArticleHead, ArticleBody, Callout } from "@/components/marketing/article";

export const metadata: Metadata = {
  title: "Gefährdungsbeurteilung Werkstatt/Handwerk: Muster mit Maschinenliste",
  description: "Kreissäge, Absaugung, Gefahrstoffe, Lärm — branchentypische Gefährdungen mit STOP-Maßnahmen.",
  alternates: { canonical: "/ratgeber/gefaehrdungsbeurteilung-werkstatt-muster" },
  openGraph: { title: "Gefährdungsbeurteilung Werkstatt/Handwerk: Muster mit Maschinenliste", description: "Kreissäge, Absaugung, Gefahrstoffe, Lärm — branchentypische Gefährdungen mit STOP-Maßnahmen." },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Gefährdungsbeurteilung Werkstatt/Handwerk: Muster mit Maschinenliste",
  datePublished: "2026-05-08",
  dateModified: "2026-05-08",
  author: { "@type": "Organization", name: "GefaehrdungsbeurteilungAI" },
  publisher: {
    "@type": "Organization",
    name: "GefaehrdungsbeurteilungAI",
    logo: { "@type": "ImageObject", url: "https://gefaehrdungsbeurteilung-ai.de/logo.png" },
  },
  mainEntityOfPage: "https://gefaehrdungsbeurteilung-ai.de/ratgeber/gefaehrdungsbeurteilung-werkstatt-muster",
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
        title="Gefährdungsbeurteilung Werkstatt/Handwerk: Muster mit Maschinenliste"
        subtitle="Kreissäge, Absaugung, Gefahrstoffe, Lärm — branchentypische Gefährdungen mit STOP-Maßnahmen."
        date="2026-05-08"
        readingTime={9}
      />

      <ArticleBody>
        <h2>Maschinen-Gefährdungen</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Holzstaub und Gefahrstoffe</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Lärm/Vibration</h2>
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
