"use server";

import { tryGetAccount } from "@/lib/server-auth";
import { createServerClient } from "@flow/db";
import { NewArbeitsbereichSchema } from "@/lib/validations";
import { auditLog } from "@flow/core";

export async function createArbeitsbereichAction(formData: FormData) {
  const auth = await tryGetAccount();
  if (!auth) return { error: "Nicht angemeldet." };
  const { account, user } = auth;

  const parsed = NewArbeitsbereichSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    branche: String(formData.get("branche") ?? ""),
    standort: String(formData.get("standort") ?? ""),
    beschreibung: String(formData.get("beschreibung") ?? ""),
  });
  if (!parsed.success) {
    return { error: parsed.error.errors.map((e) => e.message).join("; ") };
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("arbeitsbereiche")
    .insert({ account_id: account.id, ...parsed.data })
    .select("id")
    .single();
  if (error) return { error: error.message };

  await auditLog({
    accountId: account.id,
    userId: user.id,
    product: "gefaehrdungsbeurteilung",
    action: "arbeitsbereich_created",
    entityType: "arbeitsbereich",
    entityId: data.id,
  });

  return { id: data.id as string };
}
