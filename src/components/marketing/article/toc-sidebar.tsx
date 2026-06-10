"use client";

import { useEffect, useState } from "react";

/**
 * Sticky Table-of-Contents-Sidebar.
 *
 * Auto-extrahiert h2-Elemente aus dem Article-Body via DOM-Query.
 * Active-State per IntersectionObserver (markiert die aktuell sichtbare Section).
 *
 * Wird im RatgeberLayout neben dem Article gerendert. Versteckt sich auf mobile.
 */

interface Heading {
  id: string;
  text: string;
  level: number;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function TocSidebar() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector("article, main");
    if (!article) return;

    const h2s = Array.from(article.querySelectorAll("h2"));
    const list: Heading[] = h2s.map((h) => {
      let id = h.id;
      if (!id) {
        id = slugify(h.textContent || "");
        h.id = id;
        // Add scroll-margin so anchor jumps don't hide under sticky header
        h.style.scrollMarginTop = "100px";
      }
      return { id, text: h.textContent || "", level: 2 };
    });
    setHeadings(list);

    if (list.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the first visible heading by document order
          visible.sort((a, b) =>
            (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop
          );
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-100px 0px -65% 0px",
        threshold: 0,
      }
    );

    h2s.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="Inhaltsverzeichnis"
      className="hidden xl:block"
    >
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-auto pr-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cognac-600">
          Inhalt
        </p>
        <ul className="mt-3 space-y-0.5 border-l border-parchment-200">
          {headings.map((h) => {
            const active = h.id === activeId;
            return (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm leading-snug transition-colors ${
                    active
                      ? "border-cognac-500 text-petrol-700 font-medium"
                      : "border-transparent text-ink-muted hover:border-parchment-300 hover:text-ink"
                  }`}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
