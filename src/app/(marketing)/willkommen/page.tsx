import Link from "next/link";

export default function WillkommenPage() {
  return (
    <div className="space-y-24 pb-24">
      <section className="mx-auto max-w-4xl px-6 pt-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Werkstatt-Rundgang einsprechen. Audit-sichere Gefaehrdungsbeurteilung erhalten.</h1>
        <p className="mt-6 text-lg text-muted-foreground">Jeder Arbeitgeber muss Gefaehrdungsbeurteilungen dokumentieren (Paragraph 5/6 ArbSchG). Sie gehen durch den Betrieb und sprechen, was Sie sehen - wir erzeugen das vollstaendige Dokument mit Risikomatrix, STOP-Massnahmen und Fristen. Inklusive psychischer Belastung, die 80 Prozent der Betriebe vergessen.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/signup" className="rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90">
            Kostenlos starten
          </Link>
          <Link href="/preise" className="rounded-md border px-6 py-3 text-base font-medium hover:bg-muted">
            Preise ansehen
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-bold mb-4">Das Problem</h2>
        <p className="text-base leading-relaxed text-muted-foreground">Gewerbeaufsicht und Berufsgenossenschaft pruefen die Dokumentation - fehlt sie, drohen Bussgelder und nach einem Arbeitsunfall persoenliche Haftung des Geschaeftsfuehrers. Externe Berater kosten 1.500 bis 5.000 Euro pro Beurteilung, Word-Vorlagen veralten und niemand verfolgt die Massnahmen nach.</p>
      </section>
      <section className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-bold mb-6">So funktioniert es</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <div className="text-xs font-bold text-primary uppercase">Schritt 1</div>
            <h3 className="mt-2 font-semibold">Branche waehlen</h3>
            <p className="mt-2 text-sm text-muted-foreground">10 Branchen-Kataloge von Buero bis Produktion laden die typischen Gefaehrdungsfaktoren vor.</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="text-xs font-bold text-primary uppercase">Schritt 2</div>
            <h3 className="mt-2 font-semibold">Rundgang einsprechen</h3>
            <p className="mt-2 text-sm text-muted-foreground">Per Smartphone durch den Arbeitsbereich gehen und beschreiben - oder die gefuehrte Checkliste ausfuellen.</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="text-xs font-bold text-primary uppercase">Schritt 3</div>
            <h3 className="mt-2 font-semibold">Pruefen + Tracking</h3>
            <p className="mt-2 text-sm text-muted-foreground">AI strukturiert nach Gefaehrdungsfaktoren, berechnet die Risikomatrix, Sie pruefen und exportieren. Fristen-Reminder inklusive.</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl font-bold mb-6">Funktionen</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Paragraph 5/6 ArbSchG komplett</h3>
            <p className="mt-2 text-sm text-muted-foreground">Alle Gefaehrdungsfaktoren: mechanisch, elektrisch, Gefahrstoffe, Brand, Laerm, Klima, physisch - und psychische Belastung (Pflicht seit 2013).</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Risikomatrix nach Nohl</h3>
            <p className="mt-2 text-sm text-muted-foreground">Wahrscheinlichkeit x Schadensschwere pro Gefaehrdung, automatisch berechneter Handlungsbedarf.</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">STOP-Massnahmen</h3>
            <p className="mt-2 text-sm text-muted-foreground">Substitution, Technisch, Organisatorisch, Persoenlich - in der rechtlich geforderten Reihenfolge, mit Verantwortlichem und Frist.</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Massnahmen-Tracking</h3>
            <p className="mt-2 text-sm text-muted-foreground">Dashboard offener Massnahmen mit Fristen-Erinnerung per E-Mail - inklusive Wirksamkeitspruefung.</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Wiedervorlage</h3>
            <p className="mt-2 text-sm text-muted-foreground">Jaehrliche Revision, neue Maschine, Unfall, Umzug - das System erinnert, bevor die Beurteilung veraltet.</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">DSGVO + AVV</h3>
            <p className="mt-2 text-sm text-muted-foreground">EU-Hosting, Audio nach 30 Tagen geloescht, AVV zum Download.</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl font-bold mb-6">Haeufige Fragen</h2>
        <div className="space-y-3">
          <details className="rounded-md border bg-card p-4">
            <summary className="cursor-pointer font-medium">Ist das rechtlich ausreichend?</summary>
            <p className="mt-2 text-sm text-muted-foreground">Wir liefern die strukturierte Dokumentation nach Paragraph 5/6 ArbSchG mit Risikomatrix und Massnahmenplan. Die inhaltliche Verantwortung traegt der Arbeitgeber bzw. die Fachkraft fuer Arbeitssicherheit.</p>
          </details>
          <details className="rounded-md border bg-card p-4">
            <summary className="cursor-pointer font-medium">Welche Branchen?</summary>
            <p className="mt-2 text-sm text-muted-foreground">Buero, Handwerk/Werkstatt, Bau, Gastronomie, Einzelhandel, Logistik/Lager, Pflege, Kfz, Friseur/Kosmetik, Produktion - weitere auf Anfrage.</p>
          </details>
          <details className="rounded-md border bg-card p-4">
            <summary className="cursor-pointer font-medium">Fuer SiFa-Berater geeignet?</summary>
            <p className="mt-2 text-sm text-muted-foreground">Ja - Sie verwalten mehrere Arbeitsbereiche und exportieren pro Kunde ein vollstaendiges Dokument mit Ihrem Briefkopf (Pro-Plan).</p>
          </details>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 text-center rounded-lg border bg-card p-8">
        <h2 className="text-2xl font-bold">Bereit, loszulegen?</h2>
        <p className="mt-2 text-muted-foreground">Kostenloser Start, keine Kreditkarte noetig.</p>
        <Link href="/signup" className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90">
          Konto erstellen
        </Link>
      </section>
    </div>
  );
}
