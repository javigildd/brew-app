"use client";

import { useI18n } from "@/lib/i18n";

export function LikeButtons({
  value,
  onChange,
  size = "md",
}: {
  value: boolean | null;
  onChange: (v: boolean | null) => void;
  size?: "sm" | "md";
}) {
  const { t } = useI18n();
  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm";
  const toggle = (v: boolean) => onChange(value === v ? null : v);
  return (
    <div className="inline-flex gap-2">
      <button
        type="button"
        onClick={() => toggle(true)}
        className={`rounded-full font-semibold transition ${pad} ${
          value === true
            ? "bg-sage text-cream"
            : "border border-crema bg-white text-coffee"
        }`}
      >
        👍 {t("liked_yes")}
      </button>
      <button
        type="button"
        onClick={() => toggle(false)}
        className={`rounded-full font-semibold transition ${pad} ${
          value === false
            ? "bg-terracotta text-cream"
            : "border border-crema bg-white text-coffee"
        }`}
      >
        👎 {t("liked_no")}
      </button>
    </div>
  );
}

export function Stars({
  value,
  onChange,
  readOnly = false,
}: {
  value: number | null;
  onChange?: (v: number | null) => void;
  readOnly?: boolean;
}) {
  const v = value ?? 0;
  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(value === n ? null : n)}
          className={`text-xl leading-none transition ${
            readOnly ? "cursor-default" : "hover:scale-110"
          } ${n <= v ? "text-terracotta" : "text-crema"}`}
          aria-label={`${n}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function LikeBadge({ value }: { value: boolean | null }) {
  const { t } = useI18n();
  if (value === null || value === undefined) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
        value ? "bg-sage/15 text-sage" : "bg-terracotta/15 text-terracotta"
      }`}
    >
      {value ? `👍 ${t("liked_yes")}` : `👎 ${t("liked_no")}`}
    </span>
  );
}
