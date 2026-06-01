import type { Config } from "tailwindcss";

// Semantic color tokens backed by CSS variables (defined in globals.css for
// light + dark). Using the rgb(var(--x) / <alpha-value>) form keeps Tailwind's
// opacity modifiers (e.g. text-coffee/70) working.
const token = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // page + surfaces
        cream: token("--bg"), // page background
        surface: token("--surface"), // cards
        sand: token("--surface-2"), // muted insets
        crema: token("--border"), // borders
        // text
        espresso: token("--fg"), // primary text
        coffee: token("--fg"), // neutral; (with opacity) secondary text
        muted: token("--muted"), // secondary text
        // brand / interactive (single indigo accent system)
        brand: token("--accent"),
        accent: token("--accent"),
        accentfg: token("--accent-fg"),
        terracotta: token("--accent"), // legacy alias → accent
        // semantic states
        positive: token("--positive"),
        sage: token("--positive"), // legacy alias → positive
        danger: token("--danger"),
        star: token("--star"),
        // legacy aliases
        latte: token("--accent"),
        bean: token("--fg"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
      },
      boxShadow: {
        // Soft UI Evolution: softer than flat, clearer than neumorphism
        soft: "0 1px 2px rgb(28 25 23 / 0.04), 0 2px 8px rgb(28 25 23 / 0.06)",
        card: "0 1px 3px rgb(28 25 23 / 0.05), 0 10px 30px -12px rgb(28 25 23 / 0.12)",
        pop: "0 8px 30px -8px rgb(28 25 23 / 0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
