import type { Branche, Gefaehrdungsfaktor } from "@/lib/validations";

/**
 * Branchen-Kataloge: typische Gefährdungen pro Branche. Dienen als
 * (a) Seed für die geführte Checkliste im Wizard und
 * (b) Kontext für den System-Prompt, damit die AI branchentypische
 *     Gefährdungen nicht übersieht.
 *
 * Inhalte sind bewusst generisch gehalten; konkrete Grenzwerte werden NICHT
 * genannt (TRGS/TRBS/ASR nur als generischer Verweis — siehe System-Prompt).
 */

export interface KatalogEintrag {
  faktor: Gefaehrdungsfaktor;
  beispiel: string;
}

export const BRANCHEN_KATALOG: Record<Branche, KatalogEintrag[]> = {
  buero: [
    { faktor: "physische_belastung", beispiel: "Bildschirmarbeit: Zwangshaltung, fehlende ergonomische Einstellung von Stuhl/Tisch/Monitor" },
    { faktor: "psychische_belastung", beispiel: "Termindruck, Daueraufmerksamkeit, Unterbrechungen, unklare Zuständigkeiten" },
    { faktor: "klima", beispiel: "Raumklima: Zugluft durch Klimaanlage, trockene Luft, unzureichende Beleuchtung" },
    { faktor: "mechanisch", beispiel: "Stolperstellen durch Kabel, offene Schubladen, schlecht gesicherte Regale" },
    { faktor: "elektrisch", beispiel: "Mehrfachsteckdosen-Ketten, beschädigte Gerätekabel" },
    { faktor: "brand_explosion", beispiel: "Fluchtwege durch Lagerung verstellt, fehlende Brandschutzunterweisung" },
  ],
  handwerk_werkstatt: [
    { faktor: "mechanisch", beispiel: "Holz-/Metallbearbeitungsmaschinen: fehlende Schutzeinrichtungen (z. B. Spaltkeil, Schutzhaube), wegfliegende Teile" },
    { faktor: "laerm_vibration", beispiel: "Maschinenlärm, Hand-Arm-Vibration durch Schleif-/Bohrgeräte" },
    { faktor: "gefahrstoffe", beispiel: "Holzstaub, Lösemittel, Lacke, Kleber — Absaugung und Kennzeichnung" },
    { faktor: "elektrisch", beispiel: "Beschädigte Leitungen, fehlende Prüfung ortsveränderlicher Betriebsmittel" },
    { faktor: "brand_explosion", beispiel: "Stäube und Lösemittel in Verbindung mit Zündquellen (Schleiffunken, Rauchen)" },
    { faktor: "physische_belastung", beispiel: "Heben und Tragen schwerer Werkstücke, Zwangshaltungen" },
    { faktor: "psychische_belastung", beispiel: "Termindruck bei Kundenaufträgen, Alleinarbeit" },
  ],
  bau: [
    { faktor: "mechanisch", beispiel: "Absturz von Gerüsten/Leitern, herabfallende Teile, Anfahren durch Baumaschinen" },
    { faktor: "physische_belastung", beispiel: "Heben/Tragen von Lasten, kniende Tätigkeiten, Überkopfarbeit" },
    { faktor: "gefahrstoffe", beispiel: "Mineralischer Staub (Quarz), Epoxidharze, Bitumen, ggf. Asbest bei Bestandsbauten" },
    { faktor: "laerm_vibration", beispiel: "Baumaschinenlärm, Vibration durch Stampfer/Abbruchhämmer" },
    { faktor: "klima", beispiel: "Witterung: Hitze, Kälte, UV-Strahlung bei Außenarbeit" },
    { faktor: "elektrisch", beispiel: "Baustromverteiler, beschädigte Leitungen, Arbeiten in der Nähe von Freileitungen" },
    { faktor: "psychische_belastung", beispiel: "Termindruck, lange Anfahrtswege, Verantwortung für Dritte" },
  ],
  gastro: [
    { faktor: "mechanisch", beispiel: "Schnittverletzungen (Messer, Aufschnittmaschine), Ausrutschen auf nassen/fettigen Böden" },
    { faktor: "klima", beispiel: "Hitze am Herd/Ofen, Wechsel zwischen Kühlhaus und Küche" },
    { faktor: "brand_explosion", beispiel: "Fettbrände, Gasanlagen, Fritteusen" },
    { faktor: "gefahrstoffe", beispiel: "Reinigungs- und Desinfektionsmittel, Backofensprays" },
    { faktor: "physische_belastung", beispiel: "Langes Stehen, Tragen von Getränkekisten, Spitzenbelastung im Service" },
    { faktor: "psychische_belastung", beispiel: "Zeitdruck im Service, Konflikte mit Gästen, Wochenend-/Nachtarbeit" },
  ],
  einzelhandel: [
    { faktor: "physische_belastung", beispiel: "Heben/Tragen bei Warenannahme, langes Stehen an der Kasse" },
    { faktor: "mechanisch", beispiel: "Schneidgeräte (Kartonmesser), Leitern im Lager, Rollcontainer" },
    { faktor: "psychische_belastung", beispiel: "Kundenkontakt-Konflikte, Überfallrisiko an der Kasse, Personalengpässe" },
    { faktor: "arbeitsorganisation", beispiel: "Alleinarbeit zu Randzeiten, unklare Vertretungsregelungen" },
    { faktor: "brand_explosion", beispiel: "Verstellte Fluchtwege durch Warenaufbauten" },
  ],
  logistik_lager: [
    { faktor: "mechanisch", beispiel: "Flurförderzeuge (Stapler), herabfallende Paletten, Quetschstellen an Toren" },
    { faktor: "physische_belastung", beispiel: "Manuelles Heben/Ziehen/Schieben, repetitive Kommissioniertätigkeiten" },
    { faktor: "laerm_vibration", beispiel: "Lärm durch Förderanlagen, Ganzkörpervibration auf Staplern" },
    { faktor: "klima", beispiel: "Zugluft an Toren, Kühllagerbereiche" },
    { faktor: "arbeitsorganisation", beispiel: "Schichtarbeit, Leistungsvorgaben, Verkehrswege-Organisation" },
    { faktor: "psychische_belastung", beispiel: "Monotonie, Zeitdruck durch Taktung" },
  ],
  pflege: [
    { faktor: "physische_belastung", beispiel: "Bewegen von Bewohnern/Patienten (Transfer), Arbeiten in gebückter Haltung" },
    { faktor: "gefahrstoffe", beispiel: "Desinfektionsmittel, Medikamente, ggf. Zytostatika" },
    { faktor: "psychische_belastung", beispiel: "Emotionale Belastung, Zeitdruck, Schichtarbeit, Gewalt durch Bewohner" },
    { faktor: "mechanisch", beispiel: "Stich-/Schnittverletzungen (Kanülen), Ausrutschen auf feuchten Böden" },
    { faktor: "arbeitsorganisation", beispiel: "Personalengpässe, Alleinarbeit im Nachtdienst, Dokumentationslast" },
  ],
  kfz: [
    { faktor: "mechanisch", beispiel: "Hebebühnen, rotierende Teile, Reifenmontiermaschinen, herabfallende Aggregate" },
    { faktor: "gefahrstoffe", beispiel: "Kraftstoffe, Öle, Bremsenreiniger, Abgase, Batteriesäure; Hochvolt bei E-Fahrzeugen" },
    { faktor: "elektrisch", beispiel: "Hochvoltsysteme in Elektro-/Hybridfahrzeugen — nur qualifiziertes Personal" },
    { faktor: "brand_explosion", beispiel: "Kraftstoffdämpfe, Schweißarbeiten in der Nähe von Tanks, Lithium-Batterien" },
    { faktor: "laerm_vibration", beispiel: "Schlagschrauber, Karosseriearbeiten" },
    { faktor: "physische_belastung", beispiel: "Überkopfarbeit unter der Hebebühne, Zwangshaltungen im Motorraum" },
    { faktor: "psychische_belastung", beispiel: "Termindruck bei Reparaturannahme, Kundenkonflikte" },
  ],
  friseur_kosmetik: [
    { faktor: "gefahrstoffe", beispiel: "Färbemittel, Blondierungen, Dauerwellpräparate — Hauterkrankungen sind Berufskrankheit Nr. 1" },
    { faktor: "physische_belastung", beispiel: "Langes Stehen, Arbeiten mit erhobenen Armen, repetitive Schneidbewegungen" },
    { faktor: "mechanisch", beispiel: "Schnittverletzungen durch Scheren/Klingen" },
    { faktor: "klima", beispiel: "Feuchtarbeit (Haarewaschen) — Hautschutzplan erforderlich" },
    { faktor: "psychische_belastung", beispiel: "Kundentaktung, emotionale Arbeit, Wochenendarbeit" },
  ],
  produktion: [
    { faktor: "mechanisch", beispiel: "Maschinen mit beweglichen Teilen, Einzugs-/Quetschstellen, automatisierte Anlagen" },
    { faktor: "laerm_vibration", beispiel: "Dauerlärm in der Halle, Vibrationen an Pressen/Stanzen" },
    { faktor: "gefahrstoffe", beispiel: "Kühlschmierstoffe, Stäube, Schweißrauche" },
    { faktor: "elektrisch", beispiel: "Schaltschränke, Instandhaltungsarbeiten an Anlagen" },
    { faktor: "brand_explosion", beispiel: "Stäube (ATEX-Bereiche), heiße Oberflächen, Schweißarbeiten" },
    { faktor: "physische_belastung", beispiel: "Taktgebundene repetitive Tätigkeiten, Heben an Übergabestationen" },
    { faktor: "arbeitsorganisation", beispiel: "Schichtsystem, Anlernsituationen, Instandhaltung unter Zeitdruck" },
    { faktor: "psychische_belastung", beispiel: "Monotonie, Taktbindung, Verantwortung für Anlagenstillstände" },
  ],
};

/** Checklisten-Text für den geführten Modus (vorbefüllt im Wizard). */
export function checklisteFuerBranche(branche: Branche): string {
  const eintraege = BRANCHEN_KATALOG[branche];
  return eintraege
    .map((e, i) => `${i + 1}. [${e.faktor}] ${e.beispiel}\n   Beobachtung: `)
    .join("\n");
}
