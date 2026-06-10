import "server-only";
import {
  createServerClient as _createServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireEnv } from "./env";
import type { Database } from "./types";

type CookieToSet = { name: string; value: string; options: CookieOptions };

export type ServerClient = ReturnType<typeof _createServerClient<Database>>;

/**
 * Supabase-Client für Server Components, Route Handlers und Server Actions.
 *
 * Liest/schreibt Auth-Cookies automatisch via next/headers; respektiert RLS
 * (anon-Key + signiertes JWT).
 *
 * REFACTOR (R2): Ersetzt apps/protokollflow/src/lib/supabase/server.ts
 * `createServerSupabaseClient`. Re-export an alter Stelle bleibt für
 * Backward-Compat erhalten.
 */
export function createServerClient(): ServerClient {
  const cookieStore = cookies();

  return _createServerClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }: CookieToSet) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // RSC ist Read-only — Middleware kümmert sich um Token-Refresh.
          }
        },
      },
    }
  );
}
