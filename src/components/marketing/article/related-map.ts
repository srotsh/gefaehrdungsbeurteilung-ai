/**
 * AUTO-GENERATED via shared-core/scripts/gen-related-map.py
 * Cross-Reference-Map fuer Ratgeber-Artikel — Single source of truth fuer
 * <RelatedArticles slug="..." /> und <ConversionCTA slug="..." />.
 *
 * Heuristik: pro Slug 5 thematisch-naechste Slugs (Pillar + Kategorie-Cluster).
 * Manuelles Tuning: einfach diesen File neu schreiben oder ans Generator-Skript
 * weitergeben.
 */

export type ConversionVariant =
  | "protokoll"
  | "beschluss"
  | "finanzen"
  | "verwalter";

export interface RelatedConfig {
  related: string[];
  cta: ConversionVariant;
}

export const RELATED_MAP: Record<string, RelatedConfig> = {
  "gefaehrdungsbeurteilung-erstellen": {
    related: [
      "psychische-belastung-gefaehrdungsbeurteilung",
      "risikomatrix-nohl-anleitung",
      "gbu-pflicht-check",
      "stop-prinzip-massnahmen",
      "gefaehrdungsbeurteilung-buero-muster",
    ],
    cta: "protokoll",
  },
  "psychische-belastung-gefaehrdungsbeurteilung": {
    related: [
      "gefaehrdungsbeurteilung-erstellen",
      "risikomatrix-nohl-anleitung",
      "gbu-pflicht-check",
      "stop-prinzip-massnahmen",
      "gefaehrdungsbeurteilung-buero-muster",
    ],
    cta: "protokoll",
  },
  "risikomatrix-nohl-anleitung": {
    related: [
      "gefaehrdungsbeurteilung-erstellen",
      "stop-prinzip-massnahmen",
      "psychische-belastung-gefaehrdungsbeurteilung",
      "gbu-pflicht-check",
      "gefaehrdungsbeurteilung-buero-muster",
    ],
    cta: "protokoll",
  },
  "gbu-pflicht-check": {
    related: [
      "gefaehrdungsbeurteilung-erstellen",
      "psychische-belastung-gefaehrdungsbeurteilung",
      "risikomatrix-nohl-anleitung",
      "stop-prinzip-massnahmen",
      "gefaehrdungsbeurteilung-buero-muster",
    ],
    cta: "protokoll",
  },
  "stop-prinzip-massnahmen": {
    related: [
      "gefaehrdungsbeurteilung-erstellen",
      "risikomatrix-nohl-anleitung",
      "psychische-belastung-gefaehrdungsbeurteilung",
      "gbu-pflicht-check",
      "gefaehrdungsbeurteilung-buero-muster",
    ],
    cta: "protokoll",
  },
  "gefaehrdungsbeurteilung-buero-muster": {
    related: [
      "gefaehrdungsbeurteilung-erstellen",
      "gefaehrdungsbeurteilung-werkstatt-muster",
      "gefaehrdungsbeurteilung-baustelle-muster",
      "gefaehrdungsbeurteilung-gastronomie-muster",
      "gefaehrdungsbeurteilung-lager-muster",
    ],
    cta: "protokoll",
  },
  "gefaehrdungsbeurteilung-werkstatt-muster": {
    related: [
      "gefaehrdungsbeurteilung-erstellen",
      "gefaehrdungsbeurteilung-buero-muster",
      "gefaehrdungsbeurteilung-baustelle-muster",
      "gefaehrdungsbeurteilung-gastronomie-muster",
      "gefaehrdungsbeurteilung-lager-muster",
    ],
    cta: "protokoll",
  },
  "gefaehrdungsbeurteilung-baustelle-muster": {
    related: [
      "gefaehrdungsbeurteilung-erstellen",
      "gefaehrdungsbeurteilung-buero-muster",
      "gefaehrdungsbeurteilung-werkstatt-muster",
      "gefaehrdungsbeurteilung-gastronomie-muster",
      "gefaehrdungsbeurteilung-lager-muster",
    ],
    cta: "protokoll",
  },
  "gefaehrdungsbeurteilung-gastronomie-muster": {
    related: [
      "gefaehrdungsbeurteilung-erstellen",
      "gefaehrdungsbeurteilung-buero-muster",
      "gefaehrdungsbeurteilung-werkstatt-muster",
      "gefaehrdungsbeurteilung-baustelle-muster",
      "gefaehrdungsbeurteilung-lager-muster",
    ],
    cta: "protokoll",
  },
  "gefaehrdungsbeurteilung-lager-muster": {
    related: [
      "gefaehrdungsbeurteilung-erstellen",
      "gefaehrdungsbeurteilung-buero-muster",
      "gefaehrdungsbeurteilung-werkstatt-muster",
      "gefaehrdungsbeurteilung-baustelle-muster",
      "gefaehrdungsbeurteilung-gastronomie-muster",
    ],
    cta: "protokoll",
  },
};
