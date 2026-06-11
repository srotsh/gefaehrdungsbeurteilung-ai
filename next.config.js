/** @type {import('next').NextConfig} */
const nextConfig = {
  // Kein "standalone": Deploy-Ziel ist Vercel (ignoriert standalone) und der
  // Symlink-Kopierschritt schlaegt unter Windows/pnpm fehl.
  transpilePackages: [
    "@flow/core",
    "@flow/auth",
    "@flow/billing",
    "@flow/ui",
    "@flow/ai",
    "@flow/pdf",
    "@flow/storage",
    "@flow/email",
    "@flow/db",
  ],
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
