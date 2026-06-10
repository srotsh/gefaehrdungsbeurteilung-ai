import Link from "next/link";
import { createServerClient } from "@flow/db";
import { BRANCHEN_LABELS } from "@/lib/validations";
import type { Arbeitsbereich } from "@/types";

export default async function ArbeitsbereichePage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("arbeitsbereiche")
    .select("*")
    .order("created_at", { ascending: false });

  const bereiche = (data ?? []) as Arbeitsbereich[];

  return (
    <main className="p-8 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Arbeitsbereiche</h1>
          <p className="text-sm text-muted-foreground">
            Pro Arbeitsbereich wird eine eigene Gefährdungsbeurteilung geführt.
          </p>
        </div>
        <Link
          href="/arbeitsbereiche/neu"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Neuer Arbeitsbereich
        </Link>
      </header>

      {bereiche.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          Noch keine Arbeitsbereiche angelegt.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {bereiche.map((b) => (
            <div key={b.id} className="rounded-lg border bg-card p-5 space-y-1">
              <div className="flex items-start justify-between">
                <h2 className="font-semibold">{b.name}</h2>
                <span className="rounded bg-muted px-2 py-0.5 text-xs">
                  {BRANCHEN_LABELS[b.branche]}
                </span>
              </div>
              {b.standort && <p className="text-sm text-muted-foreground">{b.standort}</p>}
              {b.beschreibung && <p className="text-sm">{b.beschreibung}</p>}
              <div className="pt-2">
                <Link
                  href={`/neu?bereich=${b.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  Beurteilung starten →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
