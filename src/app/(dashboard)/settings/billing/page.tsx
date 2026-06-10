import { createServerClient } from "@flow/db";
import { PRODUCTS } from "@flow/billing";
import { BillingPage } from "@/components/billing-page";

const PRODUCT_SLUG = "vorstandsprotokoll" as const;

export default async function BillingSettingsPage() {
  const supabase = createServerClient();
  const { data: subRow } = await supabase
    .from("product_subscriptions")
    .select("plan, status, current_period_end, stripe_customer_id")
    .eq("product", PRODUCT_SLUG)
    .maybeSingle();

  return (
    <main className="p-8 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Abrechnung</h1>
        <p className="text-sm text-muted-foreground">
          Plan verwalten, Zahlungsmethode ändern, Rechnungen abrufen.
        </p>
      </div>
      <BillingPage
        product={PRODUCT_SLUG}
        productConfig={PRODUCTS[PRODUCT_SLUG]}
        currentSubscription={subRow ?? null}
      />
    </main>
  );
}
