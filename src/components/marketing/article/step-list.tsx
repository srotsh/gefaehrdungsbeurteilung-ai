/**
 * Vertikale Step-Liste mit nummerierten Karten und verbindender Linie.
 * Visuell deutlich stärker als <ol>-Default; hält Leser im Scroll.
 *
 * Beispiel:
 *   <StepList steps={[
 *     { title: 'Audio aufnehmen', body: 'Smartphone genügt...' },
 *     { title: 'Hochladen', body: 'Drag & Drop ins Dashboard' },
 *   ]} />
 */

export function StepList({
  steps,
  className = "",
}: {
  steps: Array<{ title: string; body: React.ReactNode; meta?: string }>;
  className?: string;
}) {
  return (
    <ol className={`relative my-10 space-y-6 ${className}`}>
      {/* Connecting line */}
      <span
        className="absolute left-[19px] top-2 bottom-2 w-px bg-parchment-300"
        aria-hidden
      />
      {steps.map((step, i) => (
        <li key={i} className="relative pl-14">
          <span
            className="absolute left-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-petrol-700 font-display text-sm font-semibold text-parchment-50 ring-4 ring-parchment-100"
            aria-hidden
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="rounded-lg border border-parchment-200 bg-white p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-[1.05rem] font-semibold text-ink leading-snug">
                {step.title}
              </h3>
              {step.meta && (
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink-subtle">
                  {step.meta}
                </span>
              )}
            </div>
            <div className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">
              {step.body}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
