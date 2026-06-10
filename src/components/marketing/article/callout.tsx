import { Info, AlertTriangle, Lightbulb, BookOpen, FileText } from "lucide-react";

/**
 * Callout-Box für Inline-Hervorhebungen in Ratgeber-Artikeln.
 *
 * Fünf Tonalitäten — alle in der neuen Petrol/Cognac-Palette:
 *  - info     : neutrale Hinweise, "Gut zu wissen"
 *  - tip      : Praxis-Tipp, "Empfehlung"
 *  - warning  : Achtung, "Riskant" — gedämpftes Aktenrot
 *  - example  : Beispiel-Kasten, neutrales Pergament
 *  - legal    : Wortlaut-Zitat aus dem WEG (mono-typ for paragraph numbers)
 */

type Variant = "info" | "tip" | "warning" | "example" | "legal";

const variantConfig: Record<
  Variant,
  { Icon: typeof Info; label: string; bg: string; border: string; iconBg: string; iconColor: string; titleColor: string }
> = {
  info: {
    Icon: Info,
    label: "Hinweis",
    bg: "bg-petrol-50/60",
    border: "border-petrol-200",
    iconBg: "bg-petrol-100",
    iconColor: "text-petrol-700",
    titleColor: "text-petrol-700",
  },
  tip: {
    Icon: Lightbulb,
    label: "Praxis-Tipp",
    bg: "bg-cognac-50/60",
    border: "border-cognac-200",
    iconBg: "bg-cognac-100",
    iconColor: "text-cognac-700",
    titleColor: "text-cognac-700",
  },
  warning: {
    Icon: AlertTriangle,
    label: "Achtung",
    bg: "bg-danger-50",
    border: "border-danger-500/25",
    iconBg: "bg-danger-50",
    iconColor: "text-danger-700",
    titleColor: "text-danger-700",
  },
  example: {
    Icon: FileText,
    label: "Beispiel",
    bg: "bg-parchment-50",
    border: "border-parchment-300",
    iconBg: "bg-parchment-200",
    iconColor: "text-ink-muted",
    titleColor: "text-ink",
  },
  legal: {
    Icon: BookOpen,
    label: "Gesetzeswortlaut",
    bg: "bg-petrol-700",
    border: "border-petrol-700",
    iconBg: "bg-petrol-600",
    iconColor: "text-cognac-300",
    titleColor: "text-cognac-300",
  },
};

export function Callout({
  variant = "info",
  title,
  children,
  className = "",
}: {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const c = variantConfig[variant];
  const isLegal = variant === "legal";

  return (
    <aside
      className={`my-7 rounded-xl border ${c.border} ${c.bg} p-5 sm:p-6 ${className}`}
      role="note"
    >
      <div className="flex items-start gap-3.5">
        <span
          className={`mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${c.iconBg} ${c.iconColor}`}
          aria-hidden
        >
          <c.Icon className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${c.titleColor}`}
          >
            {title || c.label}
          </p>
          <div
            className={`mt-2 text-[0.95rem] leading-relaxed ${
              isLegal
                ? "text-parchment-100 font-mono [&_strong]:text-parchment-50 [&_strong]:font-semibold"
                : "text-ink [&_strong]:text-ink"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}
