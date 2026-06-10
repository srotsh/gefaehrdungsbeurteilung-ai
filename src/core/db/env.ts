/**
 * Env-Helper. Wird von beiden Client-Factories genutzt — fail-loud bei
 * fehlender Config statt kryptischem NPE.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[@flow/db] Missing required env var: ${name}. ` +
        `Set it in .env.local or your deploy environment.`
    );
  }
  return value;
}

/**
 * Client-Info-Header für Forensik in Supabase-Logs.
 * Per App überschreibbar via FLOW_DB_CLIENT_INFO env (z. B. "protokollflow-server").
 */
export function clientInfoHeader(fallback = "flow-server"): string {
  return process.env.FLOW_DB_CLIENT_INFO ?? fallback;
}
