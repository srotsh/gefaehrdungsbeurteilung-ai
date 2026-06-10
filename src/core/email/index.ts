import "server-only";
import { Resend } from "resend";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  /** Optional: Override default from. Default kommt aus EMAIL_FROM env. */
  from?: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
}

let _client: Resend | null = null;
function getClient(): Resend {
  if (!_client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("[@flow/email] RESEND_API_KEY nicht gesetzt.");
    _client = new Resend(key);
  }
  return _client;
}

export async function sendEmail(
  opts: SendEmailOptions
): Promise<{ id: string | null; status: "sent" | "error"; error?: string }> {
  const from =
    opts.from ??
    process.env.EMAIL_FROM ??
    "Flow <noreply@flow.example>";
  try {
    const resp = await getClient().emails.send({
      from,
      to: opts.to,
      replyTo: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
      tags: opts.tags,
    });
    return { id: resp.data?.id ?? null, status: "sent" };
  } catch (err) {
    return {
      id: null,
      status: "error",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Pflicht-DSGVO-Footer für B2B-Outreach-Mails.
 */
export function dsgvoFooter(toEmail: string, appName: string, contactEmail: string): string {
  return `
<hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0">
<p style="font-size:11px;color:#94a3b8">
  Diese E-Mail wurde an ${escapeHtml(toEmail)} gesendet im Rahmen unserer
  Vertragserfüllung mit ${escapeHtml(appName)}. Bei Fragen oder zur Abmeldung
  antworten Sie bitte direkt an ${escapeHtml(contactEmail)}.
</p>
`;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Basis-Templates (Skelett). Apps bringen ihre eigenen branded Templates,
 * können aber auf diese als Fallback zurückgreifen.
 */
export const templates = {
  welcome(args: { firstName: string; appName: string; loginUrl: string }): string {
    return `
<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
  <h1 style="font-size:20px;margin:0 0 12px">Willkommen bei ${escapeHtml(args.appName)}, ${escapeHtml(args.firstName)}</h1>
  <p>Schön, dass Sie sich registriert haben. Sie können sich jederzeit anmelden:</p>
  <p style="margin:24px 0">
    <a href="${args.loginUrl}" style="background:#1d4ed8;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">
      Zum Login
    </a>
  </p>
</div>`;
  },

  documentReady(args: { firstName: string; appName: string; documentName: string; documentUrl: string }): string {
    return `
<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
  <h1 style="font-size:20px;margin:0 0 12px">${escapeHtml(args.documentName)} ist fertig</h1>
  <p>Hallo ${escapeHtml(args.firstName)}, Ihr Dokument wurde erstellt:</p>
  <p style="margin:24px 0">
    <a href="${args.documentUrl}" style="background:#1d4ed8;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">
      Dokument öffnen
    </a>
  </p>
  <p>Wichtig: Bitte prüfen Sie das Dokument vor offizieller Verwendung.</p>
</div>`;
  },

  paymentFailed(args: { firstName: string; appName: string; updateUrl: string }): string {
    return `
<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
  <h1 style="font-size:20px;margin:0 0 12px">Zahlung fehlgeschlagen</h1>
  <p>Hallo ${escapeHtml(args.firstName)}, leider konnten wir Ihre Zahlung nicht einziehen. Bitte aktualisieren Sie Ihre Zahlungsdaten:</p>
  <p style="margin:24px 0">
    <a href="${args.updateUrl}" style="background:#dc2626;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">
      Zahlungsdaten aktualisieren
    </a>
  </p>
</div>`;
  },
};
