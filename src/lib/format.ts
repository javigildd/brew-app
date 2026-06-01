import type { Lang } from "./types";

export function ratio(dose: number | null, yield_: number | null): string {
  if (!dose || !yield_ || dose <= 0) return "";
  return `1:${(yield_ / dose).toFixed(1)}`;
}

export function formatTime(seconds: number | null): string {
  if (!seconds || seconds <= 0) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
}

export function formatDate(iso: string | null, lang: Lang): string {
  if (!iso) return "";
  // Date-only strings ("YYYY-MM-DD") must be parsed as LOCAL time, otherwise
  // `new Date("2026-06-01")` is UTC midnight and renders as the previous day
  // in negative-UTC-offset timezones.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  const d = m
    ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    : new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function todayISO(): string {
  // Local calendar date (not UTC), so late evening doesn't record tomorrow.
  const n = new Date();
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`;
}
