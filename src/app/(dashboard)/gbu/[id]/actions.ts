"use server";

import { revalidatePath } from "next/cache";
import { tryGetAccount } from "@/lib/server-auth";
import { createServerClient } from "@flow/db";
import { auditLog } from "@flow/core";
import { GbuDataSchema, type GbuData } from "@/lib/validations";
import { bewerteRisiko } from "@/lib/risiko/nohl";

export async function saveGbuAction(input: { gbuId: string; data: GbuData }) {
  const auth = await tryGetAccount();
  if (!auth) return { error: "Nicht angemeldet." };
  const { account } = auth;

  const parsed = GbuDataSchema.safeParse(input.data);
  if (!parsed.success) {
    return {
      error: parsed.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; "),
    };
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from("gbus")
    .update({ gbu_data: parsed.data, status: "review" })
    .eq("id", input.gbuId)
    .eq("account_id", account.id);

  if (error) return { error: error.message };
  return { ok: true };
}

/**
 * Finalisierung:
 *  1. Maßnahmen aus gbu_data in die trackbare `massnahmen`-Tabelle extrahieren.
 *  2. Wiedervorlage setzen (+12 Monate — jährliche Regelüberprüfung).
 *  3. Status `finalized` + Audit-Log.
 */
export async function finalizeGbuAction(gbuId: string) {
  const auth = await tryGetAccount();
  if (!auth) return { error: "Nicht angemeldet." };
  const { account, user } = auth;

  const supabase = createServerClient();
  const { data: gbu, error: loadErr } = await supabase
    .from("gbus")
    .select("id, arbeitsbereich_id, gbu_data, status")
    .eq("id", gbuId)
    .eq("account_id", account.id)
    .single();
  if (loadErr || !gbu?.gbu_data) return { error: "Beurteilung nicht gefunden." };
  if (gbu.status === "finalized") return { error: "Bereits finalisiert." };

  const parsed = GbuDataSchema.safeParse(gbu.gbu_data);
  if (!parsed.success) return { error: "Beurteilung ist unvollständig — bitte erst speichern." };
  const data = parsed.data;

  if (!data.psychische_belastung_betrachtet) {
    return {
      error:
        "Psychische Belastung wurde noch nicht betrachtet (Pflicht seit 2013). " +
        "Bitte ergänzen Sie die Betrachtung im Editor.",
    };
  }

  const massnahmenRows = data.taetigkeiten.flatMap((t) =>
    t.gefaehrdungen.flatMap((g) => {
      const risiko = bewerteRisiko(g.wahrscheinlichkeit, g.schadensschwere);
      return g.massnahmen.map((m) => ({
        account_id: account.id,
        gbu_id: gbuId,
        arbeitsbereich_id: gbu.arbeitsbereich_id,
        taetigkeit: t.name,
        gefaehrdung: g.beschreibung,
        faktor: g.faktor,
        risikostufe: risiko.stufe,
        beschreibung: m.beschreibung,
        stop_kategorie: m.stop_kategorie,
        verantwortlich: m.verantwortlich || null,
        frist: m.frist || null,
      }));
    })
  );

  if (massnahmenRows.length > 0) {
    const { error: insErr } = await supabase.from("massnahmen").insert(massnahmenRows);
    if (insErr) return { error: `Maßnahmen-Insert: ${insErr.message}` };
  }

  const nextReview = new Date();
  nextReview.setFullYear(nextReview.getFullYear() + 1);

  const { error: updErr } = await supabase
    .from("gbus")
    .update({
      status: "finalized",
      finalized_at: new Date().toISOString(),
      next_review_at: nextReview.toISOString().slice(0, 10),
    })
    .eq("id", gbuId);
  if (updErr) return { error: updErr.message };

  await auditLog({
    accountId: account.id,
    userId: user.id,
    product: "gefaehrdungsbeurteilung",
    action: "gbu_finalized",
    entityType: "gbu",
    entityId: gbuId,
    metadata: { massnahmen: massnahmenRows.length },
  });

  revalidatePath(`/gbu/${gbuId}`);
  revalidatePath("/massnahmen");
  return { ok: true, massnahmenCreated: massnahmenRows.length };
}

/**
 * Neue Revision anlegen (Wiedervorlage / Trigger-Ereignis wie Unfall, neue
 * Maschine, Umzug). Kopiert die letzte Fassung als Ausgangspunkt.
 */
export async function startRevisionAction(gbuId: string) {
  const auth = await tryGetAccount();
  if (!auth) return { error: "Nicht angemeldet." };
  const { account } = auth;

  const supabase = createServerClient();
  const { data: alt } = await supabase
    .from("gbus")
    .select("arbeitsbereich_id, revision, gbu_data, transcript_raw")
    .eq("id", gbuId)
    .eq("account_id", account.id)
    .single();
  if (!alt) return { error: "Beurteilung nicht gefunden." };

  const { data: neu, error } = await supabase
    .from("gbus")
    .insert({
      account_id: account.id,
      arbeitsbereich_id: alt.arbeitsbereich_id,
      revision: alt.revision + 1,
      status: "review",
      input_mode: "checkliste",
      transcript_raw: alt.transcript_raw,
      gbu_data: alt.gbu_data,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };

  return { id: neu.id as string };
}
