# CLAUDE.md — GefaehrdungsbeurteilungAI

> Produkt #7 im Flow-Portfolio. Standalone-App nach dem Copy-Core-Muster
> (`src/core/*` = `@flow/*`, gesynct via `scripts/sync-core.ps1` aus
> `../../shared-core`). Gebaut in Phase 3 des Portfolio-Audits (2026-06-10)
> gegen die JahresabrechnungAI-Completeness-Bar (`../../audit/00-inventory.md`).

## Was ist das?

Gefährdungsbeurteilung nach **§5/§6 ArbSchG**: Der Nutzer (Arbeitgeber, SiFa,
externer Sicherheitsberater) geht per Sprach-Rundgang oder geführter Checkliste
durch einen Arbeitsbereich → Claude strukturiert in Tätigkeiten → Gefährdungen
(10-Faktoren-Katalog inkl. **psychische Belastung**, Pflicht seit 2013) →
STOP-Maßnahmen → deterministische **Risikomatrix nach Nohl**
([nohl.ts](src/lib/risiko/nohl.ts), getestet) → Review-Editor → PDF/CSV →
Maßnahmen-Tracking mit Fristen-Remindern und jährlicher Wiedervorlage.

## Architektur-Landkarte

- **Domänenmodell**: [validations.ts](src/lib/validations.ts) (Zod, Single Source);
  `gbus.gbu_data` (JSONB) hält die strukturierte GBU, `massnahmen` wird bei
  Finalisierung extrahiert (Tracking). Migrationen: `002_…_schema.sql`.
- **AI**: [system-prompt.ts](src/lib/ai/system-prompt.ts) (versioniert, `PROMPT_VERSION`),
  Branchen-Kataloge in [branchen/index.ts](src/lib/branchen/index.ts) (10 Branchen).
  Zahlen kommen NIE vom LLM — Risiko rechnet `lib/risiko/nohl.ts`.
- **API**: `api/generate` + `api/transcribe` mit Session+Ownership-Guard
  (`getApiIdentity`), Plan-Limit (402), Rate-Limits, Usage-/Cost-Logging.
- **Crons** (vercel.json): `cleanup-audio` (DSGVO 30 Tage), `lead-drip` (Leads),
  `reminders` (Maßnahmen-Fristen + Wiedervorlage), `user-drip` (Trial D0/D2/D7/D12).
- **Export**: PDF ([gbu-doc.tsx](src/lib/pdf/gbu-doc.tsx): Deckblatt, Gefährdungstabellen,
  Maßnahmenplan, Unterschriften, Revisionsstand; Watermark bei Entwurf/Free) +
  CSV-Maßnahmenplan (`/massnahmen/export`).
- **Marketing**: generiert aus `shared-core/scripts` (Landing, Preise, 10 Ratgeber
  inkl. Branchen-Muster, Lead-Magnet "GBU-Pflicht-Check", AVV/Datenschutz/Impressum).
  NIE direkt editieren — Registry/Generator ändern und neu generieren.

## Pricing (Katalog `@flow/billing`)

Free (1 GBU/Monat, Watermark) · Solo/Starter 79 € · Pro 149 €.
Berater-Tier (299 €, Multi-Client) = Backlog (braucht Plan-Typ-Erweiterung).
Arbeitsbereich-Limit des Solo-Plans (5) ist noch NICHT enforced (TODO).

## Tests

```bash
pnpm test          # Nohl-Unit-Tests + (gated) Generation-Evals
EVAL_LIVE=1 pnpm test   # echte Claude-Calls (braucht ANTHROPIC_API_KEY)
UPDATE_SNAPSHOTS=1 EVAL_LIVE=1 pnpm test  # Golden-Snapshots refreshen
```

Fixture: [werkstatt-rundgang-smoke.json](tests/fixtures/werkstatt-rundgang-smoke.json)
(Plan-Szenario "Kreissäge ohne Spaltkeil").

## Offene Punkte (Stand Launch)

- TODO(verify): Nohl-Stufen-Schwellen (≤6 / ≤12 / >12) mit SiFa/DGUV-Quelle abgleichen.
- ROI-Rechner auf der Landing (Generator unterstützt keine produktspezifischen
  Komponenten im Hero) — P2.
- Sentry/Monitoring: portfolio-weit offen (P1-2 im Audit-Backlog).
- Supabase-Projekt, Stripe-Preise, Resend-Domain, Vercel-Projekt: extern anlegen,
  ENV-Slots aus `.env.example` füllen, Migrationen pushen, Storage-Bucket
  `gefaehrdungsbeurteilung-recordings` (privat) anlegen.
