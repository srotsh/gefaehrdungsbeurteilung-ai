"use client";

import { useEffect, useState } from "react";

/**
 * Reading-Progress-Bar — sticky am Top, zeigt Fortschritt im Article.
 * Cognac-Farbe auf Pergament-Hintergrund. Subtle, nicht aufdringlich.
 */

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const article = document.querySelector("article, main");
    if (!article) return;

    const onScroll = () => {
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = -rect.top;
      const pct = Math.max(0, Math.min(1, scrolled / total));
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-0.5 bg-transparent"
      aria-hidden
    >
      <div
        className="h-full bg-cognac-500 transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
