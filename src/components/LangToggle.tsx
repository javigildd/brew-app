"use client";

import { useI18n } from "@/lib/i18n";

export default function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="inline-flex overflow-hidden rounded-full border border-crema text-xs font-semibold">
      <button
        type="button"
        onClick={() => setLang("es")}
        className={`px-2.5 py-1 transition-colors ${lang === "es" ? "bg-coffee text-cream" : "bg-surface text-muted hover:text-espresso"}`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 transition-colors ${lang === "en" ? "bg-coffee text-cream" : "bg-surface text-muted hover:text-espresso"}`}
      >
        EN
      </button>
    </div>
  );
}
