import * as React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  LetterheadHeader,
  FooterWithPageNumbers,
  SignatureLines,
  Watermark,
} from "@flow/pdf";
import { FAKTOR_LABELS, STOP_LABELS, STOP_ORDER, type GbuData } from "@/lib/validations";
import { bewerteRisiko, summarizeRisiko } from "@/lib/risiko/nohl";

const s = StyleSheet.create({
  page: { padding: 40, paddingBottom: 60, fontSize: 9, color: "#0f172a", lineHeight: 1.4 },
  h2: { fontSize: 12, fontWeight: "bold", marginTop: 14, marginBottom: 6 },
  h3: { fontSize: 10, fontWeight: "bold", marginTop: 10, marginBottom: 4 },
  meta: { fontSize: 9, color: "#475569", marginBottom: 2 },
  cover: { marginTop: 60, alignItems: "center" },
  coverTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  coverSub: { fontSize: 12, color: "#475569", marginBottom: 24 },
  summaryRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  summaryBox: { borderWidth: 0.5, borderColor: "#cbd5e1", borderRadius: 4, padding: 10, flex: 1 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 0.5,
    borderColor: "#cbd5e1",
    fontWeight: "bold",
    fontSize: 8,
  },
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5, borderColor: "#e2e8f0", fontSize: 8 },
  cell: { padding: 4 },
  cFaktor: { width: "16%" },
  cBeschr: { width: "34%" },
  cRisiko: { width: "12%" },
  cMassn: { width: "38%" },
  risiko1: { color: "#047857" },
  risiko2: { color: "#b45309" },
  risiko3: { color: "#b91c1c", fontWeight: "bold" },
  planRow: { flexDirection: "row", borderBottomWidth: 0.5, borderColor: "#e2e8f0", fontSize: 8 },
  pruefen: { color: "#b91c1c" },
});

const RISIKO_STYLE = [s.risiko1, s.risiko1, s.risiko2, s.risiko3];

export interface GbuDocProps {
  data: GbuData;
  arbeitsbereich: { name: string; branche: string; standort?: string | null };
  revision: number;
  erstelltAm: string;
  naechsteRevision?: string | null;
  firmName?: string;
  showWatermark: boolean;
}

export function GbuDoc(props: GbuDocProps) {
  const { data } = props;
  const summary = summarizeRisiko(data);

  const massnahmenPlan = data.taetigkeiten.flatMap((t) =>
    t.gefaehrdungen.flatMap((g) =>
      [...g.massnahmen]
        .sort((a, b) => STOP_ORDER.indexOf(a.stop_kategorie) - STOP_ORDER.indexOf(b.stop_kategorie))
        .map((m) => ({
          taetigkeit: t.name,
          gefaehrdung: g.beschreibung,
          risiko: bewerteRisiko(g.wahrscheinlichkeit, g.schadensschwere),
          massnahme: m,
        }))
    )
  );

  return (
    <Document>
      {/* Deckblatt */}
      <Page size="A4" style={s.page}>
        {props.showWatermark && <Watermark text="ENTWURF" />}
        <LetterheadHeader
          firmName={props.firmName ?? "GefaehrdungsbeurteilungAI"}
          documentTitle="Gefährdungsbeurteilung"
          documentSubtitle={`nach §5/§6 ArbSchG · Revision ${props.revision}`}
          date={props.erstelltAm}
        />
        <View style={s.cover}>
          <Text style={s.coverTitle}>Gefährdungsbeurteilung</Text>
          <Text style={s.coverSub}>{props.arbeitsbereich.name}</Text>
          <Text style={s.meta}>Branche: {props.arbeitsbereich.branche}</Text>
          {props.arbeitsbereich.standort ? (
            <Text style={s.meta}>Standort: {props.arbeitsbereich.standort}</Text>
          ) : null}
          <Text style={s.meta}>Verantwortlich: {data.verantwortlich || "—"}</Text>
          <Text style={s.meta}>Revisionsstand: {props.revision} · erstellt am {props.erstelltAm}</Text>
          {props.naechsteRevision ? (
            <Text style={s.meta}>Nächste Überprüfung: {props.naechsteRevision}</Text>
          ) : null}

          <View style={s.summaryRow}>
            <View style={s.summaryBox}>
              <Text style={{ fontWeight: "bold" }}>{summary.gefaehrdungenGesamt}</Text>
              <Text>Gefährdungen</Text>
            </View>
            <View style={s.summaryBox}>
              <Text style={[{ fontWeight: "bold" }, s.risiko3]}>{summary.stufe3}</Text>
              <Text>Risiko hoch</Text>
            </View>
            <View style={s.summaryBox}>
              <Text style={[{ fontWeight: "bold" }, s.risiko2]}>{summary.stufe2}</Text>
              <Text>Risiko mittel</Text>
            </View>
            <View style={s.summaryBox}>
              <Text style={{ fontWeight: "bold" }}>{summary.massnahmenGesamt}</Text>
              <Text>Maßnahmen</Text>
            </View>
          </View>

          <View style={{ marginTop: 24 }}>
            <Text style={s.meta}>
              Psychische Belastung betrachtet: {data.psychische_belastung_betrachtet ? "ja" : "NEIN — nachholen!"}
            </Text>
          </View>
        </View>
        <FooterWithPageNumbers customNote="Erstellt mit GefaehrdungsbeurteilungAI. Inhaltliche Verantwortung trägt der Arbeitgeber / die unterzeichnende Fachkraft." />
      </Page>

      {/* Gefährdungstabellen pro Tätigkeit */}
      <Page size="A4" style={s.page}>
        {props.showWatermark && <Watermark text="ENTWURF" />}
        <Text style={s.h2}>Gefährdungen und Bewertung (Risikomatrix nach Nohl)</Text>
        {data.arbeitsbereich_beschreibung ? (
          <Text style={s.meta}>{data.arbeitsbereich_beschreibung}</Text>
        ) : null}

        {data.taetigkeiten.map((t, ti) => (
          <View key={ti} wrap={false} style={{ marginBottom: 10 }}>
            <Text style={s.h3}>
              Tätigkeit {ti + 1}: {t.name}
            </Text>
            {t.beschreibung ? <Text style={s.meta}>{t.beschreibung}</Text> : null}
            <View style={s.tableHeader}>
              <Text style={[s.cell, s.cFaktor]}>Faktor</Text>
              <Text style={[s.cell, s.cBeschr]}>Gefährdung</Text>
              <Text style={[s.cell, s.cRisiko]}>Risiko (W×S)</Text>
              <Text style={[s.cell, s.cMassn]}>Maßnahmen (STOP)</Text>
            </View>
            {t.gefaehrdungen.map((g, gi) => {
              const r = bewerteRisiko(g.wahrscheinlichkeit, g.schadensschwere);
              return (
                <View key={gi} style={s.tableRow}>
                  <Text style={[s.cell, s.cFaktor]}>{FAKTOR_LABELS[g.faktor]}</Text>
                  <Text style={[s.cell, s.cBeschr, g.beschreibung.includes("[PRÜFEN") ? s.pruefen : {}]}>
                    {g.beschreibung}
                  </Text>
                  <Text style={[s.cell, s.cRisiko, RISIKO_STYLE[r.stufe]]}>
                    {r.masszahl} ({r.label})
                  </Text>
                  <Text style={[s.cell, s.cMassn]}>
                    {g.massnahmen.length === 0
                      ? "—"
                      : [...g.massnahmen]
                          .sort((a, b) => STOP_ORDER.indexOf(a.stop_kategorie) - STOP_ORDER.indexOf(b.stop_kategorie))
                          .map((m) => `[${STOP_LABELS[m.stop_kategorie].slice(0, 1)}] ${m.beschreibung}`)
                          .join("\n")}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
        <FooterWithPageNumbers customNote="Erstellt mit GefaehrdungsbeurteilungAI." />
      </Page>

      {/* Maßnahmenplan */}
      <Page size="A4" style={s.page}>
        {props.showWatermark && <Watermark text="ENTWURF" />}
        <Text style={s.h2}>Maßnahmenplan</Text>
        <View style={s.tableHeader}>
          <Text style={[s.cell, { width: "30%" }]}>Maßnahme</Text>
          <Text style={[s.cell, { width: "10%" }]}>STOP</Text>
          <Text style={[s.cell, { width: "26%" }]}>Gefährdung</Text>
          <Text style={[s.cell, { width: "8%" }]}>Risiko</Text>
          <Text style={[s.cell, { width: "14%" }]}>Verantwortlich</Text>
          <Text style={[s.cell, { width: "12%" }]}>Frist</Text>
        </View>
        {massnahmenPlan.map((row, i) => (
          <View key={i} style={s.planRow}>
            <Text style={[s.cell, { width: "30%" }]}>{row.massnahme.beschreibung}</Text>
            <Text style={[s.cell, { width: "10%" }]}>{STOP_LABELS[row.massnahme.stop_kategorie].slice(0, 1)}</Text>
            <Text style={[s.cell, { width: "26%" }]}>{row.gefaehrdung}</Text>
            <Text style={[s.cell, { width: "8%" }, RISIKO_STYLE[row.risiko.stufe]]}>{row.risiko.masszahl}</Text>
            <Text style={[s.cell, { width: "14%" }]}>{row.massnahme.verantwortlich || "—"}</Text>
            <Text style={[s.cell, { width: "12%" }]}>{row.massnahme.frist || "—"}</Text>
          </View>
        ))}
        {massnahmenPlan.length === 0 ? <Text style={s.meta}>Keine Maßnahmen erfasst.</Text> : null}

        {data.hinweise ? (
          <View style={{ marginTop: 14 }}>
            <Text style={s.h3}>Hinweise</Text>
            <Text>{data.hinweise}</Text>
          </View>
        ) : null}

        <SignatureLines
          left={{ label: "Arbeitgeber / Geschäftsführung", name: data.verantwortlich || undefined }}
          right={{ label: "Fachkraft für Arbeitssicherheit / Ersteller" }}
        />
        <FooterWithPageNumbers customNote="Erstellt mit GefaehrdungsbeurteilungAI. Inhaltliche Verantwortung trägt der Arbeitgeber / die unterzeichnende Fachkraft." />
      </Page>
    </Document>
  );
}
