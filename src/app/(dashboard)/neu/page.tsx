import { createServerClient } from "@flow/db";
import { NeueGbuForm } from "@/components/neue-gbu-form";
import { checklisteFuerBranche } from "@/lib/branchen";
import type { Arbeitsbereich } from "@/types";

export default async function NeueGbuPage({
  searchParams,
}: {
  searchParams: { bereich?: string };
}) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("arbeitsbereiche")
    .select("*")
    .order("created_at", { ascending: false });

  const bereiche = (data ?? []) as Arbeitsbereich[];
  const checklisten = Object.fromEntries(
    bereiche.map((b) => [b.id, checklisteFuerBranche(b.branche)])
  );

  return (
    <main className="p-8 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Neue Gefährdungsbeurteilung</h1>
        <p className="text-sm text-muted-foreground">
          Rundgang einsprechen (Audio) oder die geführte Checkliste ausfüllen —
          die AI strukturiert daraus Tätigkeiten, Gefährdungen und STOP-Maßnahmen.
        </p>
      </div>
      {bereiche.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center space-y-2">
          <p className="text-muted-foreground">Sie haben noch keinen Arbeitsbereich angelegt.</p>
          <a
            href="/arbeitsbereiche/neu"
            className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Erst Arbeitsbereich anlegen
          </a>
        </div>
      ) : (
        <NeueGbuForm
          bereiche={bereiche}
          checklisten={checklisten}
          preselect={searchParams.bereich}
        />
      )}
    </main>
  );
}
