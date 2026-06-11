/* AUTO-GENERATED via shared-core/scripts/gen-auth-pages.py */
import Link from "next/link";
import type { Metadata } from "next";
import { Check, ShieldCheck, Lock } from "lucide-react";
import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Konto erstellen — GefaehrdungsbeurteilungAI",
  description: "Free starten. Keine Kreditkarte. DSGVO-konform.",
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: true },
};

const VALUE_PROPS = [
  "1 Beurteilung pro Monat gratis — ohne Kreditkarte",
  "Erstes Dokument in Minuten erstellt",
  "DSGVO-konform · EU-Hosting (Frankfurt)",
  "Audio-Daten gelöscht nach 30 Tagen",
  "Monatlich kündbar, Export jederzeit"
];

export default function SignupPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-parchment-100 text-ink">
      {/* Left: brand panel */}
      <aside className="hidden lg:flex flex-col justify-between p-12 bg-petrol-800 text-parchment-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-parchment-grain opacity-10" aria-hidden />
        <div className="relative">
          <Link href="/" className="font-display text-xl font-bold tracking-tight text-parchment-50">
            GefaehrdungsbeurteilungAI
          </Link>
          <h1 className="mt-16 font-display text-4xl xl:text-5xl leading-[1.1] text-balance">
            Werkstatt-Rundgang einsprechen. Audit-sichere Gefaehrdungsbeurteilung erhalten.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-parchment-200/90 max-w-md">
            Gefaehrdungsbeurteilung nach Paragraph 5/6 ArbSchG. Audit-sicher. In Stunden statt Wochen.
          </p>
          <ul className="mt-10 space-y-3">
            {VALUE_PROPS.map((v) => (
              <li key={v} className="flex items-center gap-3 text-sm text-parchment-100">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cognac-500/20 text-cognac-300">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {v}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex items-center gap-4 text-xs text-parchment-200/70">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> DSGVO-konform
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-4 w-4" /> EU-Server
          </span>
        </div>
      </aside>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="font-display text-xl font-bold text-ink">
              GefaehrdungsbeurteilungAI
            </Link>
          </div>
          <h2 className="font-display text-3xl font-semibold text-ink">
            Konto erstellen
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Free-Tier ohne Kreditkarte. In 60 Sekunden los.
          </p>
          <div className="mt-7">
            <SignupForm />
          </div>
          <p className="mt-6 text-center text-xs text-ink-subtle">
            Mit der Registrierung akzeptieren Sie unsere{" "}
            <Link href="/agb" className="underline hover:text-cognac-700">AGB</Link>
            {" "}und{" "}
            <Link href="/datenschutz" className="underline hover:text-cognac-700">Datenschutz-Bestimmungen</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
