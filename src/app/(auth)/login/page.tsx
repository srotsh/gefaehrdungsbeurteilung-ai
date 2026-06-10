/* AUTO-GENERATED via shared-core/scripts/gen-auth-pages.py */
import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";


export const metadata: Metadata = {
  title: "Anmelden — GefaehrdungsbeurteilungAI",
  description: "Melden Sie sich bei GefaehrdungsbeurteilungAI an.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-parchment-100 text-ink p-6">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="font-display text-xl font-bold text-ink">
            GefaehrdungsbeurteilungAI
          </Link>
          <h1 className="mt-6 font-display text-2xl font-semibold text-ink">
            Willkommen zurück
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Melden Sie sich an, um fortzufahren.
          </p>
        </div>
        <div className="mt-7">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-ink-subtle">
          Noch kein Konto?{" "}
          <Link href="/signup" className="font-semibold text-cognac-700 hover:underline">
            Kostenlos starten
          </Link>
        </p>
      </div>
    </main>
  );
}
