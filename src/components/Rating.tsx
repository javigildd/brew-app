"use client";

import { ThumbsUp, ThumbsDown, Meh, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Verdict } from "@/lib/types";

const OPTIONS: {
  v: Verdict;
  key: "liked_yes" | "liked_neutral" | "liked_no";
  Icon: typeof ThumbsUp;
  on: string;
}[] = [
  { v: 1, key: "liked_yes", Icon: ThumbsUp, on: "bg-emerald-500 text-emerald-950" },
  { v: 0, key: "liked_neutral", Icon: Meh, on: "bg-amber-400 text-amber-950" },
  { v: -1, key: "liked_no", Icon: ThumbsDown, on: "bg-rose-500 text-rose-950" },
];

export function LikeButtons({
  value,
  onChange,
  size = "md",
}: {
  value: Verdict | null;
  onChange: (v: Verdict | null) => void;
  size?: "sm" | "md";
}) {
  const { t } = useI18n();
  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-sm";
  const ic = size === "sm" ? 14 : 16;
  return (
    <div className="inline-flex flex-wrap gap-2">
      {OPTIONS.map(({ v, key, Icon, on }) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(value === v ? null : v)}
          className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition ${pad} ${
            value === v
              ? on
              : "border border-crema bg-surface text-muted hover:text-espresso"
          }`}
        >
          <Icon size={ic} /> {t(key)}
        </button>
      ))}
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
        const filled = n <= v;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(value === n ? null : n)}
            className={`p-0.5 transition ${readOnly ? "cursor-default" : "hover:scale-110"} ${
              filled ? "text-star" : "text-crema"
            }`}
            aria-label={`${n}`}
          >
            <Star size={readOnly ? 16 : 22} fill={filled ? "currentColor" : "none"} strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}

export function LikeBadge({ value }: { value: Verdict | null }) {
  const { t } = useI18n();
  if (value === null || value === undefined) return null;
  const map = {
    "1": { cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300", Icon: ThumbsUp, key: "liked_yes" },
    "0": { cls: "bg-amber-500/15 text-amber-600 dark:text-amber-300", Icon: Meh, key: "liked_neutral" },
    "-1": { cls: "bg-rose-500/15 text-rose-600 dark:text-rose-300", Icon: ThumbsDown, key: "liked_no" },
  } as const;
  const { cls, Icon, key } = map[String(value) as "1" | "0" | "-1"];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>
      <Icon size={12} /> {t(key)}
    </span>
  );
}
