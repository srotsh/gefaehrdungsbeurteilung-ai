import { createServerClient } from "@flow/db";
import { getApiIdentity } from "@flow/core";

export const runtime = "nodejs";

const QUOTE = String.fromCharCode(34);
const BOM = String.fromCharCode(0xfeff);

function csvCell(value: unknown): string {
  const s = String(value ?? "");
  const escaped = s.split(QUOTE).join(QUOTE + QUOTE);
  return QUOTE + escaped + QUOTE;
}

/** Maßnahmenplan als CSV (Excel-kompatibel, Semikolon-getrennt, BOM für Umlaute). */
export async function GET() {
  const identity = await getApiIdentity();
  if (!identity) return new Response("Nicht angemeldet.", { status: 401 });

  const supabase = createServerClient();
  const { data } = await supabase
    .from("massnahmen")
    .select("*, arbeitsbereiche(name)")
    .order("frist", { ascending: true, nullsFirst: false });

  const rows = (data ?? []) as Array<
    Record<string, unknown> & { arbeitsbereiche: { name: string } | null }
  >;

  const header = [
    "Arbeitsbereich", "Tätigkeit", "Gefährdung", "Faktor", "Risikostufe",
    "Maßnahme", "STOP-Kategorie", "Verantwortlich", "Frist", "Status", "Wirksamkeit geprüft am",
  ];
  const lines = rows.map((m) =>
    [
      m.arbeitsbereiche?.name ?? "",
      m.taetigkeit, m.gefaehrdung, m.faktor, m.risikostufe,
      m.beschreibung, m.stop_kategorie, m.verantwortlich ?? "",
      m.frist ?? "", m.status, m.wirksamkeit_geprueft_am ?? "",
    ]
      .map(csvCell)
      .join(";")
  );

  const csv = BOM + [header.join(";"), ...lines].join("\r\n");
  const today = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=" + csvCell("massnahmenplan-" + today + ".csv"),
    },
  });
}
