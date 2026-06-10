import "server-only";
import OpenAI, { toFile } from "openai";
import { DEFAULT_LLM_TIMEOUT_MS, WHISPER_MAX_BYTES } from "./limits";
import {
  AudioTooLargeError,
  EmptyAudioError,
  TranscriptionProviderError,
} from "./errors";

export interface TranscriptChunk {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResult {
  text: string;
  chunks: TranscriptChunk[];
  language: string | null;
  duration: number | null;
  provider: "groq" | "openai";
}

type Provider = "groq" | "openai";

interface ProviderConfig {
  baseURL: string;
  apiKey: string | undefined;
  model: string;
}

function configFor(provider: Provider): ProviderConfig {
  if (provider === "groq") {
    return {
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
      model: "whisper-large-v3-turbo",
    };
  }
  return {
    baseURL: "https://api.openai.com/v1",
    apiKey: process.env.OPENAI_API_KEY,
    model: "whisper-1",
  };
}

const _clients = new Map<Provider, OpenAI>();
function client(provider: Provider): OpenAI {
  const cached = _clients.get(provider);
  if (cached) return cached;
  const cfg = configFor(provider);
  if (!cfg.apiKey) {
    throw new TranscriptionProviderError(
      provider,
      `${provider === "groq" ? "GROQ_API_KEY" : "OPENAI_API_KEY"} ist nicht gesetzt.`
    );
  }
  const c = new OpenAI({
    apiKey: cfg.apiKey,
    baseURL: cfg.baseURL,
    timeout: DEFAULT_LLM_TIMEOUT_MS,
    maxRetries: 0,
  });
  _clients.set(provider, c);
  return c;
}

interface WhisperVerboseResponse {
  text: string;
  language?: string;
  duration?: number;
  segments?: Array<{ start: number; end: number; text: string }>;
}

async function callProvider(
  provider: Provider,
  audio: Blob,
  fileName: string,
  language: string
): Promise<TranscriptionResult> {
  const cfg = configFor(provider);
  const file = await toFile(audio, fileName);

  let response: WhisperVerboseResponse;
  try {
    response = (await client(provider).audio.transcriptions.create({
      file,
      model: cfg.model,
      language,
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    })) as unknown as WhisperVerboseResponse;
  } catch (err) {
    const status = (err as { status?: number }).status;
    const retriable = status === undefined || status >= 500 || status === 429;
    throw new TranscriptionProviderError(
      provider,
      `Whisper (${provider}) fehlgeschlagen.`,
      { cause: err, retriable }
    );
  }

  const chunks: TranscriptChunk[] =
    response.segments?.map((s) => ({
      start: s.start,
      end: s.end,
      text: s.text.trim(),
    })) ?? [];

  return {
    text: response.text,
    chunks,
    language: response.language ?? null,
    duration: response.duration ?? null,
    provider,
  };
}

function resolvePrimaryProvider(): Provider {
  const raw = process.env.WHISPER_PROVIDER?.toLowerCase().trim();
  if (raw === "groq" || raw === "openai") return raw;
  if (raw && raw.length > 0) {
    console.warn(
      `[@flow/ai] Unknown WHISPER_PROVIDER="${raw}", falling back to "groq".`
    );
  }
  return "groq";
}

/**
 * Whisper-Transkription mit automatischem Provider-Fallback.
 * Default: Groq → bei Fehler OpenAI-Fallback (außer WHISPER_DISABLE_FALLBACK=1).
 */
export async function transcribe(
  audio: Blob,
  fileName: string,
  language = "de"
): Promise<TranscriptionResult> {
  if (!audio || audio.size === 0) throw new EmptyAudioError();
  if (audio.size > WHISPER_MAX_BYTES) throw new AudioTooLargeError(audio.size);

  const primary = resolvePrimaryProvider();
  const fallbackDisabled = process.env.WHISPER_DISABLE_FALLBACK === "1";
  const fallback: Provider = primary === "groq" ? "openai" : "groq";

  try {
    return await callProvider(primary, audio, fileName, language);
  } catch (err) {
    if (fallbackDisabled) throw err;
    if (err instanceof TranscriptionProviderError && !err.retriable) throw err;
    const fallbackKey = configFor(fallback).apiKey;
    if (!fallbackKey) throw err;
    console.warn(
      `[@flow/ai] ${primary} failed, trying ${fallback}…`,
      err instanceof Error ? err.message : err
    );
    return await callProvider(fallback, audio, fileName, language);
  }
}
