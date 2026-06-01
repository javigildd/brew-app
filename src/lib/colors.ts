// Category color-coding for chips (country, process, roast level).
// NOTE: every class string here is a STATIC literal so Tailwind's content
// scanner generates the utilities. Do not build these strings dynamically.

import type { RoastLevel } from "./types";

export const CHIP_BASE =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium";
export const CHIP_NEUTRAL = "bg-sand text-muted";

// A palette of distinct hues, each with light + dark variants.
const PALETTE: string[] = [
  "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",
  "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200",
  "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
  "bg-lime-100 text-lime-700 dark:bg-lime-500/20 dark:text-lime-200",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
  "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-200",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-200",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200",
  "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200",
  "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-200",
  "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-200",
];

// Deterministic hash → palette index, so a given string always maps to the
// same color.
function hashIndex(s: string, n: number): number {
  let h = 0;
  const str = s.toLowerCase().trim();
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % n;
}

export function countryColor(country: string | null | undefined): string {
  if (!country) return CHIP_NEUTRAL;
  return PALETTE[hashIndex(country, PALETTE.length)];
}

// Known specialty processes get fixed colors; anything else hashes to a hue.
const PROCESS_MAP: { match: string; cls: string }[] = [
  { match: "wash", cls: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200" },
  { match: "natural", cls: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200" },
  { match: "honey", cls: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200" },
  { match: "anaerob", cls: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200" },
  { match: "carbonic", cls: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-200" },
  { match: "wet", cls: "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-200" },
  { match: "dry", cls: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200" },
];

export function processColor(process: string | null | undefined): string {
  if (!process) return CHIP_NEUTRAL;
  const p = process.toLowerCase();
  for (const { match, cls } of PROCESS_MAP) if (p.includes(match)) return cls;
  return PALETTE[hashIndex(process, PALETTE.length)];
}

// Roast level uses a fixed warm→dark progression.
const ROAST_MAP: Record<RoastLevel, string> = {
  light: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200",
  "medium-light": "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
  medium: "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200",
  "medium-dark": "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200",
  dark: "bg-stone-200 text-stone-700 dark:bg-stone-500/25 dark:text-stone-200",
};

export function roastColor(level: RoastLevel | null | undefined): string {
  if (!level) return CHIP_NEUTRAL;
  return ROAST_MAP[level] ?? CHIP_NEUTRAL;
}
