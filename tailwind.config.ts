import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        board: "#F7F3EA",
        surface: "#FFFDF7",
        ink: "#16140F",
        muted: "#7A745F",
        line: "#E5DFD0",
        primary: { DEFAULT: "#D9482F", dark: "#C33D25", soft: "#FDF2F0" },
        wire: {
          red: "#D9482F",
          yellow: "#E8A020",
          green: "#2C8C54",
          blue: "#2F5FD0",
          copper: "#C2703D",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-ibm-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { card: "16px", pill: "999px" },
      boxShadow: {
        card: "0 1px 2px rgba(23,25,30,.06), 0 8px 24px -12px rgba(23,25,30,.14)",
        pop: "0 2px 4px rgba(23,25,30,.08), 0 16px 40px -12px rgba(43,75,242,.22)",
        "solid-4": "4px 4px 0 #16140F",
        "solid-6": "6px 6px 0 #16140F",
      },
      backgroundImage: {
        dots: "radial-gradient(circle, #D9D2BF 1.3px, transparent 1.3px)",
      },
      backgroundSize: { dots: "26px 26px" },
    },
  },
  plugins: [],
} satisfies Config;

