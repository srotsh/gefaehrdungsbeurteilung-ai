"use client";
/* brand-skinned */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signupAction } from "@/app/(auth)/signup/actions";
import { track } from "@/components/analytics/plausible";

export function SignupForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="rounded-2xl border border-parchment-300 bg-white p-6 shadow-card text-center space-y-3">
        <h2 className="text-lg font-semibold">Bitte E-Mail bestätigen</h2>
        <p className="text-sm text-ink-muted">
          Wir haben Ihnen einen Bestätigungslink gesendet. Klicken Sie darauf, um Ihr Konto zu aktivieren.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4 rounded-2xl border border-parchment-300 bg-white p-6 shadow-card"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const res = await signupAction(fd);
          if (res?.error) setError(res.error);
          else { track("Signup Completed"); setSuccess(true); }
        });
      }}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Vollständiger Name</label>
        <input name="fullName" required className="w-full rounded-lg border border-parchment-300 bg-parchment-50/50 px-3 py-2.5 text-sm focus:border-cognac-500 focus:outline-none focus:ring-2 focus:ring-cognac-500/20 transition" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Firma / Organisation</label>
        <input name="companyName" className="w-full rounded-lg border border-parchment-300 bg-parchment-50/50 px-3 py-2.5 text-sm focus:border-cognac-500 focus:outline-none focus:ring-2 focus:ring-cognac-500/20 transition" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">E-Mail</label>
        <input name="email" type="email" required className="w-full rounded-lg border border-parchment-300 bg-parchment-50/50 px-3 py-2.5 text-sm focus:border-cognac-500 focus:outline-none focus:ring-2 focus:ring-cognac-500/20 transition" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Passwort (min. 8 Zeichen)</label>
        <input name="password" type="password" required minLength={8} className="w-full rounded-lg border border-parchment-300 bg-parchment-50/50 px-3 py-2.5 text-sm focus:border-cognac-500 focus:outline-none focus:ring-2 focus:ring-cognac-500/20 transition" />
      </div>
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-cognac-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-cognac-700 transition disabled:opacity-50"
      >
        {pending ? "Konto wird erstellt…" : "Konto erstellen"}
      </button>
      <p className="text-center text-xs text-ink-muted">
        Bereits Konto? <a href="/login" className="underline">Anmelden</a>
      </p>
    </form>
  );
}
