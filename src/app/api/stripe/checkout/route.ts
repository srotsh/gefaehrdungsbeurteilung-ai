import { NextResponse } from "next/server";
import { createCheckoutSession } from "@flow/billing";
import { getSessionUser } from "@flow/auth";
import { createServerClient } from "@flow/db";
import { tryGetAccount } from "@/lib/server-auth";

const PRODUCT = "gefaehrdungsbeurteilung" as const;

export async function POST(req: Request) {
  const auth = await tryGetAccount();
  if (!auth) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  const { account } = auth;

  const { plan, interval } = await req.json();
  if (!plan || !interval) return NextResponse.json({ error: "plan/interval fehlt" }, { status: 400 });

  const user = await getSessionUser();
  const supabase = createServerClient();
  const { data: existing } = await supabase
    .from("product_subscriptions")
    .select("stripe_customer_id")
    .eq("product", PRODUCT)
    .eq("account_id", account.id)
    .maybeSingle();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;

  try {
    const { url } = await createCheckoutSession({
      product: PRODUCT,
      plan,
      interval,
      accountId: account.id,
      customerEmail: user?.email,
      stripeCustomerId: existing?.stripe_customer_id ?? undefined,
      successUrl: `${baseUrl}/settings/billing?success=1`,
      cancelUrl: `${baseUrl}/settings/billing?cancelled=1`,
    });
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
