import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@flow/db";
import { tryGetAccount } from "@/lib/server-auth";
import { signOutAction } from "@/app/(dashboard)/settings/actions";

const SECTIONS = [
  { href: "/settings/billing", title: "Abrechnung", desc: "Plan ändern, Zahlungsmethode aktualisieren, Rechnungen abrufen." },
  { href: "/settings/audit",   title: "Audit-Log",  desc: "Aktivitätsverlauf des Accounts (Versand, Freigaben, kritische Aktionen)." },
];

export default async function SettingsPage() {
  const auth = await tryGetAccount();
  if (!auth) redirect("/login");
  const { account, user } = auth;

  const supabase = createServerClient();
  const { data: subs } = await supabase
    .from("product_subscriptions")
    .select("product, plan, status")
    .eq("account_id", account.id);

  return (
    <main className="p-8 space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Einstellungen</h1>

      <section className="rounded-md border bg-card p-4 text-sm">
        <h2 className="font-semibold mb-2">Account</h2>
        <dl className="grid grid-cols-2 gap-1">
          <dt className="text-muted-foreground">Name</dt>
          <dd>{user.full_name ?? "—"}</dd>
          <dt className="text-muted-foreground">E-Mail</dt>
          <dd>{user.email ?? "—"}</dd>
          <dt className="text-muted-foreground">Konto</dt>
          <dd>{account.name}</dd>
        </dl>
      </section>

      {subs && subs.length > 0 && (
        <section className="rounded-md border bg-card p-4 text-sm">
          <h2 className="font-semibold mb-2">Aktive Subscriptions</h2>
          <ul className="space-y-1">
            {subs.filter((s) => s.status === "active" || s.status === "trialing").map((s, i) => (
              <li key={i} className="flex justify-between">
                <span>{s.product}</span>
                <span className="text-muted-foreground capitalize">{s.plan} · {s.status}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="rounded-md border bg-card p-4 hover:bg-muted/30">
            <p className="font-medium">{s.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
          </Link>
        ))}
      </section>

      <form action={signOutAction}>
        <button type="submit" className="rounded-md border px-4 py-2 text-sm hover:bg-muted">
          Abmelden
        </button>
      </form>
    </main>
  );
}
