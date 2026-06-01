"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "./types";

type Dict = Record<string, { es: string; en: string }>;

// All UI strings. Add keys here as the app grows.
const DICT: Dict = {
  appName: { es: "Brew", en: "Brew" },
  tagline: { es: "Tu diario de café", en: "Your coffee journal" },

  // nav
  nav_home: { es: "Cafés", en: "Coffees" },
  nav_add: { es: "Añadir", en: "Add" },
  nav_stats: { es: "Estadísticas", en: "Insights" },
  logout: { es: "Salir", en: "Log out" },

  // login
  login_title: { es: "Entrar en Brew", en: "Sign in to Brew" },
  login_password: { es: "Contraseña", en: "Password" },
  login_button: { es: "Entrar", en: "Sign in" },
  login_error: { es: "Contraseña incorrecta", en: "Wrong password" },

  // dashboard
  home_empty: {
    es: "Aún no has añadido ningún café. ¡Empieza escaneando un paquete!",
    en: "No coffees yet. Start by scanning a bag!",
  },
  home_add_first: { es: "Añadir mi primer café", en: "Add my first coffee" },
  search_placeholder: {
    es: "Buscar por nombre, tostador, origen…",
    en: "Search by name, roaster, origin…",
  },
  loading: { es: "Cargando…", en: "Loading…" },

  // add flow
  add_title: { es: "Añadir café", en: "Add coffee" },
  add_take_photo: {
    es: "Haz una foto del paquete",
    en: "Take a photo of the bag",
  },
  add_choose_photo: { es: "Elegir foto", en: "Choose photo" },
  add_retake: { es: "Cambiar foto", en: "Change photo" },
  add_extracting: {
    es: "Leyendo el paquete con IA…",
    en: "Reading the bag with AI…",
  },
  add_extract_again: { es: "Volver a leer", en: "Read again" },
  add_no_photo_note: {
    es: "También puedes rellenar los datos a mano.",
    en: "You can also fill in the details manually.",
  },
  add_extract_error: {
    es: "No pude leer el paquete. Rellena los datos a mano.",
    en: "Couldn't read the bag. Fill in the details manually.",
  },

  // coffee fields
  f_roaster: { es: "Tostador", en: "Roaster" },
  f_name: { es: "Nombre del café", en: "Coffee name" },
  f_origin: { es: "Origen", en: "Origin" },
  f_country: { es: "País", en: "Country" },
  f_region: { es: "Región", en: "Region" },
  f_producer: { es: "Productor / finca", en: "Producer / farm" },
  f_variety: { es: "Variedad", en: "Variety" },
  f_process: { es: "Proceso", en: "Process" },
  f_altitude: { es: "Altitud", en: "Altitude" },
  f_tasting_notes: { es: "Notas de cata", en: "Tasting notes" },
  f_tasting_notes_hint: {
    es: "Separadas por comas",
    en: "Comma-separated",
  },
  f_roast_level: { es: "Nivel de tueste", en: "Roast level" },
  f_roast_purpose: { es: "Tueste para", en: "Roast for" },
  f_decaf: { es: "Descafeinado", en: "Decaf" },
  f_weight: { es: "Peso (g)", en: "Weight (g)" },
  f_price: { es: "Precio", en: "Price" },
  f_currency: { es: "Moneda", en: "Currency" },
  f_date_added: { es: "Fecha", en: "Date" },
  f_rating: { es: "Valoración", en: "Rating" },
  f_liked: { es: "¿Te ha gustado?", en: "Did you like it?" },
  f_comments: { es: "Comentarios", en: "Comments" },

  // generic
  save: { es: "Guardar", en: "Save" },
  saving: { es: "Guardando…", en: "Saving…" },
  cancel: { es: "Cancelar", en: "Cancel" },
  edit: { es: "Editar", en: "Edit" },
  delete: { es: "Eliminar", en: "Delete" },
  confirm_delete: {
    es: "¿Seguro que quieres eliminarlo?",
    en: "Are you sure you want to delete this?",
  },
  back: { es: "Volver", en: "Back" },
  none: { es: "—", en: "—" },
  optional: { es: "opcional", en: "optional" },
  yes: { es: "Sí", en: "Yes" },
  no: { es: "No", en: "No" },

  // ratings
  liked_yes: { es: "Me gustó", en: "Liked" },
  liked_neutral: { es: "Normal", en: "Okay" },
  liked_no: { es: "No me gustó", en: "Disliked" },

  // coffee detail
  detail_brews: { es: "Preparaciones", en: "Brews" },
  detail_recipes: { es: "Recetas", en: "Recipes" },
  detail_add_brew: { es: "+ Nueva preparación", en: "+ New brew" },
  detail_add_recipe: { es: "+ Nueva receta", en: "+ New recipe" },
  detail_no_brews: {
    es: "Sin preparaciones todavía.",
    en: "No brews yet.",
  },
  detail_no_recipes: {
    es: "Sin recetas todavía.",
    en: "No recipes yet.",
  },

  // brew fields
  b_drink_type: { es: "Tipo de bebida", en: "Drink type" },
  b_recipe: { es: "Receta usada", en: "Recipe used" },
  b_date: { es: "Fecha", en: "Date" },
  b_no_recipe: { es: "Sin receta", en: "No recipe" },

  // recipe fields
  r_name: { es: "Nombre de la receta", en: "Recipe name" },
  r_method: { es: "Método", en: "Method" },
  r_dose: { es: "Café (g)", en: "Coffee in (g)" },
  r_yield: { es: "Bebida (g)", en: "Liquid out (g)" },
  r_ratio: { es: "Ratio", en: "Ratio" },
  r_grind: { es: "Molienda", en: "Grind" },
  r_temp: { es: "Temp. agua (°C)", en: "Water temp (°C)" },
  r_time: { es: "Tiempo (s)", en: "Time (s)" },
  r_milk: { es: "Leche (ml)", en: "Milk (ml)" },
  r_milk_type: { es: "Tipo de leche", en: "Milk type" },
  r_ice: { es: "Con hielo", en: "With ice" },
  r_notes: { es: "Notas", en: "Notes" },

  // stats
  stats_title: { es: "Tus conclusiones", en: "Your insights" },
  stats_intro: {
    es: "Qué tipo de café te gusta más, según tus valoraciones.",
    en: "What kind of coffee you like most, based on your ratings.",
  },
  stats_no_data: {
    es: "Añade cafés y valora tus preparaciones para ver conclusiones.",
    en: "Add coffees and rate your brews to see insights here.",
  },
  stats_by_process: { es: "Por proceso", en: "By process" },
  stats_by_origin: { es: "Por origen", en: "By origin" },
  stats_by_country: { es: "Por país", en: "By country" },
  stats_by_region: { es: "Por región", en: "By region" },
  stats_by_roast: { es: "Por tueste", en: "By roast level" },
  stats_by_purpose: { es: "Por tipo de tueste", en: "By roast purpose" },
  stats_by_drink: { es: "Por bebida", en: "By drink" },
  stats_avg_rating: { es: "Nota media", en: "Avg rating" },
  stats_likes: { es: "% me gusta", en: "% liked" },
  stats_count: { es: "muestras", en: "samples" },
  stats_total_coffees: { es: "cafés", en: "coffees" },
  stats_total_brews: { es: "preparaciones", en: "brews" },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof DICT | string) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const saved = localStorage.getItem("brew_lang");
    if (saved === "es" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("brew_lang", l);
  };

  const t = (key: string) => {
    const entry = DICT[key];
    return entry ? entry[lang] : key;
  };

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
