import "server-only";
import { getCurrentUser } from "./account";

/**
 * Session-Guard für API-Route-Handler.
 *
 * Jede mutierende oder kostenverursachende API-Route MUSS damit (oder mit
 * requireAccount) starten und zusätzlich Ownership prüfen, bevor sie per
 * Service-Client (RLS-Bypass!) Entities lädt oder schreibt:
 *
 * ```ts
 * const identity = await getApiIdentity();
 * if (!identity) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
 * // ... Entity laden ...
 * if (entity.account_id !== identity.accountId) {
 *   return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
 * }
 * ```
 */
export interface ApiIdentity {
  userId: string;
  accountId: string;
}

export async function getApiIdentity(): Promise<ApiIdentity | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return { userId: user.id, accountId: user.account_id };
}
