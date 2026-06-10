import Link from "next/link";
import { createServerClient } from "@flow/db";
import { MassnahmenTable } from "@/components/massnahmen-table";
import type { MassnahmeRow } from "@/types";

export default async function MassnahmenPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("massnahmen")
    .select("*")
    .order("frist", { ascending: true, nullsFirst: false })
    .order("risikostufe", { ascending: false });

  const rows = (data ?? []) as MassnahmeRow[];

  return (
    <main className="p-8 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Maßnahmen-Tracking</h1>
          <p className="text-sm text-muted-foreground">
            Alle Maßnahmen aus finalisierten Beurteilungen — mit Fristen, Verantwortlichen
            und Wirksamkeitsprüfung.
          </p>
        </div>
        <Link
          href="/massnahmen/export"
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          CSV-Export (Maßnahmenplan)
        </Link>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          Noch keine Maßnahmen. Maßnahmen entstehen beim Finalisieren einer Beurteilung.
        </div>
      ) : (
        <MassnahmenTable rows={rows} />
      )}
    </main>
  );
}
