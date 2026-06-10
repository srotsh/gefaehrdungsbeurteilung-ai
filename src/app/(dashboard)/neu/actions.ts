"use server";

import { tryGetAccount } from "@/lib/server-auth";
import { createServerClient } from "@flow/db";
import { uploadFile } from "@flow/storage";
import { cookies } from "next/headers";

const BUCKET = "gefaehrdungsbeurteilung-recordings";
const MAX_AUDIO_BYTES = 500 * 1024 * 1024;
const MAX_FOTO_BYTES = 10 * 1024 * 1024;

/**
 * Legt eine neue GBU an. Zwei Input-Modi:
 *  - voice: Audio-Rundgang wird hochgeladen, Transkription läuft async.
 *  - checkliste: ausgefüllte Checkliste wird direkt als transcript_raw gespeichert.
 * Optional: Fotos des Arbeitsbereichs (Anhang, keine Vision-Analyse in v1).
 */
export async function startGbuAction(formData: FormData) {
  const auth = await tryGetAccount();
  if (!auth) return { error: "Nicht angemeldet." };
  const { account } = auth;

  const arbeitsbereichId = String(formData.get("arbeitsbereich_id") ?? "");
  const inputMode = String(formData.get("input_mode") ?? "voice");
  const checkliste = String(formData.get("checkliste") ?? "");
  const audio = formData.get("audio") as File | null;
  const fotos = formData.getAll("fotos").filter((f): f is File => f instanceof File && f.size > 0);

  if (!arbeitsbereichId) return { error: "Arbeitsbereich fehlt." };
  if (inputMode === "voice" && !audio) return { error: "Bitte eine Audiodatei hochladen." };
  if (inputMode === "checkliste" && checkliste.trim().length < 30) {
    return { error: "Bitte die Checkliste ausfüllen (mind. ein paar Beobachtungen)." };
  }
  if (audio && audio.size > MAX_AUDIO_BYTES) return { error: "Audiodatei überschreitet 500 MB." };

  const supabase = createServerClient();

  // Bereich laden (RLS sichert Ownership) + nächste Revisionsnummer bestimmen.
  const { data: bereich } = await supabase
    .from("arbeitsbereiche")
    .select("id")
    .eq("id", arbeitsbereichId)
    .single();
  if (!bereich) return { error: "Arbeitsbereich nicht gefunden." };

  const { count } = await supabase
    .from("gbus")
    .select("*", { count: "exact", head: true })
    .eq("arbeitsbereich_id", arbeitsbereichId);

  const { data: row, error } = await supabase
    .from("gbus")
    .insert({
      account_id: account.id,
      arbeitsbereich_id: arbeitsbereichId,
      revision: (count ?? 0) + 1,
      status: "draft",
      input_mode: inputMode,
      transcript_raw: inputMode === "checkliste" ? checkliste : null,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };
  const gbuId = row.id as string;

  // Fotos hochladen (optional)
  const fotoPaths: string[] = [];
  for (const [i, foto] of fotos.entries()) {
    if (foto.size > MAX_FOTO_BYTES) continue;
    const ext = foto.name.split(".").pop() ?? "jpg";
    const path = `${account.id}/${gbuId}/foto-${i + 1}.${ext}`;
    try {
      await uploadFile({
        bucket: BUCKET,
        path,
        file: Buffer.from(await foto.arrayBuffer()),
        contentType: foto.type,
      });
      fotoPaths.push(path);
    } catch {
      // Foto-Upload ist nicht kritisch — GBU bleibt nutzbar.
    }
  }
  if (fotoPaths.length > 0) {
    await supabase.from("gbus").update({ foto_paths: fotoPaths }).eq("id", gbuId);
  }

  if (inputMode === "voice" && audio) {
    const ext = audio.name.split(".").pop() ?? "bin";
    const path = `${account.id}/${gbuId}/rundgang.${ext}`;
    try {
      await uploadFile({
        bucket: BUCKET,
        path,
        file: Buffer.from(await audio.arrayBuffer()),
        contentType: audio.type,
      });
    } catch (err) {
      return { error: `Upload fehlgeschlagen: ${(err as Error).message}` };
    }
    await supabase.from("gbus").update({ recording_path: path }).eq("id", gbuId);

    // Transkription async anstoßen — Session-Cookies mitgeben (API prüft Auth).
    void fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/transcribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies().toString(),
      },
      body: JSON.stringify({ gbuId }),
    }).catch(() => undefined);
  } else {
    // Checklisten-Modus: direkt Generierung anstoßen.
    void fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies().toString(),
      },
      body: JSON.stringify({ gbuId }),
    }).catch(() => undefined);
  }

  return { id: gbuId };
}
