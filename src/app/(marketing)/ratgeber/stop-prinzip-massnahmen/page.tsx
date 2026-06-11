/* AUTO-GENERATED skeleton — wird vom Generator ueberschrieben bis manuell ausgearbeitet. Marker entfernen um Schutz zu aktivieren. */
import type { Metadata } from "next";
import { ArticleHead, ArticleBody, Callout } from "@/components/marketing/article";

export const metadata: Metadata = {
  title: "Das STOP-Prinzip: Maßnahmen in der rechtlich richtigen Reihenfolge",
  description: "Substitution vor Technik vor Organisation vor PSA — warum die Reihenfolge zählt und wie Sie sie dokumentieren.",
  alternates: { canonical: "/ratgeber/stop-prinzip-massnahmen" },
  openGraph: { title: "Das STOP-Prinzip: Maßnahmen in der rechtlich richtigen Reihenfolge", description: "Substitution vor Technik vor Organisation vor PSA — warum die Reihenfolge zählt und wie Sie sie dokumentieren." },
  // Skeleton-Artikel: erst indexieren lassen, wenn der Inhalt ausgearbeitet ist.
  robots: { index: false, follow: true },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Das STOP-Prinzip: Maßnahmen in der rechtlich richtigen Reihenfolge",
  datePublished: "2026-05-08",
  dateModified: "2026-05-08",
  author: { "@type": "Organization", name: "GefaehrdungsbeurteilungAI" },
  publisher: {
    "@type": "Organization",
    name: "GefaehrdungsbeurteilungAI",
    logo: { "@type": "ImageObject", url: "https://gefaehrdungsbeurteilung-ai.de/logo.png" },
  },
  mainEntityOfPage: "https://gefaehrdungsbeurteilung-ai.de/ratgeber/stop-prinzip-massnahmen",
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
        title="Das STOP-Prinzip: Maßnahmen in der rechtlich richtigen Reihenfolge"
        subtitle="Substitution vor Technik vor Organisation vor PSA — warum die Reihenfolge zählt und wie Sie sie dokumentieren."
        date="2026-05-08"
        readingTime={7}
      />

      <ArticleBody>
        <h2>Die Hierarchie</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Beispiele je Stufe</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Typische Fehler</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Wirksamkeitsprüfung</h2>
        <p>{/* TODO: Inhalt */}</p>

        <Callout variant="info">
          {/* Skeleton-Artikel — Inhalt wird sukzessive ausgearbeitet. */}
          "Skeleton-Artikel — Inhalt sukzessive ergaenzen."
        </Callout>
      </ArticleBody>
    </article>
  );
}
