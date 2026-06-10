import "server-only";
import { requireAccount, UnauthorizedError } from "@flow/core";
import type { Account, User } from "@flow/core";

/**
 * Wrapper um @flow/core requireAccount, das bei Nicht-Anmeldung null zurueckgibt
 * statt zu werfen. Bequemer fuer Server-Actions, die ein Result-Object liefern.
 */
export async function tryGetAccount(): Promise<{ account: Account; user: User } | null> {
  try {
    return await requireAccount();
  } catch (e) {
    if (e instanceof UnauthorizedError) return null;
    throw e;
  }
}
