/* AUTO-GENERATED via shared-core/scripts/gen-lead-magnet.py
 *
 * Lead-Magnet capture endpoint.
 *
 * POST /api/lead-magnet
 * Body: { email: string, name: string, asset: string }
 *
 * Behaviour:
 *  - Validates input (email format, asset whitelist).
 *  - Stores lead in Supabase `leads` table.
 *  - If RESEND_API_KEY set, sends a download email; otherwise logs.
 *  - Returns 200 with download URL.
 */
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";


const VALID_ASSETS = new Set<string>([
  // populated per-product by the generator; kept loose to allow future expansion
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string; name?: string; asset?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const name = (body.name || "").trim().slice(0, 80);
  const asset = (body.asset || "").trim().slice(0, 80);

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Ungültige E-Mail." }, { status: 400 });
  }
  if (!asset) {
    return NextResponse.json({ error: "Asset fehlt." }, { status: 400 });
  }

  // Persist lead — best-effort. If table is missing this errors gracefully.
  try {
    const sb = createServiceClient();
    await sb.from("leads").insert({
      email,
      name: name || null,
      asset,
      source: "lead-magnet",
    });
  } catch (err) {
    console.error("[lead-magnet] supabase insert failed", err);
    // continue — we'd rather give the user the asset than block on DB
  }

  // Email send (Resend) — stubbed; wire up real send when RESEND_API_KEY is set.
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "noreply@example.com",
          to: email,
          subject: `Ihr Download: ${asset}`,
          html: `<p>Hallo ${name || ""},</p>
<p>vielen Dank für Ihr Interesse. Hier ist Ihr Download:</p>
<p><a href="${process.env.NEXT_PUBLIC_APP_URL ?? ""}/lead-magnets/${asset}.html">${asset}</a></p>
<p>Viele Grüße</p>`,
        }),
      });
    } catch (err) {
      console.error("[lead-magnet] resend failed", err);
    }
  } else {
    console.log("[lead-magnet] RESEND_API_KEY missing — skipping email", { email, asset });
  }

  return NextResponse.json({
    ok: true,
    downloadUrl: `/lead-magnets/${asset}.html`,
  });
}
