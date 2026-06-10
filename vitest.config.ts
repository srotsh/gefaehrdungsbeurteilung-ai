import { defineConfig } from "vitest/config";
import path from "node:path";

// @flow/* sind pnpm-workspace-Links auf src/core/* (reine TS-Quellen) —
// für Vitest direkt aliasen, damit Vite sie transpiliert statt extern lädt.
const flowAliases = Object.fromEntries(
  Object.entries({
    "@flow/ai": "ai",
    "@flow/auth": "auth",
    "@flow/billing": "billing",
    "@flow/core": "domain",
    "@flow/db": "db",
    "@flow/email": "email",
    "@flow/pdf": "pdf",
    "@flow/storage": "storage",
    "@flow/ui": "ui",
  }).map(([pkg, dir]) => [pkg, path.resolve(__dirname, `./src/core/${dir}/index.ts`)])
);

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tests/**/*.{test,spec}.{ts,tsx}",
    ],
    globals: true,
  },
  resolve: {
    alias: {
      ...flowAliases,
      "@": path.resolve(__dirname, "./src"),
      // @flow/* importiert "server-only" — im Test-Runner unschädlich stubben.
      "server-only": path.resolve(__dirname, "./tests/server-only-stub.ts"),
    },
  },
});
