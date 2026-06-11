import type { MetadataRoute } from "next";

/**
 * AUTO-GENERATED via shared-core/scripts/gen-sitemap.py
 *
 * Wird von Next.js 14 unter /robots.txt ausgeliefert.
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://gefaehrdungsbeurteilung-ai.de";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/ratgeber", "/preise"],
        disallow: ["/dashboard", "/api", "/m", "/login", "/signup"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
