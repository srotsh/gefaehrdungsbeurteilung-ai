"use server";

import { revalidatePath } from "next/cache";
import { tryGetAccount } from "@/lib/server-auth";
import { createServerClient } from "@flow/db";
import { auditLog } from "@flow/core";
import type { MassnahmeStatus } from "@/types";

const VALID: MassnahmeStatus[] = ["offen", "in_umsetzung", "erledigt", "wirksamkeit_geprueft"];

export async function setMassnahmeStatusAction(input: {
  id: string;
  status: MassnahmeStatus;
}) {
  const auth = await tryGetAccount();
  if (!auth) return { error: "Nicht angemeldet." };
  const { account, user } = auth;

  if (!VALID.includes(input.status)) return { error: "Ungültiger Status." };

  const supabase = createServerClient();
  const { error } = await supabase
    .from("massnahmen")
    .update({
      status: input.status,
      wirksamkeit_geprueft_am:
        input.status === "wirksamkeit_geprueft" ? new Date().toISOString().slice(0, 10) : null,
    })
    .eq("id", input.id)
    .eq("account_id", account.id);
  if (error) return { error: error.message };

  await auditLog({
    accountId: account.id,
    userId: user.id,
    product: "gefaehrdungsbeurteilung",
    action: "massnahme_status_changed",
    entityType: "massnahme",
    entityId: input.id,
    metadata: { status: input.status },
  });

  revalidatePath("/massnahmen");
  return { ok: true };
}
