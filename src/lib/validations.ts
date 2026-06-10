import { z } from "zod";

/**
 * Domänenmodell der Gefährdungsbeurteilung (§5/§6 ArbSchG).
 *
 * Die strukturierten Inhalte einer GBU leben als JSONB in `gbus.gbu_data`
 * und werden hier validiert — sowohl der LLM-Output als auch jede Speicherung
 * aus dem Editor. Zahlen (Risikostufe) kommen NIE vom LLM, sondern aus
 * `lib/risiko/nohl.ts`.
 */

export const GefaehrdungsfaktorSchema = z.enum([
  "mechanisch",
  "elektrisch",
  "gefahrstoffe",
  "brand_explosion",
  "laerm_vibration",
  "klima",
  "physische_belastung",
  "psychische_belastung",
  "arbeitsorganisation",
  "sonstige",
]);
export type Gefaehrdungsfaktor = z.infer<typeof GefaehrdungsfaktorSchema>;

export const FAKTOR_LABELS: Record<Gefaehrdungsfaktor, string> = {
  mechanisch: "Mechanische Gefährdung",
  elektrisch: "Elektrische Gefährdung",
  gefahrstoffe: "Gefahrstoffe",
  brand_explosion: "Brand- und Explosionsgefährdung",
  laerm_vibration: "Lärm und Vibration",
  klima: "Klima / Arbeitsumgebung",
  physische_belastung: "Physische Belastung",
  psychische_belastung: "Psychische Belastung",
  arbeitsorganisation: "Arbeitsorganisation",
  sonstige: "Sonstige Gefährdung",
};

export const StopKategorieSchema = z.enum([
  "substitution",
  "technisch",
  "organisatorisch",
  "persoenlich",
]);
export type StopKategorie = z.infer<typeof StopKategorieSchema>;

export const STOP_LABELS: Record<StopKategorie, string> = {
  substitution: "S — Substitution",
  technisch: "T — Technisch",
  organisatorisch: "O — Organisatorisch",
  persoenlich: "P — Persönlich (PSA)",
};

/** Reihenfolge der STOP-Hierarchie für Sortierung und Validierung. */
export const STOP_ORDER: StopKategorie[] = [
  "substitution",
  "technisch",
  "organisatorisch",
  "persoenlich",
];

export const MassnahmeSchema = z.object({
  beschreibung: z.string().min(5),
  stop_kategorie: StopKategorieSchema,
  verantwortlich: z.string().optional().default(""),
  /** ISO-Datum (YYYY-MM-DD) oder leer. */
  frist: z.string().optional().default(""),
});
export type Massnahme = z.infer<typeof MassnahmeSchema>;

export const GefaehrdungSchema = z.object({
  faktor: GefaehrdungsfaktorSchema,
  beschreibung: z.string().min(5),
  /** Wahrscheinlichkeit 1 (sehr gering) … 5 (sehr hoch) — Nohl. */
  wahrscheinlichkeit: z.number().int().min(1).max(5),
  /** Schadensschwere 1 (gering) … 5 (katastrophal) — Nohl. */
  schadensschwere: z.number().int().min(1).max(5),
  massnahmen: z.array(MassnahmeSchema),
});
export type Gefaehrdung = z.infer<typeof GefaehrdungSchema>;

export const TaetigkeitSchema = z.object({
  name: z.string().min(2),
  beschreibung: z.string().optional().default(""),
  gefaehrdungen: z.array(GefaehrdungSchema),
});
export type Taetigkeit = z.infer<typeof TaetigkeitSchema>;

export const GbuDataSchema = z.object({
  /** Kurzbeschreibung des begangenen Arbeitsbereichs. */
  arbeitsbereich_beschreibung: z.string().optional().default(""),
  /** Verantwortliche Person (Arbeitgeber / SiFa), erscheint auf dem Deckblatt. */
  verantwortlich: z.string().optional().default(""),
  taetigkeiten: z.array(TaetigkeitSchema).min(1),
  /**
   * Pflicht seit 2013, in der Praxis am häufigsten vergessen: Die psychische
   * Belastung muss IMMER betrachtet werden — auch wenn das Ergebnis
   * "keine besondere Gefährdung" lautet.
   */
  psychische_belastung_betrachtet: z.boolean(),
  hinweise: z.string().optional().default(""),
});
export type GbuData = z.infer<typeof GbuDataSchema>;

export const BRANCHEN = [
  "buero",
  "handwerk_werkstatt",
  "bau",
  "gastro",
  "einzelhandel",
  "logistik_lager",
  "pflege",
  "kfz",
  "friseur_kosmetik",
  "produktion",
] as const;
export type Branche = (typeof BRANCHEN)[number];

export const BRANCHEN_LABELS: Record<Branche, string> = {
  buero: "Büro / Verwaltung",
  handwerk_werkstatt: "Handwerk / Werkstatt",
  bau: "Bau / Baustelle",
  gastro: "Gastronomie / Küche",
  einzelhandel: "Einzelhandel",
  logistik_lager: "Logistik / Lager",
  pflege: "Pflege",
  kfz: "Kfz-Werkstatt",
  friseur_kosmetik: "Friseur / Kosmetik",
  produktion: "Produktion / Fertigung",
};

export const NewArbeitsbereichSchema = z.object({
  name: z.string().min(2),
  branche: z.enum(BRANCHEN),
  standort: z.string().optional().default(""),
  beschreibung: z.string().optional().default(""),
});
