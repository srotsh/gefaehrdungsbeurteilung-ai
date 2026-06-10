/**
 * Definition-Box — kurze Begriffserklärung mit Cognac-Akzent.
 * Ideal für juristische Fachbegriffe inline im Text.
 *
 * Beispiel:
 *   <DefinitionBox term="MEA" expansion="Miteigentumsanteile">
 *     Bezeichnen den rechnerischen Anteil eines Eigentümers am gemeinschaftlichen
 *     Eigentum. Sie bestimmen das Stimmgewicht in der Versammlung.
 *   </DefinitionBox>
 */

export function DefinitionBox({
  term,
  expansion,
  children,
  className = "",
}: {
  term: string;
  expansion?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={`my-6 grid gap-3 rounded-xl border-l-4 border-cognac-500 bg-parchment-50/60 px-5 py-4 sm:grid-cols-[160px_1fr] sm:gap-6 ${className}`}
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cognac-700">
          Begriff
        </p>
        <p className="mt-1 font-display text-lg font-semibold text-petrol-700">
          {term}
        </p>
        {expansion && (
          <p className="mt-0.5 text-xs text-ink-muted leading-snug">
            {expansion}
          </p>
        )}
      </div>
      <div className="text-[0.95rem] leading-relaxed text-ink text-pretty">
        {children}
      </div>
    </aside>
  );
}
