/**
 * @flow/ai — AI-Engine für die Portfolio-Apps.
 *
 * Drei Hauptverträge:
 *   1. transcribe(audio, fileName, lang) — Whisper mit Provider-Fallback
 *   2. generateDocument<T>({ systemPrompt, inputs, outputSchema, ... }) — der Engine-Kern
 *   3. refineSection<T>({...}) — Per-Section AI-Improve mit reasoning-Modell
 *
 * Plus Helpers (extractJson, extractPruefenMarkers, errors) und Eval-Harness.
 */

// Audio
export { transcribe } from "./whisper";
export type { TranscriptChunk, TranscriptionResult } from "./whisper";

// Generation
export {
  generateDocument,
  refineSection,
  type GenerateDocumentOptions,
  type GenerateDocumentResult,
  z,
  type ZodSchema,
} from "./generate";

// Parsing helpers
export {
  extractJson,
  extractPruefenMarkers,
  safeParseErrorMessage,
  type PruefenMarker,
} from "./parse";

// Errors
export {
  AudioTooLargeError,
  EmptyAudioError,
  TranscriptionProviderError,
  GenerationError,
} from "./errors";

// Limits (auch client-safe; client sollte aber direkt aus "@flow/ai/limits" importieren)
export { WHISPER_MAX_BYTES, DEFAULT_LLM_TIMEOUT_MS, MAX_TRANSCRIPT_CHARS } from "./limits";

// Eval harness
export {
  registerEval,
  runEval,
  runAllEvals,
  formatEvalReport,
  type EvalSpec,
  type EvalResult,
  type EvalAssertion,
} from "./evals";

// Eval helpers — pre-built assertions
export {
  assertSchema,
  assertMaxPruefenMarkers,
  assertDoesNotContain,
  assertContains,
  assertNumericRange,
  assertMinLength,
  assertCustom,
} from "./eval-helpers";

// Snapshot support
export { assertSnapshot, type SnapshotOpts } from "./eval-snapshot";

// Fixture loader
export {
  loadFixture,
  loadAllFixtures,
  type FixtureFile,
} from "./eval-fixtures";

// Fixtures (synthetic, no real PII) für Smoke-Tests
export {
  WEG_MINI_TRANSCRIPT,
  WEG_MINI_FIXTURE_META,
} from "./fixtures/weg-mini-transcript";
