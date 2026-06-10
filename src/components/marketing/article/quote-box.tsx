import { Quote } from "lucide-react";

/**
 * Pull-Quote / Expertenzitat. Cognac-Akzent als Anführungszeichen.
 *
 * Beispiel:
 *   <QuoteBox author="Markus K." role="Inhaber Verwaltung Müller-Kühne">
 *     Vorher 4 Stunden, jetzt 10 Minuten — ich kann die Versammlung jetzt
 *     direkt nach Ende abschließen.
 *   </QuoteBox>
 */

export function QuoteBox({
  children,
  author,
  role,
  source,
  className = "",
}: {
  children: React.ReactNode;
  author?: string;
  role?: string;
  source?: string;
  className?: string;
}) {
  return (
    <figure
      className={`relative my-10 rounded-xl bg-petrol-700 p-7 sm:p-9 ${className}`}
    >
      <Quote
        className="absolute left-7 top-7 h-7 w-7 text-cognac-400"
        aria-hidden
      />
      <blockquote className="mt-4 pl-9">
        <p className="font-display text-[1.15rem] leading-relaxed text-parchment-50 text-pretty sm:text-[1.25rem]">
          {children}
        </p>
        {(author || source) && (
          <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
            {author && (
              <span className="font-semibold text-parchment-50">{author}</span>
            )}
            {role && <span className="text-parchment-100/75">{role}</span>}
            {source && (
              <span className="ml-auto font-mono text-xs text-cognac-300">
                {source}
              </span>
            )}
          </figcaption>
        )}
      </blockquote>
    </figure>
  );
}
