/* AUTO-GENERATED skeleton — wird vom Generator ueberschrieben bis manuell ausgearbeitet. Marker entfernen um Schutz zu aktivieren. */
import type { Metadata } from "next";
import { ArticleHead, ArticleBody, Callout } from "@/components/marketing/article";
import { LeadMagnetCTA } from "@/components/marketing/lead-magnet-cta";

export const metadata: Metadata = {
  title: "Gefährdungsbeurteilung erstellen: Schritt-für-Schritt nach §5/§6 ArbSchG (2026)",
  description: "Wer muss, was gehört hinein, wie dokumentieren Sie audit-sicher — mit Risikomatrix, STOP-Maßnahmen und Wiedervorlage.",
  alternates: { canonical: "/ratgeber/gefaehrdungsbeurteilung-erstellen" },
  openGraph: { title: "Gefährdungsbeurteilung erstellen: Schritt-für-Schritt nach §5/§6 ArbSchG (2026)", description: "Wer muss, was gehört hinein, wie dokumentieren Sie audit-sicher — mit Risikomatrix, STOP-Maßnahmen und Wiedervorlage." },
  // Skeleton-Artikel: erst indexieren lassen, wenn der Inhalt ausgearbeitet ist.
  robots: { index: false, follow: true },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Gefährdungsbeurteilung erstellen: Schritt-für-Schritt nach §5/§6 ArbSchG (2026)",
  datePublished: "2026-05-08",
  dateModified: "2026-05-08",
  author: { "@type": "Organization", name: "GefaehrdungsbeurteilungAI" },
  publisher: {
    "@type": "Organization",
    name: "GefaehrdungsbeurteilungAI",
    logo: { "@type": "ImageObject", url: "https://gefaehrdungsbeurteilung-ai.de/logo.png" },
  },
  mainEntityOfPage: "https://gefaehrdungsbeurteilung-ai.de/ratgeber/gefaehrdungsbeurteilung-erstellen",
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
        title="Gefährdungsbeurteilung erstellen: Schritt-für-Schritt nach §5/§6 ArbSchG (2026)"
        subtitle="Wer muss, was gehört hinein, wie dokumentieren Sie audit-sicher — mit Risikomatrix, STOP-Maßnahmen und Wiedervorlage."
        date="2026-05-08"
        readingTime={12}
      />

      <ArticleBody>
        <h2>Rechtsgrundlage §5/§6 ArbSchG</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Die 7 Schritte</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Gefährdungsfaktoren</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Risikomatrix (Nohl)</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>STOP-Maßnahmenhierarchie</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Dokumentationspflicht §6</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Wirksamkeitsprüfung</h2>
        <p>{/* TODO: Inhalt */}</p>

        <h2>Wiedervorlage und Anlässe</h2>
        <p>{/* TODO: Inhalt */}</p>

        <Callout variant="info">
          {/* Skeleton-Artikel — Inhalt wird sukzessive ausgearbeitet. */}
          "⭐ Pillar-Artikel — bitte mit voller Tiefe ausarbeiten (12 Min Zielzeit)."
        </Callout>
      
        <LeadMagnetCTA
          asset="gbu-pflicht-check"
          headline="Gratis-Download: GBU-Pflicht-Check"
          bullets={["Selbst-Check: Bin ich GBU-pflichtig?", "Die 7 Schritte zur audit-sicheren Beurteilung", "Checkliste psychische Belastung (Pflicht seit 2013)"]}
        />
      </ArticleBody>
    </article>
  );
}
