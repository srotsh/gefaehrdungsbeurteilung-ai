/* AUTO-GENERATED via shared-core/scripts/gen-landing-pages.py
 * Edits in PRODUCT_REGISTRY.marketing[GefaehrdungsbeurteilungAI] -> Generator neu laufen lassen.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { Section, Container, Eyebrow } from "@/components/marketing/section";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { ProductMockup } from "@/components/marketing/product-mockup";


export const metadata: Metadata = {
  title: "GefaehrdungsbeurteilungAI — Gefaehrdungsbeurteilung nach Paragraph 5/6 ArbSchG. Audit-sicher. In Stunden statt Wochen.",
  description: "Jeder Arbeitgeber muss Gefaehrdungsbeurteilungen dokumentieren (Paragraph 5/6 ArbSchG). Sie gehen durch den Betrieb und sprechen, was Sie sehen - wir erzeugen das vollstaendige Dokument mit Risikomatrix, STOP-Massnahmen und Fristen. Inklusive psychischer Belastung, die 80 Prozent der Betriebe vergessen.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "GefaehrdungsbeurteilungAI",
    description: "Jeder Arbeitgeber muss Gefaehrdungsbeurteilungen dokumentieren (Paragraph 5/6 ArbSchG). Sie gehen durch den Betrieb und sprechen, was Sie sehen - wir erzeugen das vollstaendige Dokument mit Risikomatrix, STOP-Massnahmen und Fristen. Inklusive psychischer Belastung, die 80 Prozent der Betriebe vergessen.",
    type: "website",
    images: [{ url: "/api/og?title=GefaehrdungsbeurteilungAI&category=Start", width: 1200, height: 630 }],
  },
};

const STEPS = [
  { title: "Branche waehlen", body: "10 Branchen-Kataloge von Buero bis Produktion laden die typischen Gefaehrdungsfaktoren vor." },
            { title: "Rundgang einsprechen", body: "Per Smartphone durch den Arbeitsbereich gehen und beschreiben - oder die gefuehrte Checkliste ausfuellen." },
            { title: "Pruefen + Tracking", body: "AI strukturiert nach Gefaehrdungsfaktoren, berechnet die Risikomatrix, Sie pruefen und exportieren. Fristen-Reminder inklusive." },
];

const FEATURES = [
  { title: "Paragraph 5/6 ArbSchG komplett", body: "Alle Gefaehrdungsfaktoren: mechanisch, elektrisch, Gefahrstoffe, Brand, Laerm, Klima, physisch - und psychische Belastung (Pflicht seit 2013)." },
            { title: "Risikomatrix nach Nohl", body: "Wahrscheinlichkeit x Schadensschwere pro Gefaehrdung, automatisch berechneter Handlungsbedarf." },
            { title: "STOP-Massnahmen", body: "Substitution, Technisch, Organisatorisch, Persoenlich - in der rechtlich geforderten Reihenfolge, mit Verantwortlichem und Frist." },
            { title: "Massnahmen-Tracking", body: "Dashboard offener Massnahmen mit Fristen-Erinnerung per E-Mail - inklusive Wirksamkeitspruefung." },
            { title: "Wiedervorlage", body: "Jaehrliche Revision, neue Maschine, Unfall, Umzug - das System erinnert, bevor die Beurteilung veraltet." },
            { title: "DSGVO + AVV", body: "EU-Hosting, Audio nach 30 Tagen geloescht, AVV zum Download." },
];

const FAQS = [
  { q: "Ist das rechtlich ausreichend?", a: "Wir liefern die strukturierte Dokumentation nach Paragraph 5/6 ArbSchG mit Risikomatrix und Massnahmenplan. Die inhaltliche Verantwortung traegt der Arbeitgeber bzw. die Fachkraft fuer Arbeitssicherheit." },
            { q: "Welche Branchen?", a: "Buero, Handwerk/Werkstatt, Bau, Gastronomie, Einzelhandel, Logistik/Lager, Pflege, Kfz, Friseur/Kosmetik, Produktion - weitere auf Anfrage." },
            { q: "Fuer SiFa-Berater geeignet?", a: "Ja - Sie verwalten mehrere Arbeitsbereiche und exportieren pro Kunde ein vollstaendiges Dokument mit Ihrem Briefkopf (Pro-Plan)." },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <Section tone="default" className="pt-16 pb-20 md:pt-24 md:pb-28">
        <Container size="narrow" className="text-center">
          <Eyebrow>GefaehrdungsbeurteilungAI</Eyebrow>
          <h1 className="mt-4 font-display text-display-lg md:text-display-xl leading-[1.05] text-balance text-ink">
            Werkstatt-Rundgang einsprechen. Audit-sichere Gefaehrdungsbeurteilung erhalten.
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-ink-muted text-pretty mx-auto max-w-2xl">
            Jeder Arbeitgeber muss Gefaehrdungsbeurteilungen dokumentieren (Paragraph 5/6 ArbSchG). Sie gehen durch den Betrieb und sprechen, was Sie sehen - wir erzeugen das vollstaendige Dokument mit Risikomatrix, STOP-Massnahmen und Fristen. Inklusive psychischer Belastung, die 80 Prozent der Betriebe vergessen.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <TrackedLink
              href="/signup"
              event="Plan CTA"
              eventProps={{ plan: "free", source: "hero" }}
              className="inline-flex items-center gap-2 rounded-full bg-cognac-600 px-7 py-3.5 text-sm font-semibold text-white shadow-card transition hover:bg-cognac-700"
            >
              Kostenlos starten <ArrowRight className="h-4 w-4" />
            </TrackedLink>
            <TrackedLink
              href="/preise"
              event="Pricing CTA"
              eventProps={{ source: "hero" }}
              className="inline-flex items-center gap-2 rounded-full border border-parchment-300 bg-white px-7 py-3.5 text-sm font-semibold text-ink hover:border-cognac-300"
            >
              Preise ansehen
            </TrackedLink>
          </div>
          <p className="mt-5 text-xs text-ink-subtle">
            Kostenlos starten. Keine Kreditkarte. DSGVO-konform.
          </p>
          <div className="mt-12 max-w-5xl mx-auto">
            <ProductMockup />
          </div>
        </Container>
      </Section>

      {/* PROBLEM */}
      <Section tone="warm" className="py-16 md:py-20">
        <Container size="narrow">
          <Eyebrow>Das Problem</Eyebrow>
          <p className="mt-4 text-xl md:text-2xl leading-relaxed text-ink text-pretty">
            Gewerbeaufsicht und Berufsgenossenschaft pruefen die Dokumentation - fehlt sie, drohen Bussgelder und nach einem Arbeitsunfall persoenliche Haftung des Geschaeftsfuehrers. Externe Berater kosten 1.500 bis 5.000 Euro pro Beurteilung, Word-Vorlagen veralten und niemand verfolgt die Massnahmen nach.
          </p>
        </Container>
      </Section>

      {/* HOW IT WORKS */}
      <Section tone="default" className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <Eyebrow>So funktioniert&apos;s</Eyebrow>
            <h2 className="mt-3 font-display text-display-md text-ink">
              In drei Schritten zum fertigen Ergebnis.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-parchment-300 bg-white p-7 shadow-soft"
              >
                <div className="absolute -top-3 left-7 inline-flex h-7 w-7 items-center justify-center rounded-full bg-cognac-600 text-xs font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* FEATURES */}
      <Section tone="surface" className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <Eyebrow>Funktionen</Eyebrow>
            <h2 className="mt-3 font-display text-display-md text-ink">
              Alles, was Sie für rechts­sichere Doku brauchen.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-parchment-300 bg-white p-6"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cognac-100 text-cognac-700">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-ink">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* PRICING CTA */}
      <Section tone="deep" className="py-16 md:py-20 text-center">
        <Container size="narrow">
          <Eyebrow tone="cognac">Preise</Eyebrow>
          <h2 className="mt-3 font-display text-display-md text-parchment-50">
            Klein anfangen, mitwachsen.
          </h2>
          <p className="mt-4 text-lg text-parchment-200 mx-auto max-w-xl">
            Free, Starter ab 49 EUR/Monat, Pro ab 149 EUR/Monat. Jährlich
            zahlen spart 2 Monate.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <TrackedLink
              href="/preise"
              event="Pricing CTA"
              eventProps={{ source: "pricing-band" }}
              className="inline-flex items-center gap-2 rounded-full bg-cognac-500 px-7 py-3.5 text-sm font-semibold text-white shadow-card transition hover:bg-cognac-400"
            >
              Alle Tarife im Detail <ArrowRight className="h-4 w-4" />
            </TrackedLink>
            <TrackedLink
              href="/signup"
              event="Plan CTA"
              eventProps={{ plan: "free", source: "pricing-band" }}
              className="inline-flex items-center gap-2 rounded-full border border-parchment-50/30 bg-transparent px-7 py-3.5 text-sm font-semibold text-parchment-50 hover:bg-parchment-50/10"
            >
              Free starten
            </TrackedLink>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="default" className="py-16 md:py-24">
        <Container size="narrow">
          <div className="text-center mb-10">
            <Eyebrow>Häufige Fragen</Eyebrow>
            <h2 className="mt-3 font-display text-display-md text-ink">
              Antworten in einem Satz.
            </h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-parchment-300 bg-white p-5 open:border-cognac-300"
              >
                <summary className="cursor-pointer font-display text-base font-semibold text-ink list-none flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-cognac-600 transition group-open:rotate-45 text-2xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/ratgeber"
              className="text-sm font-semibold text-cognac-700 underline-offset-4 hover:underline"
            >
              Mehr im Ratgeber lesen →
            </Link>
          </div>
        </Container>
      </Section>

      {/* FINAL CTA */}
      <Section tone="warm" className="py-16 md:py-20">
        <Container size="narrow" className="text-center">
          <h2 className="font-display text-display-md text-ink">
            Bereit für rechts­sichere Doku in Minuten?
          </h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <TrackedLink
              href="/signup"
              event="Plan CTA"
              eventProps={{ plan: "free", source: "footer-cta" }}
              className="inline-flex items-center gap-2 rounded-full bg-cognac-600 px-7 py-3.5 text-sm font-semibold text-white shadow-card transition hover:bg-cognac-700"
            >
              Kostenlos starten <ArrowRight className="h-4 w-4" />
            </TrackedLink>
          </div>
          <p className="mt-4 text-xs text-ink-subtle">
            DSGVO-konform · EU-Server · Audio-Daten gelöscht nach 30 Tagen
          </p>
        </Container>
      </Section>
    </>
  );
}
