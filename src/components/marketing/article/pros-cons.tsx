import { Check, X } from "lucide-react";

/**
 * Pros-Cons-Vergleich. Zwei Spalten — Petrol-getönt für Vorteile,
 * gedämpft-rot für Nachteile / Risiken.
 *
 * Beispiel:
 *   <ProsCons
 *     pros={['Schneller', 'Günstiger', 'Rechtssicher']}
 *     cons={['Erfordert Audio', 'Internet nötig']}
 *     prosLabel="Vorteile"
 *     consLabel="Risiken"
 *   />
 */

export function ProsCons({
  title,
  pros,
  cons,
  prosLabel = "Vorteile",
  consLabel = "Nachteile",
  className = "",
}: {
  /** Optionale Überschrift über beiden Spalten (Legacy-API). */
  title?: string;
  pros: string[];
  cons: string[];
  prosLabel?: string;
  consLabel?: string;
  className?: string;
}) {
  return (
    <div className={`my-8 ${className}`}>
      {title && (
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
          {title}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Column items={pros} label={prosLabel} variant="pro" />
        <Column items={cons} label={consLabel} variant="con" />
      </div>
    </div>
  );
}

function Column({
  items,
  label,
  variant,
}: {
  items: string[];
  label: string;
  variant: "pro" | "con";
}) {
  const styles =
    variant === "pro"
      ? {
          bg: "bg-petrol-50/60",
          border: "border-petrol-200",
          ring: "ring-petrol-200",
          icon: "text-petrol-700",
          label: "text-petrol-700",
        }
      : {
          bg: "bg-danger-50",
          border: "border-danger-500/20",
          ring: "ring-danger-500/15",
          icon: "text-danger-700",
          label: "text-danger-700",
        };

  const Icon = variant === "pro" ? Check : X;

  return (
    <div className={`rounded-xl border ${styles.border} ${styles.bg} p-5`}>
      <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${styles.label}`}>
        {label}
      </p>
      <ul className="mt-3 space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[0.95rem] leading-relaxed text-ink">
            <span className={`mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white ring-1 ${styles.ring} ${styles.icon}`} aria-hidden>
              <Icon className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className="text-pretty">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
