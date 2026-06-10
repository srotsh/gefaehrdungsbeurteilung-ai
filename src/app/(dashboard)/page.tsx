import Link from "next/link";
import { createServerClient } from "@flow/db";
import { BRANCHEN_LABELS, type Branche } from "@/lib/validations";
import { formatDateDE } from "@/lib/utils";

export default async function DashboardHome() {
  const supabase = createServerClient();

  const [{ data: gbus }, { count: offeneMassnahmen }, { data: faellig }] = await Promise.all([
    supabase
      .from("gbus")
      .select("id, status, revision, created_at, next_review_at, arbeitsbereiche(name, branche)")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("massnahmen")
      .select("*", { count: "exact", head: true })
      .in("status", ["offen", "in_umsetzung"]),
    supabase
      .from("gbus")
      .select("id, next_review_at, arbeitsbereiche(name)")
      .eq("status", "finalized")
      .not("next_review_at", "is", null)
      .lte("next_review_at", new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10))
      .order("next_review_at"),
  ]);

  type GbuRow = {
    id: string;
    status: string;
    revision: number;
    created_at: string;
    next_review_at: string | null;
    arbeitsbereiche: { name: string; branche: string } | null;
  };
  const rows = (gbus ?? []) as unknown as GbuRow[];
  const wiedervorlagen = (faellig ?? []) as unknown as Array<{
    id: string;
    next_review_at: string;
    arbeitsbereiche: { name: string } | null;
  }>;

  return (
    <main className="p-8 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Übersicht</h1>
        <Link
          href="/neu"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Neue Beurteilung
        </Link>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs uppercase text-muted-foreground">Beurteilungen</p>
          <p className="mt-1 text-2xl font-bold">{rows.length}</p>
        </div>
        <Link href="/massnahmen" className="rounded-lg border bg-card p-4 hover:bg-muted/50">
          <p className="text-xs uppercase text-muted-foreground">Offene Maßnahmen</p>
          <p className="mt-1 text-2xl font-bold">{offeneMassnahmen ?? 0}</p>
        </Link>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs uppercase text-muted-foreground">Wiedervorlagen (30 Tage)</p>
          <p className="mt-1 text-2xl font-bold">{wiedervorlagen.length}</p>
        </div>
      </div>

      {wiedervorlagen.length > 0 && (
        <section className="rounded-lg border border-amber-300 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-900">Revision fällig</h2>
          <ul className="mt-2 space-y-1 text-sm text-amber-900">
            {wiedervorlagen.map((w) => (
              <li key={w.id}>
                <Link href={`/gbu/${w.id}`} className="underline">
                  {w.arbeitsbereiche?.name ?? "Arbeitsbereich"}
                </Link>{" "}
                — fällig am {formatDateDE(w.next_review_at)}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-semibold">Letzte Beurteilungen</h2>
        {rows.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center space-y-3">
            <p className="text-muted-foreground">
              Noch keine Gefährdungsbeurteilung. Legen Sie zuerst einen Arbeitsbereich an,
              dann sprechen Sie Ihren Rundgang ein.
            </p>
            <Link
              href="/arbeitsbereiche/neu"
              className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Arbeitsbereich anlegen
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Arbeitsbereich</th>
                  <th className="px-4 py-2">Branche</th>
                  <th className="px-4 py-2">Revision</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Erstellt</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((g) => (
                  <tr key={g.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-2">
                      <Link href={`/gbu/${g.id}`} className="font-medium hover:underline">
                        {g.arbeitsbereiche?.name ?? "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {g.arbeitsbereiche ? BRANCHEN_LABELS[g.arbeitsbereiche.branche as Branche] : "—"}
                    </td>
                    <td className="px-4 py-2">Rev. {g.revision}</td>
                    <td className="px-4 py-2">
                      <span className="rounded bg-muted px-2 py-0.5 text-xs uppercase">{g.status}</span>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{formatDateDE(g.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
