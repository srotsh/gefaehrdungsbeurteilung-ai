/**
 * Cross-Reference-Map für alle Ratgeber-Artikel.
 *
 * Pro Slug 4-5 thematisch verwandte Slugs in absteigender Relevanz +
 * ein Conversion-CTA-Variant (siehe ConversionCTA).
 *
 * Wird genutzt von <RelatedArticles slug="..." /> und
 * <ConversionCTA slug="..." />.
 */

export type ConversionVariant =
  /** Audio-zu-Protokoll Hauptprodukt — für Versammlungs-/Protokoll-Artikel */
  | "protokoll"
  /** Beschluss-Bibliothek + Sprachprüfung — für Beschluss-/Mehrheits-Artikel */
  | "beschluss"
  /** Abrechnungs-/Rücklage-Calculator — für Finanz-Artikel */
  | "finanzen"
  /** Demo & Pricing — für Verwalter-/Compliance-Artikel */
  | "verwalter";

export interface RelatedConfig {
  related: string[];
  cta: ConversionVariant;
}

/**
 * Map slug → { related, cta }
 *
 * Heuristik für `related`:
 *  - 1. Eintrag = direkter "Next-Read"
 *  - 2-4 = thematisch näher Cluster
 *  - 5 = breiterer Kontext (Recht/Reform), erhält Klick-Tiefe
 */
export const RELATED_MAP: Record<string, RelatedConfig> = {
  "weg-protokoll-richtig-erstellen": {
    related: [
      "eigentuemerversammlung-protokollieren",
      "beschluss-formulieren-weg",
      "weg-gesetz-24",
      "beschlussfaehigkeit-weg",
      "weg-beschluss-anfechten",
    ],
    cta: "protokoll",
  },
  "eigentuemerversammlung-protokollieren": {
    related: [
      "weg-protokoll-richtig-erstellen",
      "beschluss-formulieren-weg",
      "online-eigentuemerversammlung",
      "vollmacht-eigentuemerversammlung",
      "weg-gesetz-24",
    ],
    cta: "protokoll",
  },
  "beschluss-formulieren-weg": {
    related: [
      "sonderumlage-beschluss-muster",
      "weg-beschluss-anfechten",
      "umlaufbeschluss-weg",
      "beschlussfaehigkeit-weg",
      "weg-protokoll-richtig-erstellen",
    ],
    cta: "beschluss",
  },
  "sonderumlage-beschluss-muster": {
    related: [
      "wirtschaftsplan-weg-muster",
      "erhaltungsruecklage-weg",
      "beschluss-formulieren-weg",
      "jahresabrechnung-weg-muster",
      "hausgeld-einklagen",
    ],
    cta: "finanzen",
  },
  "umlaufbeschluss-weg": {
    related: [
      "beschluss-formulieren-weg",
      "online-eigentuemerversammlung",
      "weg-reform-2020",
      "beschlussfaehigkeit-weg",
      "weg-protokoll-richtig-erstellen",
    ],
    cta: "beschluss",
  },
  "weg-gesetz-24": {
    related: [
      "weg-protokoll-richtig-erstellen",
      "beschlussfaehigkeit-weg",
      "weg-reform-2020",
      "vollmacht-eigentuemerversammlung",
      "eigentuemerversammlung-protokollieren",
    ],
    cta: "protokoll",
  },
  "weg-reform-2020": {
    related: [
      "weg-gesetz-24",
      "online-eigentuemerversammlung",
      "beschlussfaehigkeit-weg",
      "umlaufbeschluss-weg",
      "bauliche-veraenderung-weg",
    ],
    cta: "verwalter",
  },
  "beschlussfaehigkeit-weg": {
    related: [
      "weg-reform-2020",
      "weg-gesetz-24",
      "vollmacht-eigentuemerversammlung",
      "weg-protokoll-richtig-erstellen",
      "eigentuemerversammlung-protokollieren",
    ],
    cta: "protokoll",
  },
  "weg-beschluss-anfechten": {
    related: [
      "beschluss-formulieren-weg",
      "weg-protokoll-richtig-erstellen",
      "weg-gesetz-24",
      "beschlussfaehigkeit-weg",
      "vollmacht-eigentuemerversammlung",
    ],
    cta: "beschluss",
  },
  "weg-verwalter-pflichten": {
    related: [
      "verwaltungsbeirat-weg",
      "verwalterwechsel-weg",
      "jahresabrechnung-weg-muster",
      "hausgeld-einklagen",
      "weg-gesetz-24",
    ],
    cta: "verwalter",
  },
  "mea-berechnen-weg": {
    related: [
      "wirtschaftsplan-weg-muster",
      "jahresabrechnung-weg-muster",
      "sonderumlage-beschluss-muster",
      "erhaltungsruecklage-weg",
      "beschluss-formulieren-weg",
    ],
    cta: "finanzen",
  },
  "wirtschaftsplan-weg-muster": {
    related: [
      "jahresabrechnung-weg-muster",
      "erhaltungsruecklage-weg",
      "hausgeld-einklagen",
      "mea-berechnen-weg",
      "sonderumlage-beschluss-muster",
    ],
    cta: "finanzen",
  },
  "jahresabrechnung-weg-muster": {
    related: [
      "wirtschaftsplan-weg-muster",
      "erhaltungsruecklage-weg",
      "hausgeld-einklagen",
      "mea-berechnen-weg",
      "weg-verwalter-pflichten",
    ],
    cta: "finanzen",
  },
  "wallbox-weg-beschluss": {
    related: [
      "bauliche-veraenderung-weg",
      "beschluss-formulieren-weg",
      "weg-reform-2020",
      "sonderumlage-beschluss-muster",
      "beschlussfaehigkeit-weg",
    ],
    cta: "beschluss",
  },
  "bauliche-veraenderung-weg": {
    related: [
      "wallbox-weg-beschluss",
      "weg-reform-2020",
      "beschluss-formulieren-weg",
      "sonderumlage-beschluss-muster",
      "erhaltungsruecklage-weg",
    ],
    cta: "beschluss",
  },
  "online-eigentuemerversammlung": {
    related: [
      "eigentuemerversammlung-protokollieren",
      "weg-reform-2020",
      "vollmacht-eigentuemerversammlung",
      "umlaufbeschluss-weg",
      "weg-protokoll-richtig-erstellen",
    ],
    cta: "protokoll",
  },
  "erhaltungsruecklage-weg": {
    related: [
      "wirtschaftsplan-weg-muster",
      "jahresabrechnung-weg-muster",
      "sonderumlage-beschluss-muster",
      "hausgeld-einklagen",
      "mea-berechnen-weg",
    ],
    cta: "finanzen",
  },
  "vollmacht-eigentuemerversammlung": {
    related: [
      "eigentuemerversammlung-protokollieren",
      "beschlussfaehigkeit-weg",
      "online-eigentuemerversammlung",
      "weg-protokoll-richtig-erstellen",
      "weg-beschluss-anfechten",
    ],
    cta: "protokoll",
  },
  "verwaltungsbeirat-weg": {
    related: [
      "weg-verwalter-pflichten",
      "verwalterwechsel-weg",
      "jahresabrechnung-weg-muster",
      "hausgeld-einklagen",
      "weg-gesetz-24",
    ],
    cta: "verwalter",
  },
  "hausgeld-einklagen": {
    related: [
      "wirtschaftsplan-weg-muster",
      "jahresabrechnung-weg-muster",
      "weg-verwalter-pflichten",
      "erhaltungsruecklage-weg",
      "verwaltungsbeirat-weg",
    ],
    cta: "finanzen",
  },
  "verwalterwechsel-weg": {
    related: [
      "weg-verwalter-pflichten",
      "verwaltungsbeirat-weg",
      "jahresabrechnung-weg-muster",
      "weg-beschluss-anfechten",
      "weg-gesetz-24",
    ],
    cta: "verwalter",
  },
};
