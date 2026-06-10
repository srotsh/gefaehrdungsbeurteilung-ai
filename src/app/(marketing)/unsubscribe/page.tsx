/* AUTO-GENERATED via shared-core/scripts/gen-unsubscribe.py */
import type { Metadata } from "next";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { Section, Container, Eyebrow } from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Abmelden — GefaehrdungsbeurteilungAI",
  description: "Sie wurden von der E-Mail-Liste abgemeldet.",
  alternates: { canonical: "/unsubscribe" },
  robots: { index: false, follow: false },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SearchParams = { email?: string; token?: string };

async function unsubscribe(email: string): Promise<"ok" | "already" | "not-found" | "error"> {
  const sb = createServiceClient();
  const { data: existing, error: selErr } = await sb
    .from("leads")
    .select("id, unsubscribed_at")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (selErr) return "error";
  if (!existing) return "not-found";
  if (existing.unsubscribed_at) return "already";

  const { error: updErr } = await sb
    .from("leads")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("email", email);

  return updErr ? "error" : "ok";
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const rawEmail = (params.email ?? "").trim().toLowerCase();
  const valid = EMAIL_RE.test(rawEmail);
  const result = valid ? await unsubscribe(rawEmail) : "invalid";

  return (
    <>
      <Section tone="default" className="pt-20 pb-12 md:pt-24">
        <Container size="narrow" className="text-center">
          <Eyebrow>E-Mail-Abmeldung</Eyebrow>
          {result === "ok" && (
            <>
              <h1 className="mt-4 font-display text-display-lg text-ink">
                Sie sind abgemeldet.
              </h1>
              <p className="mt-5 text-lg text-ink-muted max-w-xl mx-auto">
                Wir senden keine Folge-E-Mails mehr an{" "}
                <span className="font-semibold text-ink">{rawEmail}</span>.
                Falls Sie sich versehentlich abgemeldet haben, können Sie sich
                jederzeit erneut für unsere Lead-Magnete eintragen.
              </p>
            </>
          )}
          {result === "already" && (
            <>
              <h1 className="mt-4 font-display text-display-lg text-ink">
                Bereits abgemeldet.
              </h1>
              <p className="mt-5 text-lg text-ink-muted max-w-xl mx-auto">
                Diese E-Mail-Adresse ist bereits aus unserem Verteiler entfernt.
                Es passiert nichts mehr.
              </p>
            </>
          )}
          {result === "not-found" && (
            <>
              <h1 className="mt-4 font-display text-display-lg text-ink">
                E-Mail nicht gefunden.
              </h1>
              <p className="mt-5 text-lg text-ink-muted max-w-xl mx-auto">
                Wir konnten <span className="font-semibold">{rawEmail}</span>{" "}
                nicht in unserem Verteiler finden. Falls Sie weiterhin E-Mails
                erhalten, antworten Sie bitte auf eine davon — wir kümmern uns
                manuell.
              </p>
            </>
          )}
          {(result === "invalid" || !valid) && (
            <>
              <h1 className="mt-4 font-display text-display-lg text-ink">
                Ungültiger Link.
              </h1>
              <p className="mt-5 text-lg text-ink-muted max-w-xl mx-auto">
                Der Abmelde-Link ist ungültig oder abgelaufen. Bitte antworten
                Sie auf eine unserer E-Mails — wir entfernen Sie manuell.
              </p>
            </>
          )}
          {result === "error" && (
            <>
              <h1 className="mt-4 font-display text-display-lg text-ink">
                Etwas ist schiefgelaufen.
              </h1>
              <p className="mt-5 text-lg text-ink-muted max-w-xl mx-auto">
                Bitte versuchen Sie es in ein paar Minuten erneut, oder
                antworten Sie direkt auf eine unserer E-Mails.
              </p>
            </>
          )}

          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-parchment-300 bg-white px-7 py-3 text-sm font-semibold text-ink hover:border-cognac-300"
            >
              Zur Startseite
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
