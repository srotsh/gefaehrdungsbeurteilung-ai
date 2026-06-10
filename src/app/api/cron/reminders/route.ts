import { NextResponse } from "next/server";
import { createServiceClient } from "@flow/db";
import { isAuthorizedCron } from "@flow/storage";
import { sendEmail, escapeHtml } from "@flow/email";

export const runtime = "nodejs";
export const maxDuration = 120;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://gefaehrdungsbeurteilung-ai.de";

/**
 * Täglicher Reminder-Cron:
 *  1. Maßnahmen mit Frist in <= 7 Tagen oder überfällig (status offen/in_umsetzung),
 *     die noch nicht in den letzten 7 Tagen erinnert wurden.
 *  2. GBUs mit fälliger Wiedervorlage (next_review_at in <= 30 Tagen).
 * Eine Mail pro Account, gruppiert.
 */
export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const admin = createServiceClient();
  const heute = new Date().toISOString().slice(0, 10);
  const in7 = new Date(Date.now() + 7 * 86400_000).toISOString().slice(0, 10);
  const in30 = new Date(Date.now() + 30 * 86400_000).toISOString().slice(0, 10);
  const vor7Tagen = new Date(Date.now() - 7 * 86400_000).toISOString();

  const [{ data: massnahmen }, { data: reviews }] = await Promise.all([
    admin
      .from("massnahmen")
      .select("id, account_id, beschreibung, frist, verantwortlich, risikostufe, erinnert_am")
      .in("status", ["offen", "in_umsetzung"])
      .not("frist", "is", null)
      .lte("frist", in7),
    admin
      .from("gbus")
      .select("id, account_id, next_review_at, arbeitsbereiche(name)")
      .eq("status", "finalized")
      .not("next_review_at", "is", null)
      .lte("next_review_at", in30),
  ]);

  // Nach Account gruppieren; bereits kürzlich erinnerte Maßnahmen auslassen.
  const byAccount = new Map<string, { massnahmen: NonNullable<typeof massnahmen>; reviews: NonNullable<typeof reviews> }>();
  for (const m of massnahmen ?? []) {
    if (m.erinnert_am && m.erinnert_am > vor7Tagen) continue;
    const e = byAccount.get(m.account_id) ?? { massnahmen: [], reviews: [] };
    e.massnahmen.push(m);
    byAccount.set(m.account_id, e);
  }
  for (const r of reviews ?? []) {
    const e = byAccount.get(r.account_id) ?? { massnahmen: [], reviews: [] };
    e.reviews.push(r);
    byAccount.set(r.account_id, e);
  }

  let sent = 0;
  for (const [accountId, items] of byAccount) {
    // E-Mail des ersten Users des Accounts (auth.users via Admin-API).
    const { data: users } = await admin
      .from("users")
      .select("id")
      .eq("account_id", accountId)
      .limit(1);
    const userId = users?.[0]?.id;
    if (!userId) continue;
    const { data: authUser } = await admin.auth.admin.getUserById(userId);
    const email = authUser?.user?.email;
    if (!email) continue;

    const mLines = items.massnahmen
      .map(
        (m) =>
          `<li>${escapeHtml(m.beschreibung)} — Frist ${m.frist}${m.frist! < heute ? " <strong>(überfällig)</strong>" : ""}${m.verantwortlich ? `, ${escapeHtml(m.verantwortlich)}` : ""}</li>`
      )
      .join("");
    const rLines = items.reviews
      .map(
        (r) =>
          `<li>${escapeHtml((r as unknown as { arbeitsbereiche: { name: string } | null }).arbeitsbereiche?.name ?? "Arbeitsbereich")} — Revision fällig am ${r.next_review_at}</li>`
      )
      .join("");

    const res = await sendEmail({
      to: email,
      subject: "Arbeitsschutz: fällige Maßnahmen und Wiedervorlagen",
      html: `
<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
  <h1 style="font-size:18px">Fällige Punkte in Ihrer Gefährdungsbeurteilung</h1>
  ${mLines ? `<h2 style="font-size:14px">Maßnahmen</h2><ul>${mLines}</ul>` : ""}
  ${rLines ? `<h2 style="font-size:14px">Wiedervorlagen</h2><ul>${rLines}</ul>` : ""}
  <p style="margin:24px 0">
    <a href="${APP_URL}/massnahmen" style="background:#1d4ed8;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Zum Maßnahmen-Tracking</a>
  </p>
</div>`,
    });

    if (res.status === "sent") {
      sent++;
      const ids = items.massnahmen.map((m) => m.id);
      if (ids.length > 0) {
        await admin
          .from("massnahmen")
          .update({ erinnert_am: new Date().toISOString() })
          .in("id", ids);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    accounts: byAccount.size,
    emailsSent: sent,
  });
}
