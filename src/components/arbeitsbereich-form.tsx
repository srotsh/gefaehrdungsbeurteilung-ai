"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BRANCHEN, BRANCHEN_LABELS, type Branche } from "@/lib/validations";
import { createArbeitsbereichAction } from "@/app/(dashboard)/arbeitsbereiche/neu/actions";

export function ArbeitsbereichForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [branche, setBranche] = useState<Branche>("handwerk_werkstatt");

  return (
    <form
      className="space-y-5 rounded-md border bg-card p-6"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const res = await createArbeitsbereichAction(fd);
          if (res.error) {
            setError(res.error);
            return;
          }
          router.push(`/neu?bereich=${res.id}`);
        });
      }}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Name des Arbeitsbereichs *</label>
        <input
          name="name"
          required
          placeholder="z. B. Werkstatt EG, Küche, Lager Halle 2"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Branche *</label>
        <select
          name="branche"
          value={branche}
          onChange={(e) => setBranche(e.target.value as Branche)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        >
          {BRANCHEN.map((b) => (
            <option key={b} value={b}>{BRANCHEN_LABELS[b]}</option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Lädt den branchentypischen Gefährdungskatalog als Checkliste vor.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Standort</label>
          <input
            name="standort"
            placeholder="z. B. Hauptbetrieb Musterstadt"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Beschreibung</label>
          <input
            name="beschreibung"
            placeholder="optional"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? "Wird angelegt…" : "Anlegen & Beurteilung starten"}
      </button>
    </form>
  );
}
