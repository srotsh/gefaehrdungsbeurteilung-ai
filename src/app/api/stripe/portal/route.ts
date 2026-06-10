import { NextResponse } from "next/server";
import { createPortalSession } from "@flow/billing";
import { createServerClient } from "@flow/db";
import { tryGetAccount } from "@/lib/server-auth";

const PRODUCT = "gefaehrdungsbeurteilung" as const;

export async function POST(req: Request) {
  const auth = await tryGetAccount();
  if (!auth) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  const { account } = auth;

  const supabase = createServerClient();
  const { data: sub } = await supabase
    .from("product_subscriptions")
    .select("stripe_customer_id")
    .eq("product", PRODUCT)
    .eq("account_id", account.id)
    .maybeSingle();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: "Keine aktive Subscription." }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;

  try {
    const { url } = await createPortalSession({
      stripeCustomerId: sub.stripe_customer_id,
      returnUrl: `${baseUrl}/settings/billing`,
    });
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
