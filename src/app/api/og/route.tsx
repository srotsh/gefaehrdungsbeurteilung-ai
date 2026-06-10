/* AUTO-GENERATED via shared-core/scripts/gen-og-images.py */
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const BRAND_NAME = "GefaehrdungsbeurteilungAI";
const BRAND_DOMAIN = "gefaehrdungsbeurteilung-ai.de";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title")?.slice(0, 140) ?? BRAND_NAME;
  const category = searchParams.get("category")?.slice(0, 60) ?? "Ratgeber";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #faf6ef 0%, #f3ead9 100%)",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#a36a2a",
              padding: "8px 16px",
              backgroundColor: "rgba(163, 106, 42, 0.12)",
              borderRadius: 999,
            }}
          >
            {category}
          </div>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#1a1a1a",
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid rgba(163, 106, 42, 0.2)",
            paddingTop: 24,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#1a1a1a",
              display: "flex",
            }}
          >
            {BRAND_NAME}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#666",
              display: "flex",
            }}
          >
            {BRAND_DOMAIN}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
