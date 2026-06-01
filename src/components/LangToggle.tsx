"use client";

import { useI18n } from "@/lib/i18n";

export default function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="inline-flex overflow-hidden rounded-full border border-crema text-xs font-semibold">
      <button
        type="button"
        onClick={() => setLang("es")}
        className={`px-3 py-1 ${lang === "es" ? "bg-coffee text-cream" : "bg-white text-coffee"}`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-3 py-1 ${lang === "en" ? "bg-coffee text-cream" : "bg-white text-coffee"}`}
      >
        EN
      </button>
    </div>
  );
}
