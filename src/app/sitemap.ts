import type { MetadataRoute } from "next";

/**
 * AUTO-GENERATED via shared-core/scripts/gen-sitemap.py
 *
 * Wird von Next.js 14 unter /sitemap.xml ausgeliefert. Bei Topics-Aenderungen
 * Generator neu laufen lassen.
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://gefaehrdungsbeurteilung-ai.de";

const RATGEBER_SLUGS: string[] = [

];

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/preise", priority: 0.9, changeFrequency: "monthly" },
  { path: "/ratgeber", priority: 0.9, changeFrequency: "weekly" },
  { path: "/login", priority: 0.5, changeFrequency: "yearly" },
  { path: "/signup", priority: 0.7, changeFrequency: "yearly" },
  { path: "/impressum", priority: 0.3, changeFrequency: "yearly" },
  { path: "/datenschutz", priority: 0.3, changeFrequency: "yearly" },
  { path: "/agb", priority: 0.3, changeFrequency: "yearly" },
  { path: "/avv", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...STATIC_ROUTES.map((r) => ({
      url: `${BASE_URL}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...RATGEBER_SLUGS.map((slug) => ({
      url: `${BASE_URL}/ratgeber/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
