import { handleStripeWebhook } from "@flow/billing";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const result = await handleStripeWebhook(req, "gefaehrdungsbeurteilung");
  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: { "Content-Type": "application/json" },
  });
}
