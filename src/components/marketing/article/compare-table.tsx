/**
 * Vergleichstabelle — z.B. "Vor Reform 2020 vs Nach Reform 2020".
 *
 * Zwei APIs (beide unterstützt):
 *  Modern:  <CompareTable header={['Vor 2020','Seit 2020']}
 *             rows={[{ label: 'Quorum', cells: ['50% MEA', 'keins'] }]} />
 *  Legacy:  <CompareTable headers={['Frist','Bewertung']}
 *             rows={[['3 Monate','ideal'], ['6 Monate','üblich']]} />
 */

type ModernRow = { label: string; cells: React.ReactNode[] };
type LegacyRow = React.ReactNode[];

function isModernRow(row: ModernRow | LegacyRow): row is ModernRow {
  return !Array.isArray(row);
}

export function CompareTable({
  header,
  headers,
  rows,
  caption,
  className = "",
}: {
  /** Modern: 2 Spaltentitel; erste Spalte heißt "Aspekt". */
  header?: [string, string];
  /** Legacy: alle Spaltentitel explizit. */
  headers?: string[];
  rows: Array<ModernRow | LegacyRow>;
  caption?: string;
  className?: string;
}) {
  // Auf eine gemeinsame Form normalisieren: columns + cells[][]
  const columns: React.ReactNode[] = headers ?? ["Aspekt", ...(header ?? [])];
  const body: React.ReactNode[][] = rows.map((row) =>
    isModernRow(row) ? [row.label, ...row.cells] : row
  );

  return (
    <div className={`my-8 overflow-hidden rounded-xl border border-parchment-200 ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-parchment-50/80">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`p-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] ${
                  i === columns.length - 1 && columns.length > 1
                    ? "bg-petrol-50/60 text-cognac-700"
                    : "text-ink-muted"
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-parchment-200">
          {body.map((cells, i) => (
            <tr key={i} className="bg-white">
              {cells.map((cell, j) => (
                <td
                  key={j}
                  className={`p-4 align-top ${
                    j === 0
                      ? "font-medium text-ink"
                      : j === cells.length - 1
                        ? "bg-petrol-50/40 text-ink"
                        : "text-ink-muted"
                  }`}
                >
                  {cell}
                </td>
              ))}
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
