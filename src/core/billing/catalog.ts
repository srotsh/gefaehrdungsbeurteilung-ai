/**
 * Produkt-Katalog für die Engine. Jedes Produkt der Portfolio-Familie
 * wird hier mit seinen drei Plänen + Stripe-Preisen registriert.
 *
 * Stripe-Preis-IDs kommen aus ENV-Variablen — pro Produkt eigene Slots.
 * Konvention: STRIPE_PRICE_<PRODUCT>_<PLAN>_<INTERVAL>.
 */

export type ProductSlug =
  | "protokollflow"
  | "jahresabrechnung"
  | "beratungsprotokoll"
  | "vorstandsprotokoll"
  | "pflegedoku"
  | "mitarbeitergespraech"
  | "therapiedoku"
  | "gefaehrdungsbeurteilung"
  | "schaden";

export type Plan = "free" | "starter" | "pro";

export type BillingInterval = "monthly" | "yearly";

export interface PlanLimits {
  protokolle_pro_monat: number;
  watermark: boolean;
  email_versand: boolean;
  custom_briefkopf: boolean;
  api_zugang: boolean;
  priority_processing: boolean;
}

export interface PlanPricing {
  monthly_eur: number;
  yearly_eur: number;
  stripe_price_monthly?: string;
  stripe_price_yearly?: string;
}

export interface ProductConfig {
  slug: ProductSlug;
  displayName: string;
  plans: Record<Plan, PlanLimits & PlanPricing>;
}

function envOr(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

/**
 * Produkt-Konfigurationen. Bei neuem Produkt: hier ergänzen + ENV-Slots
 * im Hosting setzen + neuen `product`-Wert in
 * `product_subscriptions.product`-CHECK-Constraint zulassen (Migration).
 */
export const PRODUCTS: Record<ProductSlug, ProductConfig> = {
  protokollflow: {
    slug: "protokollflow",
    displayName: "ProtokollFlow",
    plans: {
      free: {
        protokolle_pro_monat: 2,
        watermark: true,
        email_versand: false,
        custom_briefkopf: false,
        api_zugang: false,
        priority_processing: false,
        monthly_eur: 0,
        yearly_eur: 0,
      },
      starter: {
        protokolle_pro_monat: 20,
        watermark: false,
        email_versand: true,
        custom_briefkopf: false,
        api_zugang: false,
        priority_processing: false,
        monthly_eur: 99,
        yearly_eur: 990,
        stripe_price_monthly: envOr("STRIPE_PRICE_PROTOKOLLFLOW_STARTER_MONTHLY", envOr("STRIPE_PRICE_STARTER_MONTHLY")),
        stripe_price_yearly: envOr("STRIPE_PRICE_PROTOKOLLFLOW_STARTER_YEARLY", envOr("STRIPE_PRICE_STARTER_YEARLY")),
      },
      pro: {
        protokolle_pro_monat: 999,
        watermark: false,
        email_versand: true,
        custom_briefkopf: true,
        api_zugang: true,
        priority_processing: true,
        monthly_eur: 199,
        yearly_eur: 1990,
        stripe_price_monthly: envOr("STRIPE_PRICE_PROTOKOLLFLOW_PRO_MONTHLY", envOr("STRIPE_PRICE_PRO_MONTHLY")),
        stripe_price_yearly: envOr("STRIPE_PRICE_PROTOKOLLFLOW_PRO_YEARLY", envOr("STRIPE_PRICE_PRO_YEARLY")),
      },
    },
  },
  jahresabrechnung: {
    slug: "jahresabrechnung",
    displayName: "JahresabrechnungAI",
    plans: {
      free: {
        protokolle_pro_monat: 1, watermark: true, email_versand: false,
        custom_briefkopf: false, api_zugang: false, priority_processing: false,
        monthly_eur: 0, yearly_eur: 0,
      },
      starter: {
        protokolle_pro_monat: 5, watermark: false, email_versand: true,
        custom_briefkopf: false, api_zugang: false, priority_processing: false,
        monthly_eur: 149, yearly_eur: 1490,
        stripe_price_monthly: envOr("STRIPE_PRICE_JAHRESABRECHNUNG_STARTER_MONTHLY"),
        stripe_price_yearly:  envOr("STRIPE_PRICE_JAHRESABRECHNUNG_STARTER_YEARLY"),
      },
      pro: {
        protokolle_pro_monat: 25, watermark: false, email_versand: true,
        custom_briefkopf: true, api_zugang: false, priority_processing: true,
        monthly_eur: 299, yearly_eur: 2990,
        stripe_price_monthly: envOr("STRIPE_PRICE_JAHRESABRECHNUNG_PRO_MONTHLY"),
        stripe_price_yearly:  envOr("STRIPE_PRICE_JAHRESABRECHNUNG_PRO_YEARLY"),
      },
    },
  },
  beratungsprotokoll: {
    slug: "beratungsprotokoll",
    displayName: "BeratungsprotokollAI",
    plans: {
      free: {
        protokolle_pro_monat: 3, watermark: true, email_versand: false,
        custom_briefkopf: false, api_zugang: false, priority_processing: false,
        monthly_eur: 0, yearly_eur: 0,
      },
      starter: {
        protokolle_pro_monat: 30, watermark: false, email_versand: true,
        custom_briefkopf: false, api_zugang: false, priority_processing: false,
        monthly_eur: 79, yearly_eur: 790,
        stripe_price_monthly: envOr("STRIPE_PRICE_BERATUNGSPROTOKOLL_STARTER_MONTHLY"),
        stripe_price_yearly:  envOr("STRIPE_PRICE_BERATUNGSPROTOKOLL_STARTER_YEARLY"),
      },
      pro: {
        protokolle_pro_monat: 999, watermark: false, email_versand: true,
        custom_briefkopf: true, api_zugang: true, priority_processing: true,
        monthly_eur: 149, yearly_eur: 1490,
        stripe_price_monthly: envOr("STRIPE_PRICE_BERATUNGSPROTOKOLL_PRO_MONTHLY"),
        stripe_price_yearly:  envOr("STRIPE_PRICE_BERATUNGSPROTOKOLL_PRO_YEARLY"),
      },
    },
  },
  vorstandsprotokoll: {
    slug: "vorstandsprotokoll",
    displayName: "VorstandsprotokollAI",
    plans: {
      free: {
        protokolle_pro_monat: 2, watermark: true, email_versand: false,
        custom_briefkopf: false, api_zugang: false, priority_processing: false,
        monthly_eur: 0, yearly_eur: 0,
      },
      starter: {
        protokolle_pro_monat: 10, watermark: false, email_versand: true,
        custom_briefkopf: false, api_zugang: false, priority_processing: false,
        monthly_eur: 49, yearly_eur: 490,
        stripe_price_monthly: envOr("STRIPE_PRICE_VORSTANDSPROTOKOLL_STARTER_MONTHLY"),
        stripe_price_yearly:  envOr("STRIPE_PRICE_VORSTANDSPROTOKOLL_STARTER_YEARLY"),
      },
      pro: {
        protokolle_pro_monat: 999, watermark: false, email_versand: true,
        custom_briefkopf: true, api_zugang: true, priority_processing: true,
        monthly_eur: 119, yearly_eur: 1190,
        stripe_price_monthly: envOr("STRIPE_PRICE_VORSTANDSPROTOKOLL_PRO_MONTHLY"),
        stripe_price_yearly:  envOr("STRIPE_PRICE_VORSTANDSPROTOKOLL_PRO_YEARLY"),
      },
    },
  },
  pflegedoku: {
    slug: "pflegedoku",
    displayName: "PflegedokuAI",
    plans: {
      free: {
        protokolle_pro_monat: 0, watermark: true, email_versand: false,
        custom_briefkopf: false, api_zugang: false, priority_processing: false,
        monthly_eur: 0, yearly_eur: 0,
      },
      starter: {
        protokolle_pro_monat: 999, watermark: false, email_versand: true,
        custom_briefkopf: false, api_zugang: false, priority_processing: false,
        monthly_eur: 199, yearly_eur: 1990,
        stripe_price_monthly: envOr("STRIPE_PRICE_PFLEGEDOKU_STARTER_MONTHLY"),
        stripe_price_yearly:  envOr("STRIPE_PRICE_PFLEGEDOKU_STARTER_YEARLY"),
      },
      pro: {
        protokolle_pro_monat: 9999, watermark: false, email_versand: true,
        custom_briefkopf: true, api_zugang: true, priority_processing: true,
        monthly_eur: 399, yearly_eur: 3990,
        stripe_price_monthly: envOr("STRIPE_PRICE_PFLEGEDOKU_PRO_MONTHLY"),
        stripe_price_yearly:  envOr("STRIPE_PRICE_PFLEGEDOKU_PRO_YEARLY"),
      },
    },
  },
  mitarbeitergespraech: {
    slug: "mitarbeitergespraech",
    displayName: "MitarbeitergespraechAI",
    plans: {
      free: {
        protokolle_pro_monat: 2, watermark: true, email_versand: false,
        custom_briefkopf: false, api_zugang: false, priority_processing: false,
        monthly_eur: 0, yearly_eur: 0,
      },
      starter: {
        protokolle_pro_monat: 15, watermark: false, email_versand: true,
        custom_briefkopf: false, api_zugang: false, priority_processing: false,
        monthly_eur: 79, yearly_eur: 790,
        stripe_price_monthly: envOr("STRIPE_PRICE_MITARBEITERGESPRAECH_STARTER_MONTHLY"),
        stripe_price_yearly:  envOr("STRIPE_PRICE_MITARBEITERGESPRAECH_STARTER_YEARLY"),
      },
      pro: {
        protokolle_pro_monat: 999, watermark: false, email_versand: true,
        custom_briefkopf: true, api_zugang: true, priority_processing: true,
        monthly_eur: 149, yearly_eur: 1490,
        stripe_price_monthly: envOr("STRIPE_PRICE_MITARBEITERGESPRAECH_PRO_MONTHLY"),
        stripe_price_yearly:  envOr("STRIPE_PRICE_MITARBEITERGESPRAECH_PRO_YEARLY"),
      },
    },
  },
  therapiedoku: {
    slug: "therapiedoku",
    displayName: "TherapieDokuFlow",
    plans: {
      free: {
        protokolle_pro_monat: 5, watermark: true, email_versand: false,
        custom_briefkopf: false, api_zugang: false, priority_processing: false,
        monthly_eur: 0, yearly_eur: 0,
      },
      starter: {
        protokolle_pro_monat: 100, watermark: false, email_versand: true,
        custom_briefkopf: false, api_zugang: false, priority_processing: false,
        monthly_eur: 99, yearly_eur: 990,
        stripe_price_monthly: envOr("STRIPE_PRICE_THERAPIEDOKU_STARTER_MONTHLY"),
        stripe_price_yearly:  envOr("STRIPE_PRICE_THERAPIEDOKU_STARTER_YEARLY"),
      },
      pro: {
        protokolle_pro_monat: 999, watermark: false, email_versand: true,
        custom_briefkopf: true, api_zugang: true, priority_processing: true,
        monthly_eur: 199, yearly_eur: 1990,
        stripe_price_monthly: envOr("STRIPE_PRICE_THERAPIEDOKU_PRO_MONTHLY"),
        stripe_price_yearly:  envOr("STRIPE_PRICE_THERAPIEDOKU_PRO_YEARLY"),
      },
    },
  },
  gefaehrdungsbeurteilung: {
    slug: "gefaehrdungsbeurteilung",
    displayName: "GefaehrdungsbeurteilungAI",
    plans: {
      free: {
        protokolle_pro_monat: 1, watermark: true, email_versand: false,
        custom_briefkopf: false, api_zugang: false, priority_processing: false,
        monthly_eur: 0, yearly_eur: 0,
      },
      // "Solo": 1 Organisation, bis 5 Arbeitsbereiche (App-seitig enforced)
      starter: {
        protokolle_pro_monat: 10, watermark: false, email_versand: true,
        custom_briefkopf: false, api_zugang: false, priority_processing: false,
        monthly_eur: 79, yearly_eur: 790,
        stripe_price_monthly: envOr("STRIPE_PRICE_GEFAEHRDUNGSBEURTEILUNG_STARTER_MONTHLY"),
        stripe_price_yearly:  envOr("STRIPE_PRICE_GEFAEHRDUNGSBEURTEILUNG_STARTER_YEARLY"),
      },
      // "Pro": unbegrenzte Bereiche + Massnahmen-Tracking + Briefkopf.
      // (Berater-Tier 299 EUR mit Multi-Client-Workspaces: Backlog, braucht
      // Plan-Typ-Erweiterung im Engine-Katalog.)
      pro: {
        protokolle_pro_monat: 999, watermark: false, email_versand: true,
        custom_briefkopf: true, api_zugang: true, priority_processing: true,
        monthly_eur: 149, yearly_eur: 1490,
        stripe_price_monthly: envOr("STRIPE_PRICE_GEFAEHRDUNGSBEURTEILUNG_PRO_MONTHLY"),
        stripe_price_yearly:  envOr("STRIPE_PRICE_GEFAEHRDUNGSBEURTEILUNG_PRO_YEARLY"),
      },
    },
  },
  schaden: {
    slug: "schaden",
    displayName: "SchadenAI",
    plans: emptyPlans(),
  },
};

function emptyPlans(): Record<Plan, PlanLimits & PlanPricing> {
  return {
    free: zeroLimits(0, 0),
    starter: zeroLimits(0, 0),
    pro: zeroLimits(0, 0),
  };
}

function zeroLimits(monthly: number, yearly: number): PlanLimits & PlanPricing {
  return {
    protokolle_pro_monat: 0,
    watermark: false,
    email_versand: false,
    custom_briefkopf: false,
    api_zugang: false,
    priority_processing: false,
    monthly_eur: monthly,
    yearly_eur: yearly,
  };
}

/**
 * Liefert Stripe-Price-ID für (product, plan, interval).
 * Returnt null wenn nicht konfiguriert (z. B. free-Plan oder Produkt
 * noch nicht ausgerollt).
 */
export function getProductPrice(
  product: ProductSlug,
  plan: Plan,
  interval: BillingInterval
): string | null {
  if (plan === "free") return null;
  const config = PRODUCTS[product]?.plans[plan];
  if (!config) return null;
  const id =
    interval === "monthly"
      ? config.stripe_price_monthly
      : config.stripe_price_yearly;
  return id || null;
}

/**
 * Reverse-Lookup: gegeben eine Stripe-Price-ID, finde (product, plan).
 */
export function getPlanFromPriceId(
  priceId: string
): { product: ProductSlug; plan: Plan } | null {
  if (!priceId) return null;
  for (const product of Object.keys(PRODUCTS) as ProductSlug[]) {
    const plans = PRODUCTS[product].plans;
    for (const plan of ["starter", "pro"] as Plan[]) {
      const cfg = plans[plan];
      if (
        cfg.stripe_price_monthly === priceId ||
        cfg.stripe_price_yearly === priceId
      ) {
        return { product, plan };
      }
    }
  }
  return null;
}
