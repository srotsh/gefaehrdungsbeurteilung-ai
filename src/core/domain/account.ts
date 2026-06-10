import "server-only";
import { createServerClient, createServiceClient } from "@flow/db";
import type { Account, User } from "./types";

/**
 * Resolved den eingeloggten User + sein Account in einer einzigen Query.
 * Returnt null wenn kein Login.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  // Nur Spalten selektieren, die in JEDEM Produkt-Schema existieren —
  // email/role gibt es nicht ueberall (siehe User-Type).
  const { data, error } = await supabase
    .from("users")
    .select("id, account_id, full_name, created_at")
    .eq("id", authUser.id)
    .single();

  if (error || !data) return null;
  return { ...data, email: authUser.email ?? null } as unknown as User;
}

export async function getCurrentAccount(): Promise<Account | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", user.account_id)
    .single();
  return data as unknown as Account | null;
}

/**
 * Wirft, wenn nicht eingeloggt. Convenience für Server-Actions / Route-Handler,
 * die nicht-null garantieren wollen.
 */
export async function requireUser(): Promise<User> {
  const u = await getCurrentUser();
  if (!u) throw new UnauthorizedError("Nicht angemeldet.");
  return u;
}

export async function requireAccount(): Promise<{
  account: Account;
  user: User;
}> {
  const user = await requireUser();
  const supabase = createServerClient();
  const { data: account, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", user.account_id)
    .single();
  if (error || !account) {
    throw new UnauthorizedError("Account nicht gefunden.");
  }
  return { account: account as unknown as Account, user };
}

/**
 * Service-Role-Variante: lädt Account anhand id, ohne RLS.
 * NUR in Server-Routen / Webhooks nutzen.
 */
export async function getAccountByIdAsAdmin(
  accountId: string
): Promise<Account | null> {
  const admin = createServiceClient();
  const { data } = await admin
    .from("accounts")
    .select("*")
    .eq("id", accountId)
    .single();
  return data as unknown as Account | null;
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
