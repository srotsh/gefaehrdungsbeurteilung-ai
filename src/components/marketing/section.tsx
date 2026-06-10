/**
 * Container/Section-Wrapper für Marketing-Pages. Vier Tone-Varianten:
 *  - "default"   : neutraler Pergament-Hintergrund (Page-Default)
 *  - "surface"   : reines Weiß, für Karten-Sections
 *  - "deep"      : Petrol-Hintergrund für CTA-Heros / Trust-Sections
 *  - "warm"      : Pergament-200, sanft abgegrenzt (Banded Layout)
 */

type Tone = "default" | "surface" | "deep" | "warm";

const toneStyles: Record<Tone, string> = {
  default: "bg-parchment-100 text-ink",
  surface: "bg-white text-ink",
  deep: "bg-petrol-800 text-parchment-50",
  warm: "bg-parchment-200/60 text-ink",
};

export function Section({
  tone = "default",
  className = "",
  id,
  children,
}: {
  tone?: Tone;
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`${toneStyles[tone]} ${className}`}>
      {children}
    </section>
  );
}

export function Container({
  className = "",
  size = "default",
  children,
}: {
  className?: string;
  size?: "narrow" | "default" | "wide";
  children: React.ReactNode;
}) {
  const sizes = {
    narrow: "max-w-3xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
  };
  return (
    <div className={`mx-auto px-4 sm:px-6 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Section-Eyebrow: kleine, lesbare Über-Headline. Cognac-getönt,
 * verleiht Sections strukturelle Tiefe ohne Header-Inflation.
 */
export function Eyebrow({
  children,
  tone = "cognac",
}: {
  children: React.ReactNode;
  tone?: "cognac" | "petrol" | "muted";
}) {
  const colors = {
    cognac: "text-cognac-600",
    petrol: "text-petrol-600",
    muted: "text-ink-muted",
  };
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.18em] ${colors[tone]}`}
    >
      {children}
    </p>
  );
}

/**
 * SectionHeading: Eyebrow + große Headline + Sub-Text in einer Komponente.
 * Vereinheitlicht Section-Intros über alle Pages.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-2xl ${alignClass} ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className={`font-display text-display-md text-balance ${eyebrow ? "mt-3" : ""}`}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-muted text-pretty">
          {subtitle}
        </p>
      )}
    </div>
  );
}
