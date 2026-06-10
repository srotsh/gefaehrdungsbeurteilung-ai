import { notFound } from "next/navigation";
import { createServerClient } from "@flow/db";
import { GbuEditor } from "@/components/gbu-editor";
import { BRANCHEN_LABELS, type Branche, type GbuData } from "@/lib/validations";
import { formatDateDE } from "@/lib/utils";
import type { Gbu } from "@/types";

export default async function GbuPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("gbus")
    .select("*, arbeitsbereiche(name, branche, standort)")
    .eq("id", params.id)
    .single();

  if (!data) notFound();

  const g = data as unknown as Gbu & {
    arbeitsbereiche: { name: string; branche: Branche; standort: string | null } | null;
  };
  const gbuData = (g.gbu_data ?? null) as GbuData | null;
  const finalized = g.status === "finalized";

  return (
    <main className="p-8 space-y-6">
      <header className="flex items-start justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">
            {g.arbeitsbereiche?.name ?? "Arbeitsbereich"} — Revision {g.revision}
          </h1>
          <p className="text-sm text-muted-foreground">
            {g.arbeitsbereiche ? BRANCHEN_LABELS[g.arbeitsbereiche.branche] : ""}
            {g.arbeitsbereiche?.standort ? ` · ${g.arbeitsbereiche.standort}` : ""}
            {" · erstellt am "}
            {formatDateDE(g.created_at)}
            {g.next_review_at ? ` · nächste Revision: ${formatDateDE(g.next_review_at)}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {gbuData && (
            <a href={`/gbu/${g.id}/pdf`} className="rounded-md border px-3 py-1 text-xs hover:bg-muted">
              PDF
            </a>
          )}
          <div className="rounded-md bg-muted px-3 py-1 text-xs font-medium uppercase">{g.status}</div>
        </div>
      </header>

      {!g.transcript_raw && !gbuData && (
        <RefreshNotice text="Transkription läuft… Diese Seite bitte gleich neu laden." />
      )}

      {g.transcript_raw && !gbuData && <GenerateGbuPrompt gbuId={g.id} />}

      {gbuData && (
        <GbuEditor gbuId={g.id} initialData={gbuData} finalized={finalized} />
      )}
    </main>
  );
}

function RefreshNotice({ text }: { text: string }) {
  return (
    <div className="rounded-md border bg-card p-6">
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function GenerateGbuPrompt({ gbuId }: { gbuId: string }) {
  return (
    <form
      action={async () => {
        "use server";
        const { cookies } = await import("next/headers");
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            cookie: cookies().toString(),
          },
          body: JSON.stringify({ gbuId }),
          cache: "no-store",
        });
      }}
      className="rounded-md border bg-card p-6 space-y-3"
    >
      <h2 className="font-semibold">Eingabe bereit</h2>
      <p className="text-sm text-muted-foreground">
        Jetzt die strukturierte Gefährdungsbeurteilung erzeugen lassen
        (Tätigkeiten → Gefährdungen → Risikomatrix → STOP-Maßnahmen). Dauert 30–90 Sekunden.
      </p>
      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Beurteilung generieren
      </button>
    </form>
  );
}
