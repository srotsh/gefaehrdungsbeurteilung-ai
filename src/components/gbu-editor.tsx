"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FAKTOR_LABELS,
  STOP_LABELS,
  STOP_ORDER,
  GefaehrdungsfaktorSchema,
  type GbuData,
  type Gefaehrdung,
  type Taetigkeit,
} from "@/lib/validations";
import {
  bewerteRisiko,
  summarizeRisiko,
  WAHRSCHEINLICHKEIT_LABELS,
  SCHADENSSCHWERE_LABELS,
} from "@/lib/risiko/nohl";
import {
  saveGbuAction,
  finalizeGbuAction,
  startRevisionAction,
} from "@/app/(dashboard)/gbu/[id]/actions";

const STUFE_STYLES: Record<number, string> = {
  1: "bg-emerald-100 text-emerald-900",
  2: "bg-amber-100 text-amber-900",
  3: "bg-red-100 text-red-900",
};

const EMPTY_GEFAEHRDUNG: Gefaehrdung = {
  faktor: "mechanisch",
  beschreibung: "",
  wahrscheinlichkeit: 2,
  schadensschwere: 2,
  massnahmen: [],
};

export function GbuEditor({
  gbuId,
  initialData,
  finalized,
}: {
  gbuId: string;
  initialData: GbuData;
  finalized: boolean;
}) {
  const router = useRouter();
  const [data, setData] = useState<GbuData>(initialData);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const readonly = finalized;

  const summary = summarizeRisiko(data);

  function update(mutator: (draft: GbuData) => void) {
    setData((prev) => {
      const draft: GbuData = JSON.parse(JSON.stringify(prev));
      mutator(draft);
      return draft;
    });
  }

  return (
    <div className="space-y-6">
      {/* Risiko-Summary */}
      <div className="flex flex-wrap items-center gap-3 rounded-md border bg-card p-4 text-sm">
        <span className="font-semibold">Risikoübersicht:</span>
        <span className={`rounded px-2 py-0.5 ${STUFE_STYLES[3]}`}>Hoch: {summary.stufe3}</span>
        <span className={`rounded px-2 py-0.5 ${STUFE_STYLES[2]}`}>Mittel: {summary.stufe2}</span>
        <span className={`rounded px-2 py-0.5 ${STUFE_STYLES[1]}`}>Gering: {summary.stufe1}</span>
        <span className="text-muted-foreground">
          {summary.gefaehrdungenGesamt} Gefährdungen · {summary.massnahmenGesamt} Maßnahmen
        </span>
        <label className="ml-auto flex items-center gap-2">
          <input
            type="checkbox"
            disabled={readonly}
            checked={data.psychische_belastung_betrachtet}
            onChange={(e) => update((d) => { d.psychische_belastung_betrachtet = e.target.checked; })}
          />
          <span className={data.psychische_belastung_betrachtet ? "" : "font-medium text-red-600"}>
            Psychische Belastung betrachtet (Pflicht)
          </span>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Verantwortlich (Arbeitgeber / SiFa)</label>
          <input
            value={data.verantwortlich ?? ""}
            disabled={readonly}
            onChange={(e) => update((d) => { d.verantwortlich = e.target.value; })}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Name, Funktion"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Beschreibung des Arbeitsbereichs</label>
          <input
            value={data.arbeitsbereich_beschreibung ?? ""}
            disabled={readonly}
            onChange={(e) => update((d) => { d.arbeitsbereich_beschreibung = e.target.value; })}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Tätigkeiten */}
      {data.taetigkeiten.map((t, ti) => (
        <TaetigkeitCard
          key={ti}
          taetigkeit={t}
          readonly={readonly}
          onChange={(next) => update((d) => { d.taetigkeiten[ti] = next; })}
          onRemove={() => update((d) => { d.taetigkeiten.splice(ti, 1); })}
        />
      ))}

      {!readonly && (
        <button
          type="button"
          onClick={() =>
            update((d) => {
              d.taetigkeiten.push({ name: "Neue Tätigkeit", beschreibung: "", gefaehrdungen: [] });
            })
          }
          className="rounded-md border border-dashed px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
        >
          + Tätigkeit hinzufügen
        </button>
      )}

      {data.hinweise ? (
        <div className="rounded-md border bg-muted/30 p-4 text-sm">
          <span className="font-medium">Hinweise der AI: </span>
          {data.hinweise}
        </div>
      ) : null}

      {message && <p className="text-sm">{message}</p>}

      <div className="flex gap-3 border-t pt-4">
        {!readonly && (
          <>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  setMessage(null);
                  const res = await saveGbuAction({ gbuId, data });
                  setMessage(res.error ? `Fehler: ${res.error}` : "Gespeichert.");
                })
              }
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              Speichern
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  setMessage(null);
                  const saved = await saveGbuAction({ gbuId, data });
                  if (saved.error) {
                    setMessage(`Fehler: ${saved.error}`);
                    return;
                  }
                  const res = await finalizeGbuAction(gbuId);
                  if (res.error) setMessage(`Fehler: ${res.error}`);
                  else {
                    setMessage(`Finalisiert — ${res.massnahmenCreated} Maßnahmen ins Tracking übernommen.`);
                    router.refresh();
                  }
                })
              }
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Finalisieren
            </button>
          </>
        )}
        {readonly && (
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await startRevisionAction(gbuId);
                if (res.error) setMessage(`Fehler: ${res.error}`);
                else router.push(`/gbu/${res.id}`);
              })
            }
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Neue Revision starten
          </button>
        )}
      </div>
    </div>
  );
}

function TaetigkeitCard({
  taetigkeit,
  readonly,
  onChange,
  onRemove,
}: {
  taetigkeit: Taetigkeit;
  readonly: boolean;
  onChange: (t: Taetigkeit) => void;
  onRemove: () => void;
}) {
  return (
    <section className="space-y-4 rounded-lg border bg-card p-5">
      <div className="flex items-center gap-3">
        <input
          value={taetigkeit.name}
          disabled={readonly}
          onChange={(e) => onChange({ ...taetigkeit, name: e.target.value })}
          className="flex-1 rounded-md border px-3 py-2 text-sm font-semibold"
        />
        {!readonly && (
          <button type="button" onClick={onRemove} className="text-xs text-red-600 hover:underline">
            Entfernen
          </button>
        )}
      </div>

      {taetigkeit.gefaehrdungen.map((g, gi) => (
        <GefaehrdungRow
          key={gi}
          gefaehrdung={g}
          readonly={readonly}
          onChange={(next) => {
            const list = [...taetigkeit.gefaehrdungen];
            list[gi] = next;
            onChange({ ...taetigkeit, gefaehrdungen: list });
          }}
          onRemove={() => {
            const list = taetigkeit.gefaehrdungen.filter((_, i) => i !== gi);
            onChange({ ...taetigkeit, gefaehrdungen: list });
          }}
        />
      ))}

      {!readonly && (
        <button
          type="button"
          onClick={() =>
            onChange({
              ...taetigkeit,
              gefaehrdungen: [...taetigkeit.gefaehrdungen, { ...EMPTY_GEFAEHRDUNG, massnahmen: [] }],
            })
          }
          className="rounded-md border border-dashed px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
        >
          + Gefährdung
        </button>
      )}
    </section>
  );
}

function GefaehrdungRow({
  gefaehrdung,
  readonly,
  onChange,
  onRemove,
}: {
  gefaehrdung: Gefaehrdung;
  readonly: boolean;
  onChange: (g: Gefaehrdung) => void;
  onRemove: () => void;
}) {
  const risiko = bewerteRisiko(gefaehrdung.wahrscheinlichkeit, gefaehrdung.schadensschwere);
  const hatPruefen = gefaehrdung.beschreibung.includes("[PRÜFEN");
  const sortierteMassnahmen = [...gefaehrdung.massnahmen].sort(
    (a, b) => STOP_ORDER.indexOf(a.stop_kategorie) - STOP_ORDER.indexOf(b.stop_kategorie)
  );

  return (
    <div className={`space-y-3 rounded-md border p-4 ${hatPruefen ? "border-red-300 bg-red-50/50" : ""}`}>
      <div className="flex items-start gap-3">
        <select
          value={gefaehrdung.faktor}
          disabled={readonly}
          onChange={(e) => onChange({ ...gefaehrdung, faktor: e.target.value as Gefaehrdung["faktor"] })}
          className="rounded-md border px-2 py-1.5 text-xs"
        >
          {GefaehrdungsfaktorSchema.options.map((f) => (
            <option key={f} value={f}>{FAKTOR_LABELS[f]}</option>
          ))}
        </select>
        <span
          className={`ml-auto whitespace-nowrap rounded px-2 py-1 text-xs font-medium ${STUFE_STYLES[risiko.stufe]}`}
          title={risiko.handlungsbedarf}
        >
          Risiko {risiko.masszahl} — {risiko.label}
        </span>
        {!readonly && (
          <button type="button" onClick={onRemove} className="text-xs text-red-600 hover:underline">
            ✕
          </button>
        )}
      </div>

      <textarea
        value={gefaehrdung.beschreibung}
        disabled={readonly}
        onChange={(e) => onChange({ ...gefaehrdung, beschreibung: e.target.value })}
        rows={2}
        className="w-full rounded-md border px-3 py-2 text-sm"
        placeholder="Beschreibung der Gefährdung"
      />

      <div className="grid grid-cols-2 gap-4 text-xs">
        <label className="space-y-1">
          <span className="font-medium">
            Wahrscheinlichkeit: {gefaehrdung.wahrscheinlichkeit} ({WAHRSCHEINLICHKEIT_LABELS[gefaehrdung.wahrscheinlichkeit]})
          </span>
          <input
            type="range"
            min={1}
            max={5}
            disabled={readonly}
            value={gefaehrdung.wahrscheinlichkeit}
            onChange={(e) => onChange({ ...gefaehrdung, wahrscheinlichkeit: Number(e.target.value) })}
            className="w-full"
          />
        </label>
        <label className="space-y-1">
          <span className="font-medium">
            Schadensschwere: {gefaehrdung.schadensschwere} ({SCHADENSSCHWERE_LABELS[gefaehrdung.schadensschwere]})
          </span>
          <input
            type="range"
            min={1}
            max={5}
            disabled={readonly}
            value={gefaehrdung.schadensschwere}
            onChange={(e) => onChange({ ...gefaehrdung, schadensschwere: Number(e.target.value) })}
            className="w-full"
          />
        </label>
      </div>

      {/* Maßnahmen (STOP-sortiert) */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Maßnahmen (STOP-Reihenfolge)</p>
        {sortierteMassnahmen.map((m) => {
          const mi = gefaehrdung.massnahmen.indexOf(m);
          return (
            <div key={mi} className="flex flex-wrap items-center gap-2">
              <select
                value={m.stop_kategorie}
                disabled={readonly}
                onChange={(e) => {
                  const list = [...gefaehrdung.massnahmen];
                  list[mi] = { ...m, stop_kategorie: e.target.value as typeof m.stop_kategorie };
                  onChange({ ...gefaehrdung, massnahmen: list });
                }}
                className="rounded-md border px-2 py-1 text-xs"
              >
                {STOP_ORDER.map((k) => (
                  <option key={k} value={k}>{STOP_LABELS[k]}</option>
                ))}
              </select>
              <input
                value={m.beschreibung}
                disabled={readonly}
                onChange={(e) => {
                  const list = [...gefaehrdung.massnahmen];
                  list[mi] = { ...m, beschreibung: e.target.value };
                  onChange({ ...gefaehrdung, massnahmen: list });
                }}
                className="min-w-[200px] flex-1 rounded-md border px-2 py-1 text-xs"
                placeholder="Maßnahme"
              />
              <input
                value={m.verantwortlich ?? ""}
                disabled={readonly}
                onChange={(e) => {
                  const list = [...gefaehrdung.massnahmen];
                  list[mi] = { ...m, verantwortlich: e.target.value };
                  onChange({ ...gefaehrdung, massnahmen: list });
                }}
                className="w-36 rounded-md border px-2 py-1 text-xs"
                placeholder="Verantwortlich"
              />
              <input
                type="date"
                value={m.frist ?? ""}
                disabled={readonly}
                onChange={(e) => {
                  const list = [...gefaehrdung.massnahmen];
                  list[mi] = { ...m, frist: e.target.value };
                  onChange({ ...gefaehrdung, massnahmen: list });
                }}
                className="rounded-md border px-2 py-1 text-xs"
              />
              {!readonly && (
                <button
                  type="button"
                  onClick={() => {
                    const list = gefaehrdung.massnahmen.filter((_, i) => i !== mi);
                    onChange({ ...gefaehrdung, massnahmen: list });
                  }}
                  className="text-xs text-red-600 hover:underline"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
        {!readonly && (
          <button
            type="button"
            onClick={() =>
              onChange({
                ...gefaehrdung,
                massnahmen: [
                  ...gefaehrdung.massnahmen,
                  { beschreibung: "", stop_kategorie: "technisch", verantwortlich: "", frist: "" },
                ],
              })
            }
            className="rounded-md border border-dashed px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
          >
            + Maßnahme
          </button>
        )}
      </div>
    </div>
  );
}
