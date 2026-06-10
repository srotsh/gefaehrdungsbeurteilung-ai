/**
 * @flow/auth — Auth-Helpers + Middleware-Factory.
 *
 * Sub-Modul-Imports werden vom Main-Index re-exportiert für ergonomische DX.
 * Die Middleware ist auch über `@flow/auth/middleware` importierbar
 * (für Apps, die dann nichts anderes brauchen).
 */

export {
  authMiddleware,
  defaultMatcher,
  type AuthMiddlewareOptions,
} from "./middleware";

export {
  signUp,
  signIn,
  signOut,
  requestPasswordReset,
  getSessionUser,
} from "./actions";

// Re-export Supabase-Clients aus @flow/db, damit Konsumenten nicht aus
// zwei Pakten importieren müssen. Pure Convenience.
export {
  createBrowserClient,
  createServerClient,
  createServiceClient,
} from "@flow/db";
