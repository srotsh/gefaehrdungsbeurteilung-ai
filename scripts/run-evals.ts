/**
 * Eval-Runner. Aufruf: `pnpm tsx scripts/run-evals.ts [--tag=<tag>]`
 *
 * Lädt:
 *   - Alle Fixtures aus `tests/fixtures/`
 *   - App-spezifische Eval-Registrierung aus `tests/evals/index.ts`
 *
 * Liefert formatierten Report. Exit-Code:
 *   0  alle passed
 *   1  mindestens eine assertion failed
 *
 * In CI als optionaler Job mit `EVAL_LIVE=1`-ENV laufen lassen — ohne
 * dieses Flag werden LLM-Calls geskippt (nur Schema-/Snapshot-Asserts).
 */

import { runAllEvals, formatEvalReport } from "@flow/ai";

// App-spezifische Eval-Registrierung — registriert via registerEval()
// import "../tests/evals/index";  // <-- in App-Code anpassen

async function main() {
  const tagArg = process.argv.find((a) => a.startsWith("--tag="));
  const filterTag = tagArg ? tagArg.split("=")[1] : undefined;

  if (!process.env.EVAL_LIVE) {
    console.log("EVAL_LIVE nicht gesetzt — nur strukturelle Checks. LLM-Calls werden ggf. übersprungen.");
  }

  const results = await runAllEvals({ filterTag });
  console.log(formatEvalReport(results));

  const failed = results.filter((r) => !r.passed).length;
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Eval-Runner crashed:", err);
  process.exit(2);
});
