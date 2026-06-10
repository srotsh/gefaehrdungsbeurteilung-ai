export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 prose prose-sm">
      <h1>Impressum</h1>
      <p><strong>Anbieter</strong><br />[Firmenname / Inhaber]<br />[Strasse Hausnummer]<br />[PLZ Ort]<br />Deutschland</p>
      <p><strong>Kontakt</strong><br />E-Mail: kontakt@gefaehrdungsbeurteilung.de<br />Telefon: [Telefonnummer]</p>
      <p><strong>Vertretungsberechtigt</strong><br />[Geschaeftsfuehrer / Inhaber]</p>
      <p><strong>Handelsregister</strong><br />Amtsgericht [Ort], HRB [Nummer]<br />USt-IdNr.: DE[xxxxxxxxx]</p>
      <p className="text-xs text-destructive font-semibold">Platzhalter-Anbieterdaten. Vor Live-Schaltung LEGAL-Block in shared-core/scripts/PRODUCT_REGISTRY.py fuellen und neu generieren.</p>
    </div>
  );
}
