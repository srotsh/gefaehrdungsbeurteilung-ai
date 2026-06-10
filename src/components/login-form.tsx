"use client";
/* brand-skinned */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/(auth)/login/actions";

export function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-4 rounded-2xl border border-parchment-300 bg-white p-6 shadow-card"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const res = await loginAction(fd);
          if (res?.error) setError(res.error);
          else router.push("/");
        });
      }}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">E-Mail</label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-parchment-300 bg-parchment-50/50 px-3 py-2.5 text-sm focus:border-cognac-500 focus:outline-none focus:ring-2 focus:ring-cognac-500/20 transition"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Passwort</label>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded-lg border border-parchment-300 bg-parchment-50/50 px-3 py-2.5 text-sm focus:border-cognac-500 focus:outline-none focus:ring-2 focus:ring-cognac-500/20 transition"
          autoComplete="current-password"
        />
      </div>
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-cognac-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-cognac-700 transition disabled:opacity-50"
      >
        {pending ? "Anmelden…" : "Anmelden"}
      </button>
      <p className="text-center text-xs text-ink-muted">
        Noch kein Konto?{" "}
        <a href="/signup" className="underline">Registrieren</a>
      </p>
    </form>
  );
}
