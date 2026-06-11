/* AUTO-GENERATED via shared-core/scripts/gen-lead-magnet.py */
"use client";
import { useState } from "react";
import { track } from "@/components/analytics/plausible";

type Props = {
  asset?: string;
  headline?: string;
  bullets?: string[];
  buttonLabel?: string;
};

// Produkt-Defaults (aus MAGNET_CONFIG generiert) — erlauben <LeadMagnetCTA />
// ohne Props, z. B. automatisch am Artikelende.
export function LeadMagnetCTA({
  asset = "gbu-pflicht-check",
  headline = "Gratis-Download: GBU-Pflicht-Check",
  bullets = ["Selbst-Check: Bin ich GBU-pflichtig?", "Die 7 Schritte zur audit-sicheren Beurteilung", "Checkliste psychische Belastung (Pflicht seit 2013)"],
  buttonLabel = "Jetzt kostenlos herunterladen",
}: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
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
      track("Lead Magnet Submitted", { asset });
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unbekannter Fehler.");
    }
  }

  if (status === "ok") {
    return (
      <aside className="not-prose my-10 rounded-2xl border border-cognac-300 bg-gradient-to-br from-parchment-50 to-cognac-50 p-7 shadow-card">
        <p className="text-base font-display font-semibold text-cognac-700">
          Vielen Dank!
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Wir haben Ihnen den Download an{" "}
          <span className="font-semibold text-ink">{email}</span> geschickt. Schauen
          Sie auch im Spam-Ordner nach. Direkt-Link:{" "}
          <a
            href={`/lead-magnets/${asset}.html`}
            className="font-semibold text-cognac-700 underline underline-offset-2 hover:text-cognac-800"
            target="_blank"
            rel="noopener"
          >
            Download öffnen
          </a>
          .
        </p>
      </aside>
    );
  }

  return (
    <aside className="not-prose my-10 rounded-2xl border border-parchment-300 bg-gradient-to-br from-parchment-50 via-white to-cognac-50/40 p-7 shadow-card">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cognac-700">
        Lead-Magnet · kostenlos
      </p>
      <h3 className="mt-2 font-display text-xl font-semibold text-ink">
        {headline}
      </h3>
      {bullets.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-ink">
              <span aria-hidden className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-cognac-100 text-cognac-700 text-xs">
                ✓
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          required
          placeholder="Vorname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-parchment-300 bg-white px-3 py-2.5 text-sm placeholder:text-ink-subtle focus:border-cognac-500 focus:outline-none focus:ring-2 focus:ring-cognac-500/20 transition"
        />
        <input
          type="email"
          required
          placeholder="E-Mail-Adresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-parchment-300 bg-white px-3 py-2.5 text-sm placeholder:text-ink-subtle focus:border-cognac-500 focus:outline-none focus:ring-2 focus:ring-cognac-500/20 transition"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="sm:col-span-2 rounded-full bg-cognac-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-cognac-700 disabled:opacity-60"
        >
          {status === "loading" ? "Wird gesendet …" : buttonLabel}
        </button>
      </form>

      {error && (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          Fehler: {error}
        </p>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-ink-subtle">
        Mit dem Klick stimmen Sie zu, dass wir Ihnen das Asset und maximal 2
        Folge-E-Mails mit verwandten Inhalten schicken. Abmeldung jederzeit per
        Klick. Details:{" "}
        <a href="/datenschutz" className="underline hover:text-cognac-700">
          Datenschutz
        </a>
        .
      </p>
    </aside>
  );
}
