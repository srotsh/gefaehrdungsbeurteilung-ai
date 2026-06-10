/* AUTO-GENERATED · domain-mockup für /-Page */
import { CheckCircle2, AlertTriangle, ListChecks } from "lucide-react";

export function ProductMockup({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-parchment-300/60 bg-white shadow-card ${className}`}
      role="img"
      aria-label="Vorschau GefaehrdungsbeurteilungAI: Gefaehrdungs-Editor mit Risikomatrix und STOP-Massnahmen"
    >
      <div className="flex items-center justify-between border-b border-parchment-200 bg-parchment-50 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-parchment-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-parchment-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-parchment-300" />
        </div>
        <div className="font-mono text-[11px] text-ink-subtle">
          app.gefaehrdungsbeurteilung-ai.de/gbu/werkstatt-eg
        </div>
        <div className="w-12" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr]">
        <aside className="border-b border-parchment-200 bg-parchment-50/60 p-4 sm:border-b-0 sm:border-r">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
            Werkstatt EG · Rev. 2
          </p>
          <ul className="space-y-1.5 text-sm">
            {[
              { t: "Sägen an der Kreissäge", risiko: "hoch", active: true },
              { t: "Schleifen / Absaugung", risiko: "mittel" },
              { t: "Lager Gefahrstoffe", risiko: "mittel" },
              { t: "Plattenzuschnitt / Heben", risiko: "mittel" },
              { t: "Büro / Auftragsplanung", risiko: "gering" },
            ].map((item) => (
              <li
                key={item.t}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                  item.active
                    ? "bg-petrol-100/70 text-petrol-700 ring-1 ring-petrol-200/80"
                    : "text-ink-muted"
                }`}
              >
                <span
                  className={`h-2 w-2 flex-shrink-0 rounded-full ${
                    item.risiko === "hoch"
                      ? "bg-red-500"
                      : item.risiko === "mittel"
                        ? "bg-amber-400"
                        : "bg-success-500"
                  }`}
                  aria-hidden
                />
                <span className="leading-snug">{item.t}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cognac-600">
              Mechanische Gefährdung · §5 ArbSchG
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
              <AlertTriangle className="h-2.5 w-2.5" aria-hidden /> Risiko 16 — Hoch
            </span>
          </div>

          <h3 className="mt-1.5 font-display text-[1.05rem] font-semibold text-ink leading-snug">
            Kreissäge ohne Spaltkeil — Rückschlaggefahr
          </h3>

          <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
            Spaltkeil demontiert, Schutzhaube fixiert. Wahrscheinlichkeit{" "}
            <span className="font-medium text-ink">4 (hoch)</span> × Schadensschwere{" "}
            <span className="font-medium text-ink">4 (Dauerschaden möglich)</span> — sofortiger
            Handlungsbedarf nach Risikomatrix (Nohl).
          </p>

          <div className="mt-4 rounded-lg border-l-2 border-petrol-600 bg-petrol-50/60 p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-petrol-700">
              Maßnahmen (STOP)
            </p>
            <ul className="mt-1.5 space-y-1.5 text-[13px] leading-relaxed text-ink">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 rounded bg-petrol-600 px-1 text-[10px] font-bold text-white">T</span>
                Spaltkeil montieren, Schutzhaube gangbar machen — <em>Frist: sofort</em>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 rounded bg-petrol-400 px-1 text-[10px] font-bold text-white">O</span>
                Unterweisung Kreissäge wiederholen, Freigabe nur unterwiesene Mitarbeiter
              </li>
            </ul>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px]">
              <span className="text-ink-muted">Verantwortlich <span className="font-semibold text-ink">M. Muster</span></span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 font-medium text-success-700">
                <CheckCircle2 className="h-2.5 w-2.5" aria-hidden /> Psych. Belastung betrachtet
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px]">
            <span className="inline-flex items-center gap-1.5 text-ink-subtle">
              <ListChecks className="h-3 w-3" aria-hidden /> 12 Gefährdungen · 17 Maßnahmen im Tracking
            </span>
            <span className="text-cognac-600 font-medium">PDF-Export →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
