/**
 * Stat-Grid — visualisiert Schlüsselzahlen prominent. 2-4 Karten,
 * je mit großem Zahlenwert + Label + optionaler Quelle.
 *
 * Beispiel:
 *   <StatGrid stats={[
 *     { value: '1 Monat', label: 'Anfechtungsfrist', source: '§ 44 (1) WEG' },
 *     { value: '3/4', label: 'Qualifizierte Mehrheit', source: '§ 22 (1) WEG' },
 *   ]} />
 */

export function StatGrid({
  stats,
  className = "",
}: {
  stats: Array<{ value: string; label: string; source?: string }>;
  className?: string;
}) {
  const cols = stats.length === 2 ? "sm:grid-cols-2" : stats.length === 4 ? "sm:grid-cols-2 md:grid-cols-4" : "sm:grid-cols-3";

  return (
    <div className={`my-8 grid gap-px overflow-hidden rounded-xl border border-parchment-200 bg-parchment-200 ${cols} ${className}`}>
      {stats.map((s) => (
        <div key={s.label} className="bg-white p-5 text-center sm:p-6">
          <p className="font-display text-[1.6rem] font-semibold leading-tight tracking-tight text-petrol-700 sm:text-3xl">
            {s.value}
          </p>
          <p className="mt-1.5 text-sm leading-snug text-ink">
            {s.label}
          </p>
          {s.source && (
            <p className="mt-2 text-[10px] font-mono text-ink-subtle">
              {s.source}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
