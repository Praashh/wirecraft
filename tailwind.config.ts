import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        board: "#F2F1EC",
        surface: "#FFFFFF",
        ink: "#17191E",
        muted: "#6B6E76",
        line: "#E3E1D9",
        primary: { DEFAULT: "#2B4BF2", dark: "#1F38C2", soft: "#EBEEFE" },
        wire: {
          red: "#E5484D",
          yellow: "#F0B100",
          green: "#2FA36B",
          blue: "#2B4BF2",
          copper: "#C2703D",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: { card: "16px", pill: "999px" },
      boxShadow: {
        card: "0 1px 2px rgba(23,25,30,.06), 0 8px 24px -12px rgba(23,25,30,.14)",
        pop: "0 2px 4px rgba(23,25,30,.08), 0 16px 40px -12px rgba(43,75,242,.22)",
      },
      backgroundImage: {
        dots: "radial-gradient(circle, #D8D6CC 1.2px, transparent 1.2px)",
      },
      backgroundSize: { dots: "22px 22px" },
    },
  },
  plugins: [],
} satisfies Config;
