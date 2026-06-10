/**
 * Lade Fixture-Dateien (anonymisierte Eingabedaten) fuer Eval-Tests.
 *
 * Konvention: Apps legen ihre Fixtures unter `tests/fixtures/<name>.json`
 * ab (Klartext-JSON, keine sensiblen Daten — vor Commit anonymisieren).
 *
 * Beispiel-Fixture:
 * {
 *   "input": { "transcript": "...", "wegName": "Beispiel-WEG" },
 *   "expected": {
 *     "topCount": 5,
 *     "shouldContain": ["Hausgeld", "Versicherung"],
 *     "shouldNotContain": ["[PRUEFEN]"]
 *   }
 * }
 */

import "server-only";
import * as fs from "node:fs";
import * as path from "node:path";

export interface FixtureFile<TInput = unknown, TExpected = unknown> {
  input: TInput;
  expected: TExpected;
  /** Optionale Tags fuer Filter im Eval-Run, z.B. ["smoke", "bgh"]. */
  tags?: string[];
  /** Optional: Beschreibung, was diese Fixture testen soll. */
  description?: string;
}

/**
 * Laedt eine einzelne Fixture-Datei.
 */
export function loadFixture<TInput = unknown, TExpected = unknown>(
  filePath: string
): FixtureFile<TInput, TExpected> {
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw) as FixtureFile<TInput, TExpected>;
  if (!("input" in parsed)) {
    throw new Error(`[eval-fixtures] ${filePath}: kein "input"-Feld.`);
  }
  return parsed;
}

/**
 * Laedt alle Fixture-Dateien aus einem Verzeichnis (rekursiv).
 * Returnt Map<name, FixtureFile> — name ist der Dateipfad ohne .json,
 * relativ zum dir.
 */
export function loadAllFixtures<TInput = unknown, TExpected = unknown>(
  dir: string
): Map<string, FixtureFile<TInput, TExpected>> {
  const map = new Map<string, FixtureFile<TInput, TExpected>>();
  if (!fs.existsSync(dir)) return map;

  function walk(current: string, prefix: string) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(full, rel);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        const name = rel.slice(0, -".json".length);
        try {
          map.set(name, loadFixture<TInput, TExpected>(full));
        } catch (err) {
          console.warn(`[eval-fixtures] skip ${full}: ${(err as Error).message}`);
        }
      }
    }
  }

  walk(dir, "");
  return map;
}
