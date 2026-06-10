"use client";

import { useState, useTransition } from "react";
import { STOP_LABELS, type StopKategorie } from "@/lib/validations";
import { setMassnahmeStatusAction } from "@/app/(dashboard)/massnahmen/actions";
import type { MassnahmeRow, MassnahmeStatus } from "@/types";

const STATUS_LABELS: Record<MassnahmeStatus, string> = {
  offen: "Offen",
  in_umsetzung: "In Umsetzung",
  erledigt: "Erledigt",
  wirksamkeit_geprueft: "Wirksamkeit geprüft",
};

const STUFE_STYLES: Record<number, string> = {
  1: "bg-emerald-100 text-emerald-900",
  2: "bg-amber-100 text-amber-900",
  3: "bg-red-100 text-red-900",
};

export function MassnahmenTable({ rows }: { rows: MassnahmeRow[] }) {
  const [filter, setFilter] = useState<MassnahmeStatus | "alle">("alle");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const heute = new Date().toISOString().slice(0, 10);
  const visible = rows.filter((r) => filter === "alle" || r.status === filter);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 text-sm">
        {(["alle", "offen", "in_umsetzung", "erledigt", "wirksamkeit_geprueft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md border px-3 py-1 text-xs ${filter === f ? "border-primary bg-primary/10 font-medium" : "text-muted-foreground"}`}
          >
            {f === "alle" ? "Alle" : STATUS_LABELS[f]} (
            {f === "alle" ? rows.length : rows.filter((r) => r.status === f).length})
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Risiko</th>
              <th className="px-3 py-2">Maßnahme</th>
              <th className="px-3 py-2">STOP</th>
              <th className="px-3 py-2">Gefährdung / Tätigkeit</th>
              <th className="px-3 py-2">Verantwortlich</th>
              <th className="px-3 py-2">Frist</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((m) => {
              const ueberfaellig =
                m.frist && m.frist < heute && (m.status === "offen" || m.status === "in_umsetzung");
              return (
                <tr key={m.id} className={`border-t ${ueberfaellig ? "bg-red-50" : ""}`}>
                  <td className="px-3 py-2">
                    <span className={`rounded px-2 py-0.5 text-xs ${STUFE_STYLES[m.risikostufe]}`}>
                      {m.risikostufe}
                    </span>
                  </td>
                  <td className="px-3 py-2">{m.beschreibung}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {STOP_LABELS[m.stop_kategorie as StopKategorie] ?? m.stop_kategorie}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {m.gefaehrdung}
                    <br />
                    <span className="italic">{m.taetigkeit}</span>
                  </td>
                  <td className="px-3 py-2">{m.verantwortlich ?? "—"}</td>
                  <td className={`px-3 py-2 ${ueberfaellig ? "font-semibold text-red-700" : ""}`}>
                    {m.frist ?? "—"}
                    {ueberfaellig ? " ⚠" : ""}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={m.status}
                      disabled={pending}
                      onChange={(e) => {
                        const status = e.target.value as MassnahmeStatus;
                        startTransition(async () => {
                          setError(null);
                          const res = await setMassnahmeStatusAction({ id: m.id, status });
                          if (res.error) setError(res.error);
                        });
                      }}
                      className="rounded-md border px-2 py-1 text-xs"
                    >
                      {(Object.keys(STATUS_LABELS) as MassnahmeStatus[]).map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
