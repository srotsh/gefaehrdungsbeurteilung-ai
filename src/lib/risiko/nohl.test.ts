import { describe, it, expect } from "vitest";
import { bewerteRisiko, summarizeRisiko } from "./nohl";
import type { GbuData } from "@/lib/validations";

describe("bewerteRisiko (Nohl)", () => {
  it("berechnet die Maßzahl als Produkt", () => {
    expect(bewerteRisiko(2, 3).masszahl).toBe(6);
    expect(bewerteRisiko(5, 5).masszahl).toBe(25);
  });

  it("stuft <=6 als gering ein", () => {
    expect(bewerteRisiko(1, 1).stufe).toBe(1);
    expect(bewerteRisiko(2, 3).stufe).toBe(1);
    expect(bewerteRisiko(3, 2).stufe).toBe(1);
  });

  it("stuft 7-12 als mittel ein", () => {
    expect(bewerteRisiko(2, 4).stufe).toBe(2);
    expect(bewerteRisiko(3, 4).stufe).toBe(2);
    expect(bewerteRisiko(3, 3).stufe).toBe(2);
  });

  it("stuft >12 als hoch ein", () => {
    expect(bewerteRisiko(4, 4).stufe).toBe(3);
    expect(bewerteRisiko(3, 5).stufe).toBe(3);
    expect(bewerteRisiko(5, 5).stufe).toBe(3);
  });

  it("clampt Werte außerhalb 1-5", () => {
    expect(bewerteRisiko(0, 99).masszahl).toBe(5);
    expect(bewerteRisiko(-3, 3).masszahl).toBe(3);
    expect(bewerteRisiko(NaN, 2).masszahl).toBe(2);
  });
});

describe("summarizeRisiko", () => {
  const data: GbuData = {
    arbeitsbereich_beschreibung: "",
    verantwortlich: "",
    psychische_belastung_betrachtet: true,
    hinweise: "",
    taetigkeiten: [
      {
        name: "Sägen an der Kreissäge",
        beschreibung: "",
        gefaehrdungen: [
          {
            faktor: "mechanisch",
            beschreibung: "Schnittverletzung durch fehlenden Spaltkeil",
            wahrscheinlichkeit: 4,
            schadensschwere: 4,
            massnahmen: [
              { beschreibung: "Spaltkeil montieren", stop_kategorie: "technisch", verantwortlich: "", frist: "" },
            ],
          },
          {
            faktor: "laerm_vibration",
            beschreibung: "Lärmpegel über 85 dB(A)",
            wahrscheinlichkeit: 3,
            schadensschwere: 3,
            massnahmen: [
              { beschreibung: "Gehörschutz tragen", stop_kategorie: "persoenlich", verantwortlich: "", frist: "" },
              { beschreibung: "Lärmmessung beauftragen", stop_kategorie: "organisatorisch", verantwortlich: "", frist: "" },
            ],
          },
        ],
      },
      {
        name: "Büroarbeit",
        beschreibung: "",
        gefaehrdungen: [
          {
            faktor: "psychische_belastung",
            beschreibung: "Termindruck in Stoßzeiten",
            wahrscheinlichkeit: 2,
            schadensschwere: 2,
            massnahmen: [],
          },
        ],
      },
    ],
  };

  it("zählt Gefährdungen und Maßnahmen pro Stufe", () => {
    const s = summarizeRisiko(data);
    expect(s.gefaehrdungenGesamt).toBe(3);
    expect(s.stufe3).toBe(1);
    expect(s.stufe2).toBe(1);
    expect(s.stufe1).toBe(1);
    expect(s.massnahmenGesamt).toBe(3);
    expect(s.maxStufe).toBe(3);
  });

  it("liefert maxStufe 0 ohne Gefährdungen", () => {
    const empty: GbuData = { ...data, taetigkeiten: [{ name: "Leer", beschreibung: "", gefaehrdungen: [] }] };
    expect(summarizeRisiko(empty).maxStufe).toBe(0);
  });
});
