import { NextResponse } from "next/server";
import { createServiceClient } from "@flow/db";
import { isAuthorizedCron } from "@flow/storage";
import { sendEmail, escapeHtml } from "@flow/email";

export const runtime = "nodejs";
export const maxDuration = 120;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://gefaehrdungsbeurteilung-ai.de";

interface DripStep {
  step: number;
  daysAfterSignup: number;
  subject: string;
  html: (name: string) => string;
}

const btn = (href: string, label: string) =>
  `<p style="margin:24px 0"><a href="${href}" style="background:#1d4ed8;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">${label}</a></p>`;

const wrap = (inner: string) =>
  `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">${inner}</div>`;

/** Trial-/Onboarding-Sequenz: D0 Welcome, D2 Nudge, D7 Praxisbeispiel, D12 Abschluss. */
const STEPS: DripStep[] = [
  {
    step: 0,
    daysAfterSignup: 0,
    subject: "Willkommen — Ihre erste Gefährdungsbeurteilung in 10 Minuten",
    html: (name) =>
      wrap(`<h1 style="font-size:18px">Willkommen, ${escapeHtml(name)}</h1>
<p>So starten Sie: Arbeitsbereich anlegen, Branche wählen, dann den Rundgang
einsprechen oder die geführte Checkliste ausfüllen. Die AI strukturiert daraus
Tätigkeiten, Gefährdungen und STOP-Maßnahmen — Sie prüfen und exportieren.</p>
${btn(`${APP_URL}/arbeitsbereiche/neu`, "Ersten Arbeitsbereich anlegen")}`),
  },
  {
    step: 1,
    daysAfterSignup: 2,
    subject: "Noch keine Beurteilung? Der schnellste Weg ist die Checkliste",
    html: (name) =>
      wrap(`<h1 style="font-size:18px">Hallo ${escapeHtml(name)}</h1>
<p>Kein Audio zur Hand? Die geführte Checkliste füllt branchentypische
Gefährdungen vor — Sie ergänzen nur Ihre Beobachtungen. In 10 Minuten steht
das Dokument inklusive Risikomatrix.</p>
${btn(`${APP_URL}/neu`, "Beurteilung starten")}`),
  },
  {
    step: 2,
    daysAfterSignup: 7,
    subject: "Praxisbeispiel: Werkstatt-Rundgang → audit-sichere GBU",
    html: (name) =>
      wrap(`<h1 style="font-size:18px">Hallo ${escapeHtml(name)}</h1>
<p>Beispiel aus der Praxis: Ein Tischlermeister geht 8 Minuten durch seine
Werkstatt und spricht ein, was er sieht — Kreissäge ohne Spaltkeil, gerissener
Absaugschlauch, Termindruck im Team. Ergebnis: vollständige Beurteilung mit
12 Gefährdungen, Risikomatrix nach Nohl und Maßnahmenplan mit Fristen.
Die psychische Belastung (Pflicht seit 2013) ist automatisch dabei.</p>
${btn(`${APP_URL}/neu`, "Eigenen Rundgang einsprechen")}`),
  },
  {
    step: 3,
    daysAfterSignup: 12,
    subject: "Gewerbeaufsicht & BG: Dokumentation zählt — Ihr Stand?",
    html: (name) =>
      wrap(`<h1 style="font-size:18px">Hallo ${escapeHtml(name)}</h1>
<p>Nach einem Arbeitsunfall fragt die Berufsgenossenschaft zuerst nach der
dokumentierten Gefährdungsbeurteilung. Mit dem Solo-Plan (79&nbsp;€/Monat)
dokumentieren Sie bis zu 5 Arbeitsbereiche inklusive Maßnahmen-Tracking und
jährlicher Wiedervorlage.</p>
${btn(`${APP_URL}/preise`, "Pläne ansehen")}`),
  },
];

export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const admin = createServiceClient();
  const { data: users } = await admin
    .from("users")
    .select("id, account_id, full_name, created_at")
    .gte("created_at", new Date(Date.now() - 21 * 86400_000).toISOString());

  let sent = 0;
  for (const u of users ?? []) {
    const ageDays = (Date.now() - new Date(u.created_at).getTime()) / 86400_000;
    const due = STEPS.filter((s) => ageDays >= s.daysAfterSignup);
    if (due.length === 0) continue;

    const { data: log } = await admin
      .from("user_drip_log")
      .select("step")
      .eq("user_id", u.id);
    const sentSteps = new Set((log ?? []).map((l) => l.step));
    const next = due.find((s) => !sentSteps.has(s.step));
    if (!next) continue;

    const { data: authUser } = await admin.auth.admin.getUserById(u.id);
    const email = authUser?.user?.email;
    if (!email) continue;

    const res = await sendEmail({
      to: email,
      subject: next.subject,
      html: next.html(u.full_name || "und willkommen"),
    });
    if (res.status === "sent") {
      await admin.from("user_drip_log").insert({
        user_id: u.id,
        account_id: u.account_id,
        step: next.step,
      });
      sent++;
    }
  }

  return NextResponse.json({ ok: true, emailsSent: sent });
}
