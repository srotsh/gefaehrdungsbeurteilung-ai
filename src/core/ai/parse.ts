/**
 * JSON-Parsing-Helpers für strukturierte LLM-Outputs.
 *
 * Strategie:
 *  - Akzeptiert ```json…``` Code-Fences ODER reines JSON-Objekt
 *  - Fällt zurück auf erstes `{` … letztes `}` Heuristik
 *  - Sanitisiert Parse-Errors für DB-Storage (kein Roh-LLM-Output leakt)
 */

export function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return raw.slice(firstBrace, lastBrace + 1);
  }
  return raw.trim();
}

/**
 * Sanitisiert Parse-Errors. Logt Roh-Output server-seitig, gibt aber nur
 * eine Position zurück — keine User-Daten leaken in error_message-Felder.
 */
export function safeParseErrorMessage(err: unknown, raw: string): string {
  const errMsg = err instanceof Error ? err.message : "unbekannt";
  const posMatch = errMsg.match(/position\s+(\d+)/i);
  const pos = posMatch ? `Position ${posMatch[1]}` : "unbekannte Stelle";
  console.error("[@flow/ai] JSON-Parse-Fehler", {
    errMsg,
    len: raw.length,
    head: raw.slice(0, 200),
  });
  return `JSON-Parse-Fehler an ${pos}. Bitte erneut versuchen.`;
}

/**
 * Extrahiert [PRÜFEN]-Markierungen aus generiertem Text.
 * Convention: jede Zeile mit "[PRÜFEN]"-Substring gilt als Prüfauftrag.
 */
export interface PruefenMarker {
  path: string;
  reason: string;
}

export function extractPruefenMarkers(
  obj: unknown,
  pathPrefix = ""
): PruefenMarker[] {
  const markers: PruefenMarker[] = [];
  walk(obj, pathPrefix, markers);
  return markers;
}

function walk(node: unknown, path: string, out: PruefenMarker[]): void {
  if (typeof node === "string") {
    if (node.includes("[PRÜFEN]")) {
      out.push({ path, reason: node });
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item, idx) => walk(item, `${path}[${idx}]`, out));
    return;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      walk(v, path ? `${path}.${k}` : k, out);
    }
  }
}
