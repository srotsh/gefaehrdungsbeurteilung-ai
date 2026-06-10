/**
 * Hard-Caps gegen Cost-DoS und pathologische LLM-Outputs.
 *
 * Diese Datei MUSS frei von server-only-Imports bleiben — sie wird auch
 * client-seitig importiert (z. B. für File-Size-Vorprüfung in Upload-UIs).
 */

/** Whisper-API-Limit für OpenAI UND Groq (25 MB pro Request). */
export const WHISPER_MAX_BYTES = 25 * 1024 * 1024;

/** Default-Timeout für einen einzelnen Whisper- oder Anthropic-Call (90 s). */
export const DEFAULT_LLM_TIMEOUT_MS = 90_000;

/** Cost-DoS-Schutz: Transcript-Cap vor Anthropic-Call. ~50k Tokens. */
export const MAX_TRANSCRIPT_CHARS = 200_000;
