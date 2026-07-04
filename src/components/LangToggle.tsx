"use client";

import { useI18n } from "@/lib/i18n";

export default function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg bg-sand p-0.5 text-xs font-semibold">
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`rounded-[0.4rem] px-2 py-1 uppercase transition-colors duration-150 ${
            lang === l
              ? "bg-surface text-espresso shadow-soft"
              : "text-muted hover:text-espresso"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
