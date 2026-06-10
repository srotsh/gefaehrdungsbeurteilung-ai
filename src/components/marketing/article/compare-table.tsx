/**
 * Vergleichstabelle — z.B. "Vor Reform 2020 vs Nach Reform 2020".
 * Auf mobile als gestapelte Karten, auf desktop als Tabelle.
 *
 * Beispiel:
 *   <CompareTable
 *     header={['Vor 2020', 'Seit 2020']}
 *     rows={[
 *       { label: 'Beschlussfähigkeit', cells: ['50% MEA', 'Keine Mindest-Quote'] }
 *     ]}
 *   />
 */

export function CompareTable({
  header,
  rows,
  caption,
  className = "",
}: {
  header: [string, string];
  rows: Array<{ label: string; cells: [React.ReactNode, React.ReactNode] }>;
  caption?: string;
  className?: string;
}) {
  return (
    <div className={`my-8 overflow-hidden rounded-xl border border-parchment-200 ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-parchment-50/80">
            <th className="p-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Aspekt
            </th>
            <th className="p-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              {header[0]}
            </th>
            <th className="bg-petrol-50/60 p-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-cognac-700">
              {header[1]}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-parchment-200">
          {rows.map((row, i) => (
            <tr key={i} className="bg-white">
              <td className="p-4 align-top font-medium text-ink">{row.label}</td>
              <td className="p-4 align-top text-ink-muted">{row.cells[0]}</td>
              <td className="bg-petrol-50/40 p-4 align-top text-ink">{row.cells[1]}</td>
            </tr>
          ))}
        </tbody>
        {caption && (
          <caption className="caption-bottom border-t border-parchment-200 bg-parchment-50/60 px-4 py-2.5 text-left text-xs italic text-ink-subtle">
            {caption}
          </caption>
        )}
      </table>
    </div>
  );
}
