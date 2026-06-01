import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm coffee palette
        cream: "#FAF6EF",
        sand: "#F1E9DC",
        crema: "#E4D3BC",
        latte: "#C9A27E",
        coffee: "#6F4E37",
        espresso: "#3B2A20",
        bean: "#241712",
        terracotta: "#C4622D",
        sage: "#6B7A5E",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(36,23,18,0.06), 0 8px 24px rgba(36,23,18,0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
