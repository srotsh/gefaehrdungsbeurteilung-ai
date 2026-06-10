/* AUTO-GENERATED via shared-core/scripts/gen-lead-drip.py */
import { NextResponse } from "next/server";
import { isAuthorizedCron } from "@flow/storage";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const PRODUCT_NAME = "GefaehrdungsbeurteilungAI";
const DOMAIN = "gefaehrdungsbeurteilung-ai.de";
const MAGNET_TOPIC = "GBU-Pflicht-Check";
const USE_CASE = "Werkstatt-Rundgang einsprechen, in 10 Min steht die audit-sichere Gefaehrdungsbeurteilung mit Massnahmenplan.";

const RELATED: { title: string; href: string }[] = [
  { title: "Gefährdungsbeurteilung erstellen", href: "/ratgeber/gefaehrdungsbeurteilung-erstellen" },
  { title: "Psychische Belastung (Pflicht)", href: "/ratgeber/psychische-belastung-gefaehrdungsbeurteilung" },
  { title: "STOP-Prinzip", href: "/ratgeber/stop-prinzip-massnahmen" }
];

// Drip-Schedule (Tage seit Lead-Eintrag)
const DRIP_STEPS = [
  { step: 1, daysAfter: 2,  subject: `Mehr ${MAGNET_TOPIC}-Wissen für Sie` },
  { step: 2, daysAfter: 5,  subject: `In Minuten statt Stunden: ${PRODUCT_NAME} ausprobieren` },
  { step: 3, daysAfter: 14, subject: `Letzte Erinnerung: ${PRODUCT_NAME} kostenlos testen` },
];

export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const sb = createServiceClient();
  const now = new Date();
  let sent = 0;
  let failed = 0;
  const skipped: string[] = [];

  for (const cfg of DRIP_STEPS) {
    const minAge = new Date(now.getTime() - cfg.daysAfter * 24 * 60 * 60 * 1000);

    // Leads, die bereit sind für genau diesen Step
    const { data: leads, error } = await sb
      .from("leads")
      .select("id, email, name, asset, created_at")
      .lt("drip_step", cfg.step)
      .gte("drip_step", cfg.step - 1)
      .lte("created_at", minAge.toISOString())
      .is("unsubscribed_at", null)
      .is("confirmed_at", null)
      .limit(50);

    if (error || !leads) {
      skipped.push(`step ${cfg.step}: ${error?.message ?? "no leads"}`);
      continue;
    }

    for (const lead of leads) {
      const html = renderTemplate(cfg.step, lead.name ?? "", lead.email);
      const ok = await sendEmail(lead.email, cfg.subject, html);
      if (ok) {
        await sb
          .from("leads")
          .update({ drip_step: cfg.step, last_email_at: now.toISOString() })
          .eq("id", lead.id);
        sent++;
      } else {
        failed++;
      }
    }
  }

  return NextResponse.json({ ok: true, sent, failed, skipped });
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log("[lead-drip] RESEND_API_KEY missing — skipping send", { to, subject });
    return true; // count as success for local dev
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "noreply@example.com",
        to,
        subject,
        html,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[lead-drip] send failed", err);
    return false;
  }
}

function renderTemplate(step: number, name: string, email: string): string {
  const greeting = name ? `Hallo ${name},` : "Hallo,";
  const baseUrl = `https://${DOMAIN}`;
  const unsubscribe = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`;

  if (step === 1) {
    const links = RELATED
      .map((r) => `<li><a href="${baseUrl}${r.href}" style="color:#a36a2a;">${r.title}</a></li>`)
      .join("\n");
    return `<!DOCTYPE html><html lang="de"><body style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;">
<p>${greeting}</p>
<p>vielen Dank für Ihren Download zum Thema <strong>${MAGNET_TOPIC}</strong>.
Damit Sie das Wissen vertiefen, hier drei verwandte Praxis-Artikel:</p>
<ul style="line-height:1.8;">${links}</ul>
<p>Bei Fragen einfach auf diese Mail antworten.</p>
<p>Beste Grüße<br>${PRODUCT_NAME}</p>
<hr style="border:none;border-top:1px solid #e8dcc1;margin:32px 0 12px;">
<p style="font-size:11px;color:#8a8a8a;">Sie erhalten diese Mail, weil Sie sich auf ${baseUrl} ein Asset heruntergeladen haben. <a href="${unsubscribe}" style="color:#8a8a8a;">Abmelden</a></p>
</body></html>`;
  }

  if (step === 2) {
    return `<!DOCTYPE html><html lang="de"><body style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;">
<p>${greeting}</p>
<p>Sie haben sich für ${MAGNET_TOPIC} interessiert. Wussten Sie, dass <strong>${PRODUCT_NAME}</strong> genau das automatisiert?</p>
<p style="background:#faf6ec;border-left:4px solid #a36a2a;padding:14px 20px;font-style:italic;">${USE_CASE}</p>
<p style="text-align:center;margin:32px 0;">
  <a href="${baseUrl}/signup" style="display:inline-block;background:#a36a2a;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:600;">Kostenlos starten</a>
</p>
<p>Free-Tier ohne Kreditkarte. DSGVO-konform. EU-Hosting.</p>
<p>Beste Grüße<br>${PRODUCT_NAME}</p>
<hr style="border:none;border-top:1px solid #e8dcc1;margin:32px 0 12px;">
<p style="font-size:11px;color:#8a8a8a;"><a href="${unsubscribe}" style="color:#8a8a8a;">Abmelden</a></p>
</body></html>`;
  }

  // Step 3 — last touch
  return `<!DOCTYPE html><html lang="de"><body style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;">
<p>${greeting}</p>
<p>vor zwei Wochen haben Sie sich für ${MAGNET_TOPIC} interessiert. Falls Sie noch unentschlossen sind:
<strong>${PRODUCT_NAME}</strong> ist im Free-Tier komplett kostenlos.</p>
<p>Sie testen die Pipeline (${USE_CASE}) und entscheiden danach.</p>
<p style="text-align:center;margin:32px 0;">
  <a href="${baseUrl}/signup" style="display:inline-block;background:#a36a2a;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:600;">Free starten</a>
</p>
<p>Falls ${PRODUCT_NAME} nichts für Sie ist: einfach abmelden, dann hören Sie nichts mehr von uns.</p>
<p>Beste Grüße<br>${PRODUCT_NAME}</p>
<hr style="border:none;border-top:1px solid #e8dcc1;margin:32px 0 12px;">
<p style="font-size:11px;color:#8a8a8a;"><a href="${unsubscribe}" style="color:#8a8a8a;">Abmelden</a></p>
</body></html>`;
}
