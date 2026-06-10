import type { ProductSlug, Plan } from "@flow/billing";

export interface Account {
  id: string;
  name: string;
  stripe_customer_id: string | null;
  created_at: string;
  metadata: Record<string, unknown>;
  legacy_user_id?: string | null;
}

export interface User {
  id: string;
  account_id: string;
  full_name: string;
  created_at: string;
  /** Nicht in jedem Produkt-Schema vorhanden — E-Mail kommt sonst aus auth.users. */
  email?: string | null;
  /** Nicht in jedem Produkt-Schema vorhanden (nur Multi-User-Produkte). */
  role?: "owner" | "admin" | "member" | null;
}

export interface ProductSubscription {
  id: string;
  account_id: string;
  product: ProductSlug;
  plan: Plan;
  stripe_subscription_id: string | null;
  status:
    | "active"
    | "canceled"
    | "past_due"
    | "trialing"
    | "incomplete"
    | "unpaid"
    | "incomplete_expired";
  current_period_end: string | null;
  usage_this_period: Record<string, number>;
  created_at: string;
  updated_at: string;
}

export type { ProductSlug, Plan };
