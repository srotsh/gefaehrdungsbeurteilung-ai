# GefaehrdungsbeurteilungAI

Gefaehrdungsbeurteilung nach Paragraph 5/6 ArbSchG. Audit-sicher. In Stunden statt Wochen.

> Standalone Next.js-App im Flow-Portfolio. `src/core/` ist eine Kopie der
> Shared-Engine aus `C:\Users\Seb\Documents\shared-core` — nicht direkt
> editieren. Updates per `pnpm core:sync`.

## Domain-Workflow

Arbeitsbereich per Sprach-Rundgang oder Checkliste erfassen -> AI strukturiert Gefaehrdungen + STOP-Massnahmen -> Risikomatrix (Nohl) -> PDF + Massnahmen-Tracking mit Fristen

## Lokal entwickeln

```bash
pnpm install
cp .env.example .env.local         # Werte einsetzen
pnpm dev                           # http://localhost:3000
```

## Deployment

Siehe ausfuehrliche Anleitung in
`C:\Users\Seb\Documents\shared-core\docs\DEPLOY.md`.

Kurzversion:

1. Supabase-Projekt anlegen, Migrationen aus `supabase/migrations/` ausfuehren.
2. Stripe-Setup: Products + Prices anlegen, Webhook auf
   `https://<domain>/api/stripe/webhook` zeigen.
3. Vercel: Repo importieren, ENVs aus `.env.example` setzen, deployen.

### Produkt-spezifisches Setup

- Storage-Bucket: `gefaehrdungsbeurteilung-recordings` (privat)
- Branchen-Kataloge: `src/lib/branchen/` (10 Branchen)

## Engine-Sync

```powershell
pwsh ./scripts/sync-core.ps1
```

## Tests / Evals

```bash
pnpm test          # Vitest
pnpm type-check    # TypeScript
pnpm eval          # Eval-Suite (Schema/Snapshot)
EVAL_LIVE=1 pnpm eval   # Mit echten LLM-Calls (kostet Tokens)
```

## Lizenz

Proprietaer — internal use only.
