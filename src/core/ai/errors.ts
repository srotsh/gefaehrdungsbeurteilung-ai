export class AudioTooLargeError extends Error {
  readonly bytes: number;
  constructor(bytes: number) {
    super(
      `Audiodatei ist zu groß (${(bytes / 1024 / 1024).toFixed(1)} MB). ` +
        "Aktuell unterstützt: bis 25 MB pro Datei."
    );
    this.name = "AudioTooLargeError";
    this.bytes = bytes;
  }
}

export class EmptyAudioError extends Error {
  constructor() {
    super("Audiodatei ist leer (0 Bytes).");
    this.name = "EmptyAudioError";
  }
}

export class TranscriptionProviderError extends Error {
  readonly provider: "groq" | "openai";
  readonly retriable: boolean;
  constructor(
    provider: "groq" | "openai",
    message: string,
    opts?: { cause?: unknown; retriable?: boolean }
  ) {
    super(message);
    this.name = "TranscriptionProviderError";
    this.provider = provider;
    this.retriable = opts?.retriable ?? false;
    if (opts?.cause !== undefined) {
      (this as { cause?: unknown }).cause = opts.cause;
    }
  }
}

export class GenerationError extends Error {
  readonly stage: "api" | "parse" | "validate";
  constructor(stage: "api" | "parse" | "validate", message: string) {
    super(message);
    this.name = "GenerationError";
    this.stage = stage;
  }
}
