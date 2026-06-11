/* AUTO-GENERATED via shared-core/scripts/gen-marketing-layout.py */
import Link from "next/link";


export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen flex flex-col bg-parchment-100 text-ink">
      <header className="sticky top-0 z-30 border-b border-parchment-200/80 bg-parchment-100/85 backdrop-blur supports-[backdrop-filter]:bg-parchment-100/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="font-display text-lg font-bold tracking-tight text-ink">
            GefaehrdungsbeurteilungAI
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <Link href="/ratgeber" className="text-ink-muted hover:text-cognac-700 transition">
              Ratgeber
            </Link>
            <Link href="/preise" className="text-ink-muted hover:text-cognac-700 transition">
              Preise
            </Link>
            <Link href="/login" className="text-ink-muted hover:text-cognac-700 transition">
              Anmelden
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-full bg-cognac-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-cognac-700"
            >
              Kostenlos starten
            </Link>
          </nav>

          {/* Mobile nav (no-JS via details) */}
          <details className="md:hidden relative">
            <summary className="list-none cursor-pointer rounded-md p-2 hover:bg-parchment-200">
              <span className="sr-only">Menü</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6"  x2="21" y2="6"  />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-parchment-300 bg-white p-2 shadow-card">
              <Link href="/ratgeber" className="block rounded-md px-3 py-2 text-sm hover:bg-parchment-100">Ratgeber</Link>
              <Link href="/preise" className="block rounded-md px-3 py-2 text-sm hover:bg-parchment-100">Preise</Link>
              <Link href="/login" className="block rounded-md px-3 py-2 text-sm hover:bg-parchment-100">Anmelden</Link>
              <Link href="/signup" className="mt-1 block rounded-md bg-cognac-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-cognac-700">
                Kostenlos starten
              </Link>
            </div>
          </details>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-parchment-200/80 bg-parchment-200/50">
        <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-display text-lg font-bold text-ink">GefaehrdungsbeurteilungAI</div>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
              Gefaehrdungsbeurteilung nach Paragraph 5/6 ArbSchG. Audit-sicher. In Stunden statt Wochen.
            </p>
            <p className="mt-4 text-xs text-ink-subtle">
              DSGVO-konform · EU-Hosting · Audio-Daten gelöscht nach 30 Tagen
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">Produkt</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/" className="text-ink-muted hover:text-cognac-700 transition">Übersicht</Link></li>
              <li><Link href="/preise" className="text-ink-muted hover:text-cognac-700 transition">Preise</Link></li>
              <li><Link href="/ratgeber" className="text-ink-muted hover:text-cognac-700 transition">Ratgeber</Link></li>
              <li><Link href="/avv" className="text-ink-muted hover:text-cognac-700 transition">AVV (Art. 28 DSGVO)</Link></li>
              <li><Link href="/signup" className="text-ink-muted hover:text-cognac-700 transition">Kostenlos starten</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-parchment-200/80">
          <div className="mx-auto max-w-6xl px-6 py-5 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-subtle">
            <span>© {year} GefaehrdungsbeurteilungAI. Alle Rechte vorbehalten.</span>
            <nav className="flex gap-5">
              <Link href="/impressum" className="hover:text-cognac-700 transition">Impressum</Link>
              <Link href="/datenschutz" className="hover:text-cognac-700 transition">Datenschutz</Link>
              <Link href="/agb" className="hover:text-cognac-700 transition">AGB</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
