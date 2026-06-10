# Eval-Suite

Pro Produkt eigene Eval-Tests gegen anonymisierte Realdaten.

## Setup

1. Anonymisierte Test-Inputs als JSON in `tests/fixtures/<name>.json` ablegen.
   Schema:
   ```json
   {
     "input": { "transcript": "..." },
     "expected": { "topCount": 5 },
     "tags": ["smoke", "weg"],
     "description": "Standard 5-TOP Versammlung"
   }
   ```

2. `tests/evals/index.ts` anlegen — registriert alle Eval-Specs:

```ts
import { registerEval, loadAllFixtures, assertSchema, assertMaxPruefenMarkers, assertSnapshot } from "@flow/ai";
import path from "node:path";
import { ProtokollDataSchema } from "@/lib/validations";
import { generateProtokoll } from "@/lib/ai/generate";  // app-spezifisch

const fixtures = loadAllFixtures(path.join(__dirname, "../fixtures"));

for (const [name, fix] of fixtures) {
  registerEval({
    name,
    tags: fix.tags,
    input: fix.input as { transcript: string },
    generate: async (i) => generateProtokoll(i),
    assertions: [
      assertSchema(ProtokollDataSchema),
      assertMaxPruefenMarkers(3),
      assertSnapshot({
        dir: path.join(__dirname, "../__snapshots__"),
        name,
        ignorePaths: [".*\\.created_at", ".*\\.id"],
      }),
    ],
  });
}
```

3. `package.json` Scripts ergänzen:
   ```json
   "scripts": {
     "eval": "tsx scripts/run-evals.ts",
     "eval:smoke": "tsx scripts/run-evals.ts --tag=smoke",
     "eval:update-snapshots": "UPDATE_SNAPSHOTS=1 tsx scripts/run-evals.ts"
   }
   ```

## Ausführen

```bash
pnpm eval                  # alle Evals
pnpm eval:smoke            # nur smoke-tagged
pnpm eval:update-snapshots # Snapshots refreshen nach absichtlichen Output-Änderungen
EVAL_LIVE=1 pnpm eval      # echte LLM-Calls (kostet Tokens)
```

## CI-Integration

Eval-Suite läuft NICHT bei jedem Push (zu teuer). Empfohlener Pattern:
- Auf `main`: nightly cron job mit `EVAL_LIVE=1`
- Bei PRs: nur strukturelle Asserts (Schema + Snapshot) — kein LLM-Call

## Fixture-Hygiene

- Niemals echte Klarnamen, IBANs, Patientendaten committen
- `tests/__snapshots__/` ist Output, gehört in Versionskontrolle (für Diff-Reviews)
- Bei ECHTEN sensiblen Daten: in separates privates Repo (z.B. `tests/fixtures-private/`) und in `.gitignore`
