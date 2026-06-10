"use client";

import { createBrowserClient as _createBrowserClient } from "@supabase/ssr";
import { requireEnv } from "./env";
import type { Database } from "./types";

export type BrowserClient = ReturnType<typeof _createBrowserClient<Database>>;

/**
 * Browser-Supabase-Client für Client-Components. Nutzt anon-Key, alle
 * Anfragen gehen durch RLS.
 *
 * WICHTIG: Beim Aufruf in Client-Components als kurzlebige Instanz halten
 * (z. B. mit `useMemo`). Re-Init pro Render ist OK — der Client ist leichtgewichtig.
 */
export function createBrowserClient(): BrowserClient {
  return _createBrowserClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}
