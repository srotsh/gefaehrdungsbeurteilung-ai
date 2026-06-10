import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@flow/db";
import { tryGetAccount } from "@/lib/server-auth";

const ACTION_LABEL: Record<string, string> = {
  "protokoll.distributed": "Protokoll versendet",
  "protokoll.distribution_failed": "Versand fehlgeschlagen",
  "shift.handover_completed": "Schicht-Übergabe",
  "auth.signin": "Anmeldung",
  "auth.signout": "Abmeldung",
};

interface SearchProps {
  searchParams: { action?: string; entityType?: string; days?: string };
}

export default async function AuditPage({ searchParams }: SearchProps) {
  const auth = await tryGetAccount();
  if (!auth) redirect("/login");
  const { account } = auth;

  const days = Number(searchParams.days ?? 30);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const supabase = createServerClient();
  let query = supabase
    .from("audit_log")
    .select("id, action, entity_type, entity_id, metadata, product, created_at, user_id")
    .eq("account_id", account.id)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(500);

  if (searchParams.action) query = query.eq("action", searchParams.action);
  if (searchParams.entityType) query = query.eq("entity_type", searchParams.entityType);

  const { data: entries, error } = await query;

  // Distinct values fuer Filter-Dropdowns
  const actions = Array.from(new Set((entries ?? []).map((e) => e.action))).sort();
  const entityTypes = Array.from(
    new Set((entries ?? []).map((e) => e.entity_type).filter((v): v is string => Boolean(v)))
  ).sort();

  return (
    <main className="p-8 space-y-6 max-w-5xl">
      <header>
        <Link href="/settings" className="text-sm underline">← Einstellungen</Link>
        <h1 className="text-2xl font-bold mt-2">Audit-Log</h1>
        <p className="text-sm text-muted-foreground">
          Wer hat wann was gemacht. Letzte {days} Tage.
        </p>
      </header>

      <form className="flex flex-wrap gap-3 rounded-md border bg-card p-4 text-sm">
        <select name="action" defaultValue={searchParams.action ?? ""} className="rounded-md border px-3 py-1.5">
          <option value="">Alle Aktionen</option>
          {actions.map((a) => (
            <option key={a} value={a}>{ACTION_LABEL[a] ?? a}</option>
          ))}
        </select>
        <select name="entityType" defaultValue={searchParams.entityType ?? ""} className="rounded-md border px-3 py-1.5">
          <option value="">Alle Entity-Typen</option>
          {entityTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select name="days" defaultValue={String(days)} className="rounded-md border px-3 py-1.5">
          <option value="7">7 Tage</option>
          <option value="30">30 Tage</option>
          <option value="90">90 Tage</option>
          <option value="365">1 Jahr</option>
        </select>
        <button className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground">Filtern</button>
        {(searchParams.action || searchParams.entityType) && (
          <Link href="/settings/audit" className="rounded-md border px-3 py-1.5">Filter zurücksetzen</Link>
        )}
      </form>

      {error && <p className="text-sm text-red-600">Fehler: {error.message}</p>}

      {(entries ?? []).length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          Keine Einträge im gewählten Zeitraum.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {(entries ?? []).map((e) => {
            const failed = e.action.includes("failed");
            return (
              <li key={e.id} className={`rounded-md border bg-card p-3 text-sm ${failed ? "border-l-4 border-l-red-500" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{ACTION_LABEL[e.action] ?? e.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.entity_type && `${e.entity_type}`}
                      {e.entity_id && ` · ${String(e.entity_id).slice(0, 8)}`}
                      {e.product && ` · ${e.product}`}
                    </p>
                    {e.metadata && Object.keys(e.metadata as object).length > 0 && (
                      <details className="mt-1">
                        <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">Metadaten</summary>
                        <pre className="mt-1 rounded bg-muted/50 p-2 text-xs overflow-auto">
                          {JSON.stringify(e.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(e.created_at).toLocaleString("de-DE")}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {(entries ?? []).length === 500 && (
        <p className="text-xs text-muted-foreground text-center">
          Erste 500 Einträge — engerer Filter setzen um ältere zu sehen.
        </p>
      )}
    </main>
  );
}
