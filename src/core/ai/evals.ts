/**
 * Eval-Harness für Prompt-Tests.
 *
 * Zwei Modi:
 *  1. Online — echte LLM-Calls gegen Fixtures (kostet Tokens, langsam)
 *  2. Offline — vorberechnete Outputs aus Snapshots (für CI)
 *
 * Apps registrieren ihre Evals einmalig:
 * ```ts
 * import { registerEval } from "@flow/ai";
 * import { generateProtokollFromTranscript } from "@/lib/ai/generate-protokoll";
 * import { WEG_MINI_TRANSCRIPT, WEG_MINI_FIXTURE_META } from "@flow/ai";
 *
 * registerEval({
 *   name: "weg-mini-baseline",
 *   input: { transcript: WEG_MINI_TRANSCRIPT, wegName: "...", datum: "...", ort: "..." },
 *   generate: (i) => generateProtokollFromTranscript(i),
 *   assertions: [
 *     {
 *       name: "TOP-Count stimmt",
 *       check: (out) => out.tagesordnungspunkte.length === WEG_MINI_FIXTURE_META.expectedTopCount,
 *     },
 *     // …
 *   ],
 * });
 * ```
 */

export interface EvalAssertion<TOutput> {
  name: string;
  check: (output: TOutput) => boolean | string;
}

export interface EvalSpec<TInput, TOutput> {
  name: string;
  input: TInput;
  generate: (input: TInput) => Promise<TOutput>;
  assertions: Array<EvalAssertion<TOutput>>;
  /** Optional: Tags für selektives Ausführen, z. B. ["smoke", "weg"]. */
  tags?: string[];
}

export interface EvalResult<TOutput> {
  name: string;
  passed: boolean;
  failures: string[];
  output: TOutput;
  durationMs: number;
}

const _registry: Array<EvalSpec<unknown, unknown>> = [];

export function registerEval<TIn, TOut>(spec: EvalSpec<TIn, TOut>): void {
  _registry.push(spec as EvalSpec<unknown, unknown>);
}

export async function runEval<TIn, TOut>(
  spec: EvalSpec<TIn, TOut>
): Promise<EvalResult<TOut>> {
  const start = Date.now();
  let output: TOut;
  try {
    output = await spec.generate(spec.input);
  } catch (err) {
    return {
      name: spec.name,
      passed: false,
      failures: [`generate threw: ${err instanceof Error ? err.message : String(err)}`],
      output: undefined as unknown as TOut,
      durationMs: Date.now() - start,
    };
  }
  const durationMs = Date.now() - start;

  const failures: string[] = [];
  for (const a of spec.assertions) {
    let r: boolean | string;
    try {
      r = a.check(output);
    } catch (err) {
      r = `threw: ${err instanceof Error ? err.message : String(err)}`;
    }
    if (r !== true) {
      failures.push(typeof r === "string" ? `${a.name}: ${r}` : a.name);
    }
  }
  return {
    name: spec.name,
    passed: failures.length === 0,
    failures,
    output,
    durationMs,
  };
}

export async function runAllEvals(opts?: {
  filterTag?: string;
}): Promise<EvalResult<unknown>[]> {
  const out: EvalResult<unknown>[] = [];
  for (const spec of _registry) {
    if (opts?.filterTag && !spec.tags?.includes(opts.filterTag)) continue;
    out.push(await runEval(spec));
  }
  return out;
}

/**
 * Pretty-Print-Reporter für Konsolen-Output (CI / lokal).
 */
export function formatEvalReport(results: EvalResult<unknown>[]): string {
  const lines: string[] = [];
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  lines.push(`\n=== Eval Report — ${passed}/${total} passed ===\n`);
  for (const r of results) {
    const icon = r.passed ? "✓" : "✗";
    lines.push(`${icon} ${r.name} (${r.durationMs} ms)`);
    for (const f of r.failures) {
      lines.push(`    - ${f}`);
    }
  }
  return lines.join("\n");
}
