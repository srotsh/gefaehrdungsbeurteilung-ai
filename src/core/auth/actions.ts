import "server-only";
import { createServerClient } from "@flow/db";

/**
 * Auth-Server-Actions als shared Helpers. Jede App kann sie direkt in
 * Server-Actions wrappen oder eigene zustandsspezifische Wrapper bauen.
 *
 * Hinweis: Diese Helper geben rohe `{ data, error }` zurück, wie es die
 * Supabase-API liefert. Apps wandeln sie in ihre Action-Result-Shapes um.
 */

export async function signUp(params: {
  email: string;
  password: string;
  fullName?: string;
  companyName?: string;
  emailRedirectTo?: string;
}) {
  const supabase = createServerClient();
  return supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      emailRedirectTo: params.emailRedirectTo,
      data: {
        full_name: params.fullName ?? "",
        company_name: params.companyName ?? "",
      },
    },
  });
}

export async function signIn(params: { email: string; password: string }) {
  const supabase = createServerClient();
  return supabase.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  });
}

export async function signOut() {
  const supabase = createServerClient();
  return supabase.auth.signOut();
}

export async function requestPasswordReset(params: {
  email: string;
  redirectTo?: string;
}) {
  const supabase = createServerClient();
  return supabase.auth.resetPasswordForEmail(params.email, {
    redirectTo: params.redirectTo,
  });
}

export async function getSessionUser() {
  const supabase = createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}
