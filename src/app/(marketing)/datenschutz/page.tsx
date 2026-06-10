export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 prose prose-sm">
      <h1>Datenschutzerklaerung</h1>
      <p>Verarbeitung personenbezogener Daten bei Nutzung von GefaehrdungsbeurteilungAI.</p>
      <h2>1. Verantwortlicher</h2>
      <p>[Firmenname / Inhaber], [Strasse Hausnummer], [PLZ Ort] — siehe <a href="/impressum">Impressum</a>.</p>
      <h2>2. Verarbeitete Daten und Rechtsgrundlagen</h2>
      <ul>
        <li>Stammdaten (Name, E-Mail, Firma) — Art. 6 Abs. 1 lit. b DSGVO (Vertrag)</li>
        <li>Audiodateien zur Transkription — automatische Loeschung nach 30 Tagen</li>
        <li>Inhalte hochgeladener Dokumente und generierte Dokumente — Speicherung im Account, bis der Nutzer sie loescht</li>
        <li>Zahlungsdaten — verarbeitet durch Stripe; wir speichern keine Kartendaten</li>
        <li>Nutzungsstatistik — Plausible Analytics, cookielos, ohne personenbezogene Profile (Art. 6 Abs. 1 lit. f DSGVO)</li>
      </ul>
      <h2>3. Auftragsverarbeitung (AVV)</h2>
      <p>
        Unseren Auftragsverarbeitungsvertrag nach Art. 28 DSGVO koennen Sie jederzeit unter{" "}
        <a href="/avv">/avv</a> abrufen und als PDF drucken/speichern.
      </p>
      <h2>4. Auftragsverarbeiter und Drittlandtransfer</h2>
      <ul>
        <li><strong>Supabase</strong> (Datenbank, Auth, Storage) — EU-Region (Frankfurt)</li>
        <li><strong>Vercel</strong> (Hosting) — Serverless-Funktionen in der Region Frankfurt (fra1)</li>
        <li><strong>Stripe</strong> (Zahlungsverarbeitung) — Drittlandtransfer in die USA auf Basis des EU-US Data Privacy Framework bzw. Standardvertragsklauseln (SCC)</li>
        <li><strong>Anthropic</strong> (Claude API, Text-Strukturierung) — USA; Uebermittlung auf Basis von Standardvertragsklauseln. Inputs/Outputs werden von Anthropic nicht fuer Modell-Training verwendet. {/* TODO(verify): Zero-Data-Retention-Status des konkreten API-Vertrags pruefen */}</li>
        <li><strong>OpenAI / Groq</strong> (Whisper-Transkription) — USA; Standardvertragsklauseln; keine Verwendung der API-Daten fuer Training {/* TODO(verify): Provider-DPAs verlinken */}</li>
        <li><strong>Resend</strong> (transaktionale E-Mails) — USA; Standardvertragsklauseln</li>
      </ul>
      <h2>5. Speicherdauer</h2>
      <p>
        Audiodateien: 30 Tage. Account-Daten und Dokumente: bis zur Loeschung durch den Nutzer
        oder Kontoschliessung. Gesetzliche Aufbewahrungspflichten bleiben unberuehrt.
      </p>
      <h2>6. Ihre Rechte</h2>
      <p>
        Auskunft, Berichtigung, Loeschung, Einschraenkung, Datenuebertragbarkeit, Widerspruch
        (Art. 15-21 DSGVO) sowie Beschwerde bei einer Aufsichtsbehoerde. Anfragen an die im
        Impressum genannte Adresse.
      </p>
      <p className="text-xs text-destructive font-semibold">Platzhalter-Anbieterdaten. Vor Live-Schaltung LEGAL-Block in shared-core/scripts/PRODUCT_REGISTRY.py fuellen und neu generieren.</p>
    </div>
  );
}
