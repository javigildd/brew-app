"use client";

import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
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
  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  const ic = size === "sm" ? 14 : 16;
  const toggle = (v: boolean) => onChange(value === v ? null : v);
  return (
    <div className="inline-flex gap-2">
      <button
        type="button"
        onClick={() => toggle(true)}
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition ${pad} ${
          value === true
            ? "bg-positive text-cream"
            : "border border-crema bg-surface text-muted hover:text-espresso"
        }`}
      >
        <ThumbsUp size={ic} /> {t("liked_yes")}
      </button>
      <button
        type="button"
        onClick={() => toggle(false)}
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition ${pad} ${
          value === false
            ? "bg-danger text-cream"
            : "border border-crema bg-surface text-muted hover:text-espresso"
        }`}
      >
        <ThumbsDown size={ic} /> {t("liked_no")}
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
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= v;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(value === n ? null : n)}
            className={`p-0.5 transition ${readOnly ? "cursor-default" : "hover:scale-110"} ${
              on ? "text-star" : "text-crema"
            }`}
            aria-label={`${n}`}
          >
            <Star size={readOnly ? 16 : 22} fill={on ? "currentColor" : "none"} strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}

export function LikeBadge({ value }: { value: boolean | null }) {
  const { t } = useI18n();
  if (value === null || value === undefined) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
        value ? "bg-positive/15 text-positive" : "bg-danger/15 text-danger"
      }`}
    >
      {value ? <ThumbsUp size={12} /> : <ThumbsDown size={12} />}
      {value ? t("liked_yes") : t("liked_no")}
    </span>
  );
}
