/**
 * Snapshot-basierte Eval-Assertion: vergleicht Output gegen einen
 * gespeicherten JSON-Snapshot. Gut fuer Regression-Tests, sobald ein Output
 * als "richtig" abgesegnet wurde.
 *
 * Workflow:
 *   1. Erster Run: kein Snapshot vorhanden -> wird gespeichert, Test gilt als
 *      "passed" (mit Hinweis, dass Baseline angelegt wurde).
 *   2. Folgende Runs: Output wird gegen Snapshot verglichen. Bei Diff:
 *      passed=false, failures listet die Pfade.
 *   3. Wenn Output absichtlich anders sein soll: Snapshot loeschen oder
 *      `UPDATE_SNAPSHOTS=1` setzen, Test einmal laufen lassen.
 *
 * Snapshots werden als pretty-printed JSON in `<dir>/<name>.json` abgelegt.
 */

import "server-only";
import * as fs from "node:fs";
import * as path from "node:path";
import type { EvalAssertion } from "./evals";

export interface SnapshotOpts {
  /** Verzeichnis zum Ablegen der Snapshots, z.B. "./tests/__snapshots__/". */
  dir: string;
  /** Eindeutiger Name pro Snapshot — wird Dateiname. */
  name: string;
  /**
   * Pfade die beim Diff IGNORIERT werden (z.B. timestamps, IDs).
   * Dot-separated, regex-faehig: "metadata.\\d+.created_at".
   */
  ignorePaths?: string[];
  /** Override via ENV: setze UPDATE_SNAPSHOTS=1 zum Auto-Update. */
  updateOnEnv?: string;
}

export function assertSnapshot<T>(opts: SnapshotOpts): EvalAssertion<T> {
  const filePath = path.join(opts.dir, `${opts.name}.json`);
  const envFlag = opts.updateOnEnv ?? "UPDATE_SNAPSHOTS";

  return {
    name: `matches snapshot ${opts.name}`,
    check: (out) => {
      try {
        fs.mkdirSync(opts.dir, { recursive: true });
      } catch (err) {
        return `Snapshot-Dir nicht anlegbar: ${(err as Error).message}`;
      }

      const normalized = normalizeForDiff(out, opts.ignorePaths ?? []);
      const json = JSON.stringify(normalized, null, 2);

      if (process.env[envFlag] === "1") {
        fs.writeFileSync(filePath, json, "utf-8");
        return true;
      }

      if (!fs.existsSync(filePath)) {
        // Erste Aufzeichnung -> als Baseline speichern, passing
        fs.writeFileSync(filePath, json, "utf-8");
        return `Baseline neu angelegt: ${filePath}` as unknown as string;
        // Hinweis: assertion gilt als FAIL (string), damit Run sichtbar
        // markiert ist. Beim 2. Run gilt sie als passed bei Match.
      }

      const stored = fs.readFileSync(filePath, "utf-8");
      if (stored === json) return true;

      return `Snapshot-Diff. UPDATE_SNAPSHOTS=1 zum Aktualisieren. Datei: ${filePath}`;
    },
  };
}

function normalizeForDiff(value: unknown, ignorePaths: string[], pathSoFar: string[] = []): unknown {
  if (matchesAny(pathSoFar, ignorePaths)) return "<ignored>";
  if (Array.isArray(value)) {
    return value.map((v, i) => normalizeForDiff(v, ignorePaths, [...pathSoFar, String(i)]));
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(value).sort()) {
      out[k] = normalizeForDiff((value as Record<string, unknown>)[k], ignorePaths, [...pathSoFar, k]);
    }
    return out;
  }
  return value;
}

function matchesAny(pathSegments: string[], patterns: string[]): boolean {
  if (patterns.length === 0) return false;
  const joined = pathSegments.join(".");
  for (const p of patterns) {
    try {
      if (new RegExp("^" + p + "$").test(joined)) return true;
    } catch {
      if (joined === p) return true;
    }
  }
  return false;
}
