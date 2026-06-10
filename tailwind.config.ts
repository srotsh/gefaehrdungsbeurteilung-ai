/* AUTO-GENERATED via shared-core/scripts/gen-tailwind-config.py */
import type { Config } from "tailwindcss";


const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/core/ui/**/*.{ts,tsx}",
  ],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        // shadcn defaults preserved (HSL CSS-vars)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Flow brand palette
        cognac: {
          50:  "#faf3eb",
          100: "#f3e3cf",
          200: "#e8c8a4",
          300: "#d9a772",
          400: "#c98748",
          500: "#a36a2a",
          600: "#8a5821",
          700: "#6f461c",
          800: "#54351a",
          900: "#3a2614",
        },
        parchment: {
          50:  "#fdfaf3",
          100: "#faf6ec",
          200: "#f3ead9",
          300: "#e8dcc1",
          400: "#d6c7a5",
          500: "#bca982",
          600: "#998866",
          700: "#776850",
          800: "#54493a",
          900: "#322c24",
        },
        petrol: {
          50:  "#edf3f5",
          100: "#d3e0e4",
          200: "#a6c0c9",
          300: "#719ba8",
          400: "#427785",
          500: "#2a5e6c",
          600: "#1f4956",
          700: "#173742",
          800: "#102832",
          900: "#0a1a22",
        },
        ink: {
          DEFAULT: "#1a1a1a",
          muted:   "#5b5b5b",
          subtle:  "#8a8a8a",
        },
      },
      fontFamily: {
        display: ['"Source Serif Pro"', "Georgia", "serif"],
        sans: ['Inter', '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      fontSize: {
        "display-md": ["2rem",   { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-lg": ["2.75rem", { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
        "display-xl": ["3.5rem",  { lineHeight: "1.05", letterSpacing: "-0.025em" }],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(20,15,8,0.04), 0 2px 6px rgba(20,15,8,0.05)",
        card: "0 4px 14px rgba(20,15,8,0.06), 0 2px 4px rgba(20,15,8,0.04)",
      },
      backgroundImage: {
        "parchment-grain":
          "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%221.4%22 numOctaves=%222%22 stitchTiles=%22stitch%22/><feColorMatrix values=%220 0 0 0 0.6  0 0 0 0 0.45  0 0 0 0 0.25  0 0 0 0.5 0%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
