import Link from "next/link";
import { createServerClient } from "@flow/db";
import { BRANCHEN_LABELS, type Branche } from "@/lib/validations";
import { formatDateDE } from "@/lib/utils";

export default async function GbuListPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("gbus")
    .select("id, status, revision, created_at, next_review_at, arbeitsbereiche(name, branche)")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as unknown as Array<{
    id: string;
    status: string;
    revision: number;
    created_at: string;
    next_review_at: string | null;
    arbeitsbereiche: { name: string; branche: string } | null;
  }>;

  return (
    <main className="p-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gefährdungsbeurteilungen</h1>
        <Link
          href="/neu"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Neue Beurteilung
        </Link>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          Noch keine Beurteilungen vorhanden.
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
                <th className="px-4 py-2">Nächste Revision</th>
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
                  <td className="px-4 py-2 text-muted-foreground">
                    {g.next_review_at ? formatDateDE(g.next_review_at) : "—"}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">{formatDateDE(g.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
