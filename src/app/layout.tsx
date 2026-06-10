import type { Metadata } from "next";
import "./globals.css";
import { PlausibleAnalytics } from "@/components/analytics/plausible";

export const metadata: Metadata = {
  title: "VorstandsprotokollAI",
  description: "AI-Protokolle fuer GmbH/AR/Stiftung/Betriebsrat/Stadtrat",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <PlausibleAnalytics />
        {children}
      </body>
    </html>
  );
}
