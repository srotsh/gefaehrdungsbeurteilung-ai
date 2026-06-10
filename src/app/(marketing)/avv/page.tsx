/* AUTO-GENERATED via shared-core/scripts/gen-marketing.py */
"use client";

export default function AVVPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 prose prose-sm print:py-4">
      <div className="flex justify-end print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          Als PDF drucken / speichern
        </button>
      </div>
      <h1>Auftragsverarbeitungsvertrag (AVV)</h1>
      <p>
        Vereinbarung nach Art. 28 Abs. 3 DSGVO zwischen dem Kunden (Verantwortlicher) und{" "}
        <strong>[Firmenname / Inhaber]</strong>, [Strasse Hausnummer], [PLZ Ort] (Auftragsverarbeiter) fuer die
        Nutzung von <strong>GefaehrdungsbeurteilungAI</strong>.
      </p>
      <h2>1. Gegenstand und Dauer</h2>
      <p>
        Gegenstand ist die Verarbeitung personenbezogener Daten im Rahmen der Bereitstellung von
        GefaehrdungsbeurteilungAI als Software-as-a-Service. Die Dauer entspricht der Laufzeit des Nutzungsvertrags.
      </p>
      <h2>2. Art und Zweck der Verarbeitung</h2>
      <p>Arbeitsbereich per Sprach-Rundgang oder Checkliste erfassen → AI strukturiert Gefaehrdungen + STOP-Massnahmen → Risikomatrix (Nohl) → PDF + Massnahmen-Tracking mit Fristen</p>
      <h2>3. Kategorien betroffener Personen und Daten</h2>
      <ul>
        <li>Nutzer des Kunden (Stammdaten, Login-Daten)</li>
        <li>In Audioaufnahmen, Uploads und Dokumenten genannte Personen (Namen, Kontaktdaten, Inhalte der Aufnahme)</li>
      </ul>
      <h2>4. Pflichten des Auftragsverarbeiters</h2>
      <ul>
        <li>Verarbeitung nur auf dokumentierte Weisung des Kunden (Art. 28 Abs. 3 lit. a DSGVO)</li>
        <li>Vertraulichkeitsverpflichtung aller mit der Verarbeitung befassten Personen</li>
        <li>Technische und organisatorische Massnahmen nach Art. 32 DSGVO (Verschluesselung in Transit und at Rest, Zugriffskontrolle, Mandantentrennung per Row-Level-Security)</li>
        <li>Unterstuetzung bei Betroffenenrechten (Art. 15-21 DSGVO)</li>
        <li>Meldung von Datenschutzverletzungen ohne unangemessene Verzoegerung</li>
        <li>Loeschung oder Rueckgabe aller Daten nach Vertragsende nach Wahl des Kunden</li>
      </ul>
      <h2>5. Unterauftragsverarbeiter</h2>
      <p>Der Kunde genehmigt den Einsatz folgender Unterauftragsverarbeiter:</p>
      <ul>
        <li>Supabase Inc. — Datenbank, Auth, Storage (EU-Region Frankfurt)</li>
        <li>Vercel Inc. — Hosting (Region fra1)</li>
        <li>Anthropic PBC — KI-Textstrukturierung (USA, SCC)</li>
        <li>OpenAI LLC / Groq Inc. — Audio-Transkription (USA, SCC)</li>
        <li>Stripe Payments Europe Ltd. — Zahlungsverarbeitung</li>
        <li>Resend Inc. — transaktionale E-Mails (USA, SCC)</li>
      </ul>
      <p>
        Aenderungen werden dem Kunden vorab mitgeteilt; der Kunde hat ein Widerspruchsrecht aus
        wichtigem Grund.
      </p>
      <h2>6. Kontroll- und Nachweisrechte</h2>
      <p>
        Der Auftragsverarbeiter stellt alle erforderlichen Informationen zum Nachweis der
        Einhaltung der Pflichten nach Art. 28 DSGVO zur Verfuegung und ermoeglicht Audits in
        angemessenem Umfang nach Ankuendigung.
      </p>
      <h2>7. Schlussbestimmungen</h2>
      <p>
        Es gilt deutsches Recht. Bei Widerspruechen zwischen diesem AVV und dem Hauptvertrag geht
        dieser AVV hinsichtlich des Datenschutzes vor.
      </p>
      <p className="text-xs text-muted-foreground">
        Stand: 2026-06-10. {/* TODO(verify): Vor Live-Schaltung von Datenschutzberater/Anwalt pruefen lassen. */}
      </p>
      <p className="text-xs text-destructive font-semibold">Platzhalter-Anbieterdaten. Vor Live-Schaltung LEGAL-Block in shared-core/scripts/PRODUCT_REGISTRY.py fuellen und neu generieren.</p>
    </div>
  );
}
