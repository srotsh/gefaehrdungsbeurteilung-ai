import { createServerClient } from "@flow/db";
import { renderToBuffer } from "@flow/pdf";
import { getProductSubscription, getApiIdentity } from "@flow/core";
import { GbuDoc } from "@/lib/pdf/gbu-doc";
import { BRANCHEN_LABELS, type Branche, type GbuData } from "@/lib/validations";
import { formatDateDE } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const identity = await getApiIdentity();
  if (!identity) return new Response("Nicht angemeldet.", { status: 401 });

  const supabase = createServerClient();
  const { data: gbu, error } = await supabase
    .from("gbus")
    .select("id, account_id, arbeitsbereich_id, gbu_data, status, revision, created_at, next_review_at")
    .eq("id", params.id)
    .single();

  if (error || !gbu?.gbu_data) {
    return new Response("Beurteilung nicht gefunden oder noch nicht generiert", { status: 404 });
  }

  const { data: bereich } = await supabase
    .from("arbeitsbereiche")
    .select("name, branche, standort")
    .eq("id", gbu.arbeitsbereich_id)
    .single();
  if (!bereich) return new Response("Arbeitsbereich nicht gefunden", { status: 404 });

  // Free-Plan → Wasserzeichen; Entwurf ebenfalls.
  const sub = await getProductSubscription(identity.accountId, "gefaehrdungsbeurteilung");
  const showWatermark = gbu.status !== "finalized" || sub.plan === "free";

  const buffer = await renderToBuffer(
    <GbuDoc
      data={gbu.gbu_data as GbuData}
      arbeitsbereich={{
        name: bereich.name,
        branche: BRANCHEN_LABELS[bereich.branche as Branche],
        standort: bereich.standort,
      }}
      revision={gbu.revision}
      erstelltAm={formatDateDE(gbu.created_at)}
      naechsteRevision={gbu.next_review_at ? formatDateDE(gbu.next_review_at) : null}
      showWatermark={showWatermark}
    />
  );

  const filename = `gefaehrdungsbeurteilung-${bereich.name.replaceAll(" ", "-")}-rev${gbu.revision}.pdf`;
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
