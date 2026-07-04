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
        // brand / interactive (copper accent system)
        brand: token("--accent"),
        accent: token("--accent"),
        accent2: token("--accent-2"),
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
        // "serif" is the display slot — mapped to Space Grotesk
        serif: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        // Near-flat: hairlines do the work, shadows only whisper
        soft: "0 1px 2px rgb(0 0 0 / 0.03)",
        card: "0 1px 2px rgb(0 0 0 / 0.04), 0 2px 8px -2px rgb(0 0 0 / 0.04)",
        pop: "0 2px 4px rgb(0 0 0 / 0.05), 0 8px 24px -8px rgb(0 0 0 / 0.12)",
        btn: "0 1px 2px rgb(0 0 0 / 0.1)",
        "btn-hover": "0 2px 8px rgb(0 0 0 / 0.12)",
        inset: "inset 0 1px 2px rgb(0 0 0 / 0.03)",
        dock: "0 -1px 0 rgb(0 0 0 / 0.03)",
      },
      borderRadius: {
        xl2: "0.875rem",
        xl3: "1.25rem",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(10px) scale(0.99)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out both",
        rise: "rise 0.45s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
