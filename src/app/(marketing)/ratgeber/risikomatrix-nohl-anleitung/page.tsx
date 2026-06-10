/* AUTO-GENERATED skeleton — wird vom Generator ueberschrieben bis manuell ausgearbeitet. Marker entfernen um Schutz zu aktivieren. */
import type { Metadata } from "next";
import { ArticleHead, ArticleBody, Callout } from "@/components/marketing/article";

export const metadata: Metadata = {
  title: "Risikomatrix nach Nohl: Wahrscheinlichkeit × Schadensschwere richtig bewerten",
  description: "So stufen Sie Gefährdungen nachvollziehbar ein — mit Beispielen pro Risikostufe und Handlungsbedarf.",
  alternates: { canonical: "/ratgeber/risikomatrix-nohl-anleitung" },
  openGraph: { title: "Risikomatrix nach Nohl: Wahrscheinlichkeit × Schadensschwere richtig bewerten", description: "So stufen Sie Gefährdungen nachvollziehbar ein — mit Beispielen pro Risikostufe und Handlungsbedarf." },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Risikomatrix nach Nohl: Wahrscheinlichkeit × Schadensschwere richtig bewerten",
  datePublished: "2026-05-08",
  dateModified: "2026-05-08",
  author: { "@type": "Organization", name: "GefaehrdungsbeurteilungAI" },
  publisher: {
    "@type": "Organization",
    name: "GefaehrdungsbeurteilungAI",
    logo: { "@type": "ImageObject", url: "https://gefaehrdungsbeurteilung-ai.de/logo.png" },
  },
  mainEntityOfPage: "https://gefaehrdungsbeurteilung-ai.de/ratgeber/risikomatrix-nohl-anleitung",
};

export default function Page() {
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <ArticleHead
        category="Methoden"
        title="Risikomatrix nach Nohl: Wahrscheinlichkeit × Schadensschwere richtig bewerten"
        subtitle="So stufen Sie Gefährdungen nachvollziehbar ein — mit Beispielen pro Risikostufe und Handlungsbedarf."
        date="2026-05-08"
        readingTime={8}
      />

      <ArticleBody>
        <h2>Die Nohl-Methode</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Skalen W und S</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Risikostufen</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Handlungsbedarf ableiten</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Grenzen der Methode</h2>
        <p>{/* TODO: Inhalt */}</p>

        <Callout variant="info">
          {/* Skeleton-Artikel — Inhalt wird sukzessive ausgearbeitet. */}
          "Skeleton-Artikel — Inhalt sukzessive ergaenzen."
        </Callout>
      </ArticleBody>
    </article>
  );
}
