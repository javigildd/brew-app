// Shared domain types + option lists (bilingual labels).

export type Lang = "es" | "en";

export interface Coffee {
  id: string;
  created_at: string;
  date_added: string;
  roaster: string | null;
  name: string | null;
  origin: string | null;
  producer: string | null;
  variety: string | null;
  process: string | null;
  altitude: string | null;
  tasting_notes: string[];
  roast_level: RoastLevel | null;
  roast_purpose: RoastPurpose | null;
  decaf: boolean;
  weight_grams: number | null;
  price: number | null;
  currency: string | null;
  photo_url: string | null;
  rating: number | null;
  liked: boolean | null;
  comments: string | null;
}

export interface Recipe {
  id: string;
  created_at: string;
  coffee_id: string | null;
  name: string | null;
  method: BrewMethod | null;
  dose_grams: number | null;
  yield_grams: number | null;
  grind: string | null;
  water_temp_c: number | null;
  time_seconds: number | null;
  milk_ml: number | null;
  milk_type: MilkType | null;
  ice: boolean;
  notes: string | null;
}

export interface Brew {
  id: string;
  created_at: string;
  coffee_id: string;
  recipe_id: string | null;
  brew_date: string;
  drink_type: DrinkType | null;
  liked: boolean | null;
  rating: number | null;
  notes: string | null;
}

export interface CoffeeDetail {
  coffee: Coffee;
  brews: Brew[];
  recipes: Recipe[];
}

// ── Option value unions ──
export type RoastLevel =
  | "light"
  | "medium-light"
  | "medium"
  | "medium-dark"
  | "dark";
export type RoastPurpose = "filter" | "espresso" | "omni";
export type BrewMethod =
  | "espresso"
  | "v60"
  | "aeropress"
  | "frenchpress"
  | "moka"
  | "chemex"
  | "coldbrew"
  | "other";
export type MilkType =
  | "whole"
  | "semi"
  | "skim"
  | "oat"
  | "almond"
  | "soy"
  | "other";
export type DrinkType =
  | "espresso"
  | "filter"
  | "americano"
  | "cortado"
  | "flatwhite"
  | "cappuccino"
  | "latte"
  | "coldbrew"
  | "icedlatte"
  | "other";

// ── Bilingual option lists ──
export interface Opt<T extends string> {
  value: T;
  es: string;
  en: string;
}

export const ROAST_LEVELS: Opt<RoastLevel>[] = [
  { value: "light", es: "Claro", en: "Light" },
  { value: "medium-light", es: "Medio-claro", en: "Medium-light" },
  { value: "medium", es: "Medio", en: "Medium" },
  { value: "medium-dark", es: "Medio-oscuro", en: "Medium-dark" },
  { value: "dark", es: "Oscuro", en: "Dark" },
];

export const ROAST_PURPOSES: Opt<RoastPurpose>[] = [
  { value: "filter", es: "Filtro", en: "Filter" },
  { value: "espresso", es: "Espresso", en: "Espresso" },
  { value: "omni", es: "Omni (multi)", en: "Omni (multi)" },
];

export const BREW_METHODS: Opt<BrewMethod>[] = [
  { value: "espresso", es: "Espresso", en: "Espresso" },
  { value: "v60", es: "V60", en: "V60" },
  { value: "aeropress", es: "Aeropress", en: "Aeropress" },
  { value: "frenchpress", es: "Prensa francesa", en: "French press" },
  { value: "moka", es: "Moka", en: "Moka pot" },
  { value: "chemex", es: "Chemex", en: "Chemex" },
  { value: "coldbrew", es: "Cold brew", en: "Cold brew" },
  { value: "other", es: "Otro", en: "Other" },
];

export const MILK_TYPES: Opt<MilkType>[] = [
  { value: "whole", es: "Entera", en: "Whole" },
  { value: "semi", es: "Semidesnatada", en: "Semi-skimmed" },
  { value: "skim", es: "Desnatada", en: "Skimmed" },
  { value: "oat", es: "Avena", en: "Oat" },
  { value: "almond", es: "Almendra", en: "Almond" },
  { value: "soy", es: "Soja", en: "Soy" },
  { value: "other", es: "Otra", en: "Other" },
];

export const DRINK_TYPES: Opt<DrinkType>[] = [
  { value: "espresso", es: "Espresso", en: "Espresso" },
  { value: "filter", es: "Filtro", en: "Filter" },
  { value: "americano", es: "Americano", en: "Americano" },
  { value: "cortado", es: "Cortado", en: "Cortado" },
  { value: "flatwhite", es: "Flat white", en: "Flat white" },
  { value: "cappuccino", es: "Capuchino", en: "Cappuccino" },
  { value: "latte", es: "Latte", en: "Latte" },
  { value: "coldbrew", es: "Cold brew", en: "Cold brew" },
  { value: "icedlatte", es: "Latte con hielo", en: "Iced latte" },
  { value: "other", es: "Otro", en: "Other" },
];

// Free-text process suggestions (datalist)
export const PROCESS_SUGGESTIONS = [
  "Washed",
  "Natural",
  "Honey",
  "Anaerobic",
  "Carbonic maceration",
  "Wet hulled",
];

export function optLabel<T extends string>(
  opts: Opt<T>[],
  value: T | null | undefined,
  lang: Lang,
): string {
  if (!value) return "";
  const o = opts.find((x) => x.value === value);
  return o ? o[lang] : value;
}
