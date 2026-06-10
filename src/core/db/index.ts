/**
 * @flow/db — Typed Supabase clients + Database types.
 *
 * Drei Clients, dreimal denselben Vertrag:
 *   - createBrowserClient()  → Client-Components, anon-Key, RLS aktiv
 *   - createServerClient()   → Server-Components/API-Routes, Cookie-Auth, RLS aktiv
 *   - createServiceClient()  → Server-only, umgeht RLS, für Webhooks + Background-Jobs
 *
 * Verwendung:
 * ```ts
 * import { createServerClient } from "@flow/db";
 * const supabase = createServerClient();
 * const { data } = await supabase.from("wegs").select("*");
 * ```
 */

export { createBrowserClient } from "./client-browser";
export { createServerClient } from "./client-server";
export { createServiceClient, __resetServiceClientForTests } from "./client-service";
export { requireEnv, clientInfoHeader } from "./env";
export type { Database, Json } from "./types";

// Re-export shared Supabase types für Konsumenten, die sie brauchen
// (z. B. um eigene Helper-Wrapper zu typisieren).
export type { SupabaseClient, PostgrestError } from "@supabase/supabase-js";
