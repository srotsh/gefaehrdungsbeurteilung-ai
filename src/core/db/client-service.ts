import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { clientInfoHeader, requireEnv } from "./env";
import type { Database } from "./types";

/**
 * Service-Role-Client (umgeht RLS).
 *
 * REFACTOR (R2): Ersetzt apps/protokollflow/src/lib/supabase/server.ts
 * `createServiceRoleClient`.
 *
 * NUR server-seitig nutzen, NIE in Client-Bundles leaken. Verwendet
 * `@supabase/supabase-js` (statt @supabase/ssr) weil im Service-Role-Kontext
 * weder Cookies noch Auto-Refresh sinnvoll sind.
 *
 * Singleton pro Lambda-Instanz (stateless, idempotent zwischen Requests).
 */
let _serviceClient: SupabaseClient<Database> | null = null;

export function createServiceClient(): SupabaseClient<Database> {
  if (_serviceClient) return _serviceClient;

  _serviceClient = createClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          "X-Client-Info": clientInfoHeader("flow-service-role"),
        },
      },
    }
  );
  return _serviceClient;
}

/**
 * Test-Helper: forceful re-init des Singleton. Nur in Tests verwenden,
 * z. B. wenn der Service-Role-Key zwischen Test-Cases gewechselt wird.
 */
export function __resetServiceClientForTests(): void {
  _serviceClient = null;
}
