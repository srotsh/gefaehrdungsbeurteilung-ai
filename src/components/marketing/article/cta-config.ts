/* AUTO-GENERATED via shared-core/scripts/gen-ratgeber.py
 * Produktspezifische Inhalte fuer den Artikel-End-CTA (ConversionCTA).
 * Quelle: PRODUCT_REGISTRY — NICHT von Hand editieren.
 */
import { Mic, Calculator } from "lucide-react";
import type { ConversionVariant } from "./related-map";

export interface CtaVariantContent {
  Icon: typeof Mic;
  eyebrow: string;
  headline: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  bullets: string[];
}

const PRODUKT: CtaVariantContent = {
  Icon: Mic,
  eyebrow: "GefaehrdungsbeurteilungAI",
  headline: "Werkstatt-Rundgang einsprechen. Audit-sichere Gefaehrdungsbeurteilung erhalten.",
  body: "Jeder Arbeitgeber muss Gefaehrdungsbeurteilungen dokumentieren (Paragraph 5/6 ArbSchG). Sie gehen durch den Betrieb und sprechen, was Sie sehen - wir erzeugen das vollstaendige Dokument mit Risikomatrix, STOP-Massnahmen und Fristen. Inklusive psychischer Belastung, die 80 Prozent der Betriebe vergessen.",
  primary: { label: "Kostenlos starten", href: "/signup" },
  secondary: { label: "Preise ansehen", href: "/preise" },
  bullets: [
    "1 Beurteilung pro Monat gratis — keine Kreditkarte",
    "DSGVO-konform · EU-Hosting (Frankfurt) · AVV zum Download",
    "Paragraph 5/6 ArbSchG komplett",
  ],
};

const PREISE: CtaVariantContent = {
  Icon: Calculator,
  eyebrow: "GefaehrdungsbeurteilungAI",
  headline: "Rechnet sich ab dem ersten Monat.",
  body: "Starter 79 EUR/Monat, Pro 149 EUR/Monat — monatlich kündbar, jährlich zahlen spart 2 Monate. Zum Vergleich: Gewerbeaufsicht und Berufsgenossenschaft pruefen die Dokumentation - fehlt sie, drohen Bussgelder und nach einem Arbeitsunfall persoenliche Haftung des Geschaeftsfuehrers.",
  primary: { label: "Preise ansehen", href: "/preise" },
  secondary: { label: "Kostenlos starten", href: "/signup" },
  bullets: [
    "1 Beurteilung pro Monat gratis",
    "Monatlich kündbar, Export jederzeit",
    "AVV nach Art. 28 DSGVO zum Download",
  ],
};

// Die vier historischen Varianten-Keys mappen auf zwei Inhalts-Typen:
// protokoll/beschluss -> Produkt-Pitch, finanzen/verwalter -> Preis-Pitch.
export const VARIANT_CONFIG: Record<ConversionVariant, CtaVariantContent> = {
  protokoll: PRODUKT,
  beschluss: PRODUKT,
  finanzen: PREISE,
  verwalter: PREISE,
};
