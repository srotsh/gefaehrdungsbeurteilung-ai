import type { GbuData } from "@/lib/validations";

/**
 * Risikobewertung nach Nohl: Risikomaßzahl = Wahrscheinlichkeit × Schadensschwere,
 * beide auf einer 1–5-Skala. Die Zahl wird DETERMINISTISCH hier berechnet —
 * niemals vom LLM.
 *
 * Stufen-Schwellen orientieren sich an der verbreiteten 3-Stufen-Praxis.
 * TODO(verify): Schwellenwerte mit SiFa/DGUV-Quelle abgleichen, bevor sie in
 * Kundenkommunikation als "nach Nohl" zitiert werden.
 */

export type Risikostufe = 1 | 2 | 3;

export interface Risiko {
  masszahl: number;
  stufe: Risikostufe;
  label: string;
  handlungsbedarf: string;
}

export const WAHRSCHEINLICHKEIT_LABELS: Record<number, string> = {
  1: "sehr gering",
  2: "gering",
  3: "mittel",
  4: "hoch",
  5: "sehr hoch",
};

export const SCHADENSSCHWERE_LABELS: Record<number, string> = {
  1: "gering (Bagatellverletzung)",
  2: "mäßig (meldepflichtiger Unfall)",
  3: "erheblich (schwerer Unfall)",
  4: "hoch (möglicher Dauerschaden)",
  5: "katastrophal (Tod / Verlust von Körperteilen)",
};

export function bewerteRisiko(
  wahrscheinlichkeit: number,
  schadensschwere: number
): Risiko {
  const w = clamp(wahrscheinlichkeit);
  const s = clamp(schadensschwere);
  const masszahl = w * s;

  if (masszahl <= 6) {
    return {
      masszahl,
      stufe: 1,
      label: "Gering",
      handlungsbedarf:
        "Kein unmittelbarer Handlungsbedarf — Situation beobachten, bei Änderungen neu bewerten.",
    };
  }
  if (masszahl <= 12) {
    return {
      masszahl,
      stufe: 2,
      label: "Mittel",
      handlungsbedarf:
        "Maßnahmen erforderlich — innerhalb angemessener Frist umsetzen und Wirksamkeit prüfen.",
    };
  }
  return {
    masszahl,
    stufe: 3,
    label: "Hoch",
    handlungsbedarf:
      "Sofortiger Handlungsbedarf — Tätigkeit bis zur Umsetzung wirksamer Maßnahmen einschränken oder einstellen.",
  };
}

function clamp(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(5, Math.max(1, Math.round(n)));
}

export interface GbuRisikoSummary {
  gefaehrdungenGesamt: number;
  stufe3: number;
  stufe2: number;
  stufe1: number;
  massnahmenGesamt: number;
  /** Höchste vorkommende Risikostufe (0 wenn keine Gefährdungen). */
  maxStufe: 0 | Risikostufe;
}

/** Aggregierte Kennzahlen über eine ganze GBU (für Dashboard + PDF-Deckblatt). */
export function summarizeRisiko(data: GbuData): GbuRisikoSummary {
  let stufe1 = 0;
  let stufe2 = 0;
  let stufe3 = 0;
  let massnahmen = 0;

  for (const t of data.taetigkeiten) {
    for (const g of t.gefaehrdungen) {
      const r = bewerteRisiko(g.wahrscheinlichkeit, g.schadensschwere);
      if (r.stufe === 1) stufe1++;
      else if (r.stufe === 2) stufe2++;
      else stufe3++;
      massnahmen += g.massnahmen.length;
    }
  }

  const gesamt = stufe1 + stufe2 + stufe3;
  const maxStufe: 0 | Risikostufe = stufe3 > 0 ? 3 : stufe2 > 0 ? 2 : stufe1 > 0 ? 1 : 0;
  return {
    gefaehrdungenGesamt: gesamt,
    stufe1,
    stufe2,
    stufe3,
    massnahmenGesamt: massnahmen,
    maxStufe,
  };
}
