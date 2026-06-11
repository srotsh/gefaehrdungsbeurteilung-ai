"use client";

import { useState } from "react";

type Props = {
  /** Slug des Lead-Magnets, z. B. "weg-protokoll-checkliste" */
  asset: string;
  /** Schlagzeile über dem Formular */
  headline?: string;
  /** Bullet-Liste mit Nutzen */
  bullets?: string[];
  /** CTA-Button-Text */
  buttonLabel?: string;
};

/**
 * Inline-CTA in Blog-Artikeln. Sammelt E-Mail im Austausch
 * gegen ein PDF/HTML-Lead-Magnet-Asset.
 */
export function LeadMagnetCTA({
  asset,
  headline = "Gratis-Download: WEG-Protokoll-Checkliste",
  bullets = [
    "Alle 14 Pflichtangaben nach §24 WEG",
    "Rechtssichere Beschluss-Formulierungen zum Kopieren",
    "Vorlage für Versammlungsleitung & Protokollführer",
  ],
  buttonLabel = "Jetzt kostenlos herunterladen",
}: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, asset }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Anfrage fehlgeschlagen.");
      }
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unbekannter Fehler.");
    }
  }

  if (status === "ok") {
    return (
      <div className="my-10 rounded-xl border border-brand-200 bg-brand-50 p-6 text-sm">
        <p className="text-base font-semibold text-brand-700">
          Vielen Dank! 🎉
        </p>
        <p className="mt-2 text-slate-700">
          Wir haben Dir den Download an{" "}
          <span className="font-medium">{email}</span> geschickt. Schau auch im
          Spam-Ordner nach. Direkt-Link:{" "}
          <a
            href={`/lead-magnets/${asset}.html`}
            className="underline"
            target="_blank"
            rel="noopener"
          >
            Download öffnen
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <aside className="my-10 rounded-xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
        Lead-Magnet
      </p>
      <h3 className="mt-1 text-xl font-semibold text-slate-900">{headline}</h3>
      <ul className="mt-3 space-y-1 text-sm text-slate-700">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span aria-hidden className="text-brand-500">
              ✓
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <form onSubmit={onSubmit} className="mt-5 grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          required
          placeholder="Vorname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <input
          type="email"
          required
          placeholder="E-Mail-Adresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="sm:col-span-2 rounded-md bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
          {status === "loading" ? "Wird gesendet …" : buttonLabel}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-xs text-danger-700">Fehler: {error}</p>
      )}

      <p className="mt-3 text-[11px] text-slate-500">
        Mit dem Klick stimmst Du zu, dass wir Dir das Asset und maximal 2
        Folge-E-Mails mit verwandten Inhalten schicken. Abmeldung jederzeit per
        Klick. Details:{" "}
        <a href="/datenschutz" className="underline">
          Datenschutz
        </a>
        .
      </p>
    </aside>
  );
}
