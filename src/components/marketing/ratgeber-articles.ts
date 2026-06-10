/**
 * Single source of truth fuer alle Ratgeber-Artikel dieses Produkts.
 * AUTO-GENERATED aus shared-core/scripts/SEO_TOPICS.py — manuelle Edits
 * werden bei naechstem `pnpm gen:ratgeber` ueberschrieben.
 */

export type RatgeberCategory =
  | "Grundlagen"
  | "Recht"
  | "Beschluesse"
  | "Finanzen"
  | "Versammlung"
  | "Verwalter"
  | "Spezialthemen"
  | "Methoden"
  | "Branchen-Muster";

export interface RatgeberArticle {
  slug: string;
  title: string;
  excerpt: string;
  readingTime: number;
  keyword: string;
  category: RatgeberCategory;
  isPillar: boolean;
}

export const RATGEBER_ARTICLES: RatgeberArticle[] = [
  {
    slug: 'gefaehrdungsbeurteilung-erstellen',
    title: 'Gefährdungsbeurteilung erstellen: Schritt-für-Schritt nach §5/§6 ArbSchG (2026)',
    excerpt: 'Wer muss, was gehört hinein, wie dokumentieren Sie audit-sicher — mit Risikomatrix, STOP-Maßnahmen und Wiedervorlage.',
    readingTime: 12,
    keyword: 'Gefährdungsbeurteilung erstellen',
    category: 'Grundlagen',
    isPillar: true,
  },
  {
    slug: 'psychische-belastung-gefaehrdungsbeurteilung',
    title: 'Psychische Belastung in der Gefährdungsbeurteilung: Pflicht seit 2013',
    excerpt: '80 % der Betriebe vergessen sie — was die GB psych enthalten muss, welche Methoden anerkannt sind und was die Gewerbeaufsicht prüft.',
    readingTime: 10,
    keyword: 'Gefährdungsbeurteilung psychische Belastung',
    category: 'Grundlagen',
    isPillar: false,
  },
  {
    slug: 'risikomatrix-nohl-anleitung',
    title: 'Risikomatrix nach Nohl: Wahrscheinlichkeit × Schadensschwere richtig bewerten',
    excerpt: 'So stufen Sie Gefährdungen nachvollziehbar ein — mit Beispielen pro Risikostufe und Handlungsbedarf.',
    readingTime: 8,
    keyword: 'Risikomatrix Nohl',
    category: 'Methoden',
    isPillar: false,
  },
  {
    slug: 'gbu-pflicht-check',
    title: 'Bin ich GBU-pflichtig? Der Schnell-Check für Arbeitgeber',
    excerpt: 'Ab dem ersten Beschäftigten gilt die Pflicht — was Gewerbeaufsicht und BG verlangen, welche Bußgelder drohen.',
    readingTime: 6,
    keyword: 'Gefährdungsbeurteilung Pflicht',
    category: 'Recht',
    isPillar: false,
  },
  {
    slug: 'stop-prinzip-massnahmen',
    title: 'Das STOP-Prinzip: Maßnahmen in der rechtlich richtigen Reihenfolge',
    excerpt: 'Substitution vor Technik vor Organisation vor PSA — warum die Reihenfolge zählt und wie Sie sie dokumentieren.',
    readingTime: 7,
    keyword: 'STOP Prinzip Arbeitsschutz',
    category: 'Methoden',
    isPillar: false,
  },
  {
    slug: 'gefaehrdungsbeurteilung-buero-muster',
    title: 'Gefährdungsbeurteilung Büro: Muster und typische Gefährdungen',
    excerpt: 'Bildschirmarbeit, Ergonomie, psychische Belastung — die komplette Vorlage für Büro-Arbeitsplätze.',
    readingTime: 8,
    keyword: 'Gefährdungsbeurteilung Büro Muster',
    category: 'Branchen-Muster',
    isPillar: false,
  },
  {
    slug: 'gefaehrdungsbeurteilung-werkstatt-muster',
    title: 'Gefährdungsbeurteilung Werkstatt/Handwerk: Muster mit Maschinenliste',
    excerpt: 'Kreissäge, Absaugung, Gefahrstoffe, Lärm — branchentypische Gefährdungen mit STOP-Maßnahmen.',
    readingTime: 9,
    keyword: 'Gefährdungsbeurteilung Werkstatt Muster',
    category: 'Branchen-Muster',
    isPillar: false,
  },
  {
    slug: 'gefaehrdungsbeurteilung-baustelle-muster',
    title: 'Gefährdungsbeurteilung Baustelle: Muster nach BaustellV',
    excerpt: 'Absturz, Heben/Tragen, Witterung — was auf jeder Baustelle bewertet werden muss.',
    readingTime: 9,
    keyword: 'Gefährdungsbeurteilung Baustelle Muster',
    category: 'Branchen-Muster',
    isPillar: false,
  },
  {
    slug: 'gefaehrdungsbeurteilung-gastronomie-muster',
    title: 'Gefährdungsbeurteilung Gastronomie/Küche: Muster und Checkliste',
    excerpt: 'Schnittverletzungen, heiße Oberflächen, Rutschgefahr, Stress im Service — die Gastro-Vorlage.',
    readingTime: 8,
    keyword: 'Gefährdungsbeurteilung Gastronomie Muster',
    category: 'Branchen-Muster',
    isPillar: false,
  },
  {
    slug: 'gefaehrdungsbeurteilung-lager-muster',
    title: 'Gefährdungsbeurteilung Lager/Logistik: Muster mit Stapler-Verkehr',
    excerpt: 'Flurförderzeuge, manuelle Lastenhandhabung, Verkehrswege — die Logistik-Vorlage.',
    readingTime: 8,
    keyword: 'Gefährdungsbeurteilung Lager Muster',
    category: 'Branchen-Muster',
    isPillar: false,
  },
];
