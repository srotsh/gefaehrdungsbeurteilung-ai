/**
 * Vorgefertigte Eval-Assertions, die Apps in `assertions: [...]` ihrer
 * registerEval()-Aufrufe einsetzen koennen.
 *
 * Alle Helpers haben dieselbe Signatur wie EvalAssertion<TOutput>:
 *   { name: string; check: (out: TOutput) => true | string }
 * Bei Fehler: Rueckgabe einer aussagekraeftigen Diagnose-Message.
 */

import type { ZodSchema } from "zod";
import type { EvalAssertion } from "./evals";
import { extractPruefenMarkers } from "./parse";

/**
 * Output muss gegen ein Zod-Schema validieren.
 */
export function assertSchema<T>(schema: ZodSchema<T>): EvalAssertion<T> {
  return {
    name: "matches schema",
    check: (out) => {
      const r = schema.safeParse(out);
      if (r.success) return true;
      return r.error.errors
        .slice(0, 3)
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
    },
  };
}

/**
 * Output darf maximal N PRUEFEN-Marker enthalten (rekursiv ueber alle String-Felder).
 */
export function assertMaxPruefenMarkers<T>(maxCount: number): EvalAssertion<T> {
  return {
    name: `<= ${maxCount} PRUEFEN-Marker`,
    check: (out) => {
      const markers = extractPruefenMarkers(out as unknown);
      if (markers.length <= maxCount) return true;
      return `gefunden: ${markers.length}, erlaubt: ${maxCount}`;
    },
  };
}

/**
 * Output darf den gegebenen Marker-Text NICHT enthalten (case-insensitive Substring).
 * Use case: blockiert Halluzinationen, die in Tests als Anti-Pattern markiert sind.
 */
export function assertDoesNotContain<T>(forbidden: string | RegExp): EvalAssertion<T> {
  const re = typeof forbidden === "string" ? new RegExp(escapeRegex(forbidden), "i") : forbidden;
  return {
    name: `output does not contain ${forbidden}`,
    check: (out) => {
      const json = JSON.stringify(out);
      if (!re.test(json)) return true;
      return `verbotenes Pattern gefunden: ${re}`;
    },
  };
}

export function assertContains<T>(needle: string | RegExp): EvalAssertion<T> {
  const re = typeof needle === "string" ? new RegExp(escapeRegex(needle), "i") : needle;
  return {
    name: `output contains ${needle}`,
    check: (out) => {
      const json = JSON.stringify(out);
      if (re.test(json)) return true;
      return `Pattern fehlt: ${re}`;
    },
  };
}

/**
 * Numerischer Wert eines Pfads liegt in [min, max].
 * Pfad ist dot-separated: "gesamt.einnahmen_cents".
 */
export function assertNumericRange<T>(path: string, min: number, max: number): EvalAssertion<T> {
  return {
    name: `${path} in [${min}, ${max}]`,
    check: (out) => {
      const v = readPath(out, path);
      if (typeof v !== "number") return `Pfad ${path} ist kein Number (${typeof v})`;
      if (v < min || v > max) return `Wert ${v} ausserhalb [${min}, ${max}]`;
      return true;
    },
  };
}

/**
 * Stringfeld an `path` hat Mindestlaenge (Hallucination-Indicator: oft sind
 * fehlende Sektionen leer oder "—").
 */
export function assertMinLength<T>(path: string, minChars: number): EvalAssertion<T> {
  return {
    name: `${path} >= ${minChars} chars`,
    check: (out) => {
      const v = readPath(out, path);
      if (typeof v !== "string") return `Pfad ${path} kein String (${typeof v})`;
      if (v.length < minChars) return `Laenge ${v.length} < ${minChars}`;
      return true;
    },
  };
}

/**
 * Custom-Predicate. Useful when assertion-Logik komplex ist.
 */
export function assertCustom<T>(name: string, predicate: (out: T) => boolean | string): EvalAssertion<T> {
  return { name, check: predicate };
}

// ----------------------------------------------------------------------------

function readPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
