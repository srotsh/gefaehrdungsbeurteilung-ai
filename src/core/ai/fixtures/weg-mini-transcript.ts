/**
 * Synthetisches Fixture-Transkript für WEG-Eigentümerversammlung.
 *
 * Eingesetzt im Eval-Harness als Baseline-Test für Domain-Prompts.
 * Realistisch genug, um typische Edge-Cases (Doppel-Mehrheit,
 * Unklarheit → [PRÜFEN], Vollmachten) zu triggern.
 *
 * Quelle: synthetisch — keine echten Personen/Adressen.
 */

export const WEG_MINI_TRANSCRIPT = `
Verwalter Müller eröffnet die Versammlung um 18:05 Uhr und stellt fest, dass
12 von 18 Einheiten anwesend sind, davon 2 per Vollmacht. Die anwesenden
MEA betragen 7220 von insgesamt 10000. Die Beschlussfähigkeit ist damit
festgestellt. Die Einladung war ordnungsgemäß und in Textform versandt.

TOP 1: Begrüßung und Feststellung der Beschlussfähigkeit. Keine Einwände.

TOP 2: Genehmigung des Protokolls vom 12. März 2025. Eine Eigentümerin
fragt, warum die Diskussion zur Tiefgarage so kurz protokolliert wurde.
Verwalter erklärt, dass der Punkt nicht beschlossen wurde und daher nur
zusammengefasst wird. Es liegen keine weiteren Einwände vor.
Abstimmung: 12 Ja, 0 Nein, 0 Enthaltung. Einstimmig angenommen.

TOP 3: Jahresabrechnung 2025. Die Abrechnung wurde mit der Einladung
versandt. Ein Eigentümer fragt nach der Position "Reparatur Aufzug 4280
Euro". Der Verwaltungsbeirat (Frau Klein) bestätigt die Plausibilität.
Beschluss: Die Eigentümerversammlung beschließt die in der Jahresabrechnung
2025 ermittelten Abrechnungsspitzen. Auf Eigentümer mit Nachzahlungspflicht
entfallen 12430,50 Euro, auf Eigentümer mit Guthaben 3180,20 Euro.
Abstimmung: 11 Ja, 0 Nein, 1 Enthaltung. Angenommen mit einfacher Mehrheit.

TOP 4: Dachsanierung. Drei Angebote liegen vor: Firma A 42500 Euro,
Firma B 48900 Euro, Firma C 39200 Euro. Der Beirat empfiehlt Firma A
wegen besserer Referenzen und 5 Jahren Garantie.
Herr Schmidt stellt den Antrag, die Sanierung als Doppelmehrheit nach
Paragraph 21 Absatz 2 WEG zu beschließen, damit alle Eigentümer
kostenmäßig beteiligt sind.
Beschluss: Die Eigentümerversammlung beschließt die Beauftragung der
Firma A mit der Dachsanierung zu einem Festpreis von 42500 Euro brutto.
Die Finanzierung erfolgt zur Hälfte aus der Erhaltungsrücklage und zur
Hälfte über eine Sonderumlage, fällig zum 30. Juni 2026.
Abstimmung: 9 Ja, 2 Nein, 1 Enthaltung. Angenommen mit qualifizierter
Mehrheit (Doppelmehrheit nach Paragraph 21 Absatz 2 WEG).

TOP 5: Wallbox-Antrag von Frau Wagner, Wohnung Nr. 7. Sie möchte auf
eigene Kosten eine Wallbox am Stellplatz 7 errichten. Anschluss separater
Zähler, Wartung und Versicherung trägt Frau Wagner selbst. Die WEG hat
einen gesetzlichen Anspruch auf Gestattung nach Paragraph 20 Absatz 2 WEG.
Beschluss: Die Eigentümerversammlung gestattet Frau Wagner die Errichtung
einer Wallbox am Stellplatz 7 auf eigene Kosten gemäß den genannten
Bedingungen.
Abstimmung: 12 Ja, 0 Nein, 0 Enthaltung. Einstimmig angenommen.

TOP 6: Verschiedenes. Frau Schneider weist darauf hin, dass die Briefkästen
ehemaliger Mieter nicht geleert werden. Verwalter prüft das. Herr Klein
bittet um... [unverständlich, mehrere Personen sprechen gleichzeitig]
... bei der nächsten Versammlung erneut auf die Tagesordnung.

Verwalter Müller schließt die Versammlung um 20:14 Uhr.
`.trim();

export const WEG_MINI_FIXTURE_META = {
  expectedTopCount: 6,
  expectedBeschluesseCount: 4, // TOP 1 hat keinen, TOP 6 hat keinen
  expectedPruefenMarkers: 1,   // TOP 6 unverständliche Stelle
  wegName: "WEG Beispielstraße 12-14",
  datum: "15.03.2026",
  ort: "Gemeinschaftsraum, Beispielstraße 14",
} as const;
