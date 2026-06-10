import "server-only";
import { createServiceClient } from "@flow/db";

export interface UploadOptions {
  bucket: string;
  /** Pfad muss mit accountId beginnen — Convention für Path-Traversal-Schutz */
  path: string;
  file: Blob | ArrayBuffer | Buffer;
  contentType?: string;
  upsert?: boolean;
}

export async function uploadFile(opts: UploadOptions): Promise<{ path: string }> {
  const admin = createServiceClient();
  const { error } = await admin.storage.from(opts.bucket).upload(
    opts.path,
    opts.file as Blob,
    { contentType: opts.contentType, upsert: opts.upsert ?? false }
  );
  if (error) throw new Error(`[@flow/storage] upload failed: ${error.message}`);
  return { path: opts.path };
}

export async function getSignedUrl(opts: {
  bucket: string;
  path: string;
  expiresInSeconds?: number;
}): Promise<string> {
  const admin = createServiceClient();
  const { data, error } = await admin.storage
    .from(opts.bucket)
    .createSignedUrl(opts.path, opts.expiresInSeconds ?? 3600);
  if (error || !data?.signedUrl) {
    throw new Error(`[@flow/storage] signed URL failed: ${error?.message ?? "unknown"}`);
  }
  return data.signedUrl;
}

export async function deleteFile(opts: {
  bucket: string;
  path: string;
}): Promise<void> {
  const admin = createServiceClient();
  const { error } = await admin.storage.from(opts.bucket).remove([opts.path]);
  if (error) throw new Error(`[@flow/storage] delete failed: ${error.message}`);
}

export { cleanupOldAudio, isAuthorizedCron, type CleanupAudioOptions, type CleanupResult } from "./cleanup";

/**
 * Path-Traversal-Schutz: Storage-Pfade MÜSSEN mit accountId beginnen.
 * Convention für alle Apps in der Engine.
 */
export function isPathOwnedByAccount(path: string, accountId: string): boolean {
  if (!accountId) return false;
  if (!path.startsWith(`${accountId}/`)) return false;
  const parts = path.split("/");
  return !parts.some((p) => p === ".." || p === "." || p === "");
}
