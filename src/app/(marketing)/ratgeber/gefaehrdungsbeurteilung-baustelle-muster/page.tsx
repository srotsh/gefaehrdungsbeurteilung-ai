/* AUTO-GENERATED skeleton — wird vom Generator ueberschrieben bis manuell ausgearbeitet. Marker entfernen um Schutz zu aktivieren. */
import type { Metadata } from "next";
import { ArticleHead, ArticleBody, Callout } from "@/components/marketing/article";

export const metadata: Metadata = {
  title: "Gefährdungsbeurteilung Baustelle: Muster nach BaustellV",
  description: "Absturz, Heben/Tragen, Witterung — was auf jeder Baustelle bewertet werden muss.",
  alternates: { canonical: "/ratgeber/gefaehrdungsbeurteilung-baustelle-muster" },
  openGraph: { title: "Gefährdungsbeurteilung Baustelle: Muster nach BaustellV", description: "Absturz, Heben/Tragen, Witterung — was auf jeder Baustelle bewertet werden muss." },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Gefährdungsbeurteilung Baustelle: Muster nach BaustellV",
  datePublished: "2026-05-08",
  dateModified: "2026-05-08",
  author: { "@type": "Organization", name: "GefaehrdungsbeurteilungAI" },
  publisher: {
    "@type": "Organization",
    name: "GefaehrdungsbeurteilungAI",
    logo: { "@type": "ImageObject", url: "https://gefaehrdungsbeurteilung-ai.de/logo.png" },
  },
  mainEntityOfPage: "https://gefaehrdungsbeurteilung-ai.de/ratgeber/gefaehrdungsbeurteilung-baustelle-muster",
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
        title="Gefährdungsbeurteilung Baustelle: Muster nach BaustellV"
        subtitle="Absturz, Heben/Tragen, Witterung — was auf jeder Baustelle bewertet werden muss."
        date="2026-05-08"
        readingTime={9}
      />

      <ArticleBody>
        <h2>BaustellV und SiGeKo</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Absturzgefährdungen</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Gefahrstoffe am Bau</h2>
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
