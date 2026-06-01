"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import {
  ROAST_LEVELS,
  ROAST_PURPOSES,
  PROCESS_SUGGESTIONS,
  type RoastLevel,
  type RoastPurpose,
} from "@/lib/types";
import type { CoffeeInput } from "@/lib/validation";
import { Stars, LikeButtons } from "./Rating";
import { todayISO } from "@/lib/format";

export interface CoffeeFormValues extends CoffeeInput {}

function numOrNull(s: string): number | null {
  if (s.trim() === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export default function CoffeeForm({
  defaultValue,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  defaultValue: Partial<CoffeeFormValues>;
  submitLabel: string;
  onSubmit: (v: CoffeeFormValues) => Promise<void>;
  onCancel?: () => void;
}) {
  const { t, lang } = useI18n();
  const d = defaultValue;

  const [dateAdded, setDateAdded] = useState(d.date_added ?? "");
  // Default to today after mount to avoid an SSR/prerender hydration mismatch.
  useEffect(() => {
    if (!d.date_added) setDateAdded(todayISO());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [roaster, setRoaster] = useState(d.roaster ?? "");
  const [name, setName] = useState(d.name ?? "");
  const [origin, setOrigin] = useState(d.origin ?? "");
  const [producer, setProducer] = useState(d.producer ?? "");
  const [variety, setVariety] = useState(d.variety ?? "");
  const [process, setProcess] = useState(d.process ?? "");
  const [altitude, setAltitude] = useState(d.altitude ?? "");
  const [notes, setNotes] = useState((d.tasting_notes ?? []).join(", "));
  const [roastLevel, setRoastLevel] = useState<RoastLevel | "">(
    (d.roast_level as RoastLevel) ?? "",
  );
  const [roastPurpose, setRoastPurpose] = useState<RoastPurpose | "">(
    (d.roast_purpose as RoastPurpose) ?? "",
  );
  const [decaf, setDecaf] = useState(d.decaf ?? false);
  const [weight, setWeight] = useState(
    d.weight_grams != null ? String(d.weight_grams) : "",
  );
  const [price, setPrice] = useState(d.price != null ? String(d.price) : "");
  const [currency, setCurrency] = useState(d.currency ?? "EUR");
  const [rating, setRating] = useState<number | null>(d.rating ?? null);
  const [liked, setLiked] = useState<boolean | null>(d.liked ?? null);
  const [comments, setComments] = useState(d.comments ?? "");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit({
        date_added: dateAdded,
        roaster: roaster || null,
        name: name || null,
        origin: origin || null,
        producer: producer || null,
        variety: variety || null,
        process: process || null,
        altitude: altitude || null,
        tasting_notes: notes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        roast_level: roastLevel || null,
        roast_purpose: roastPurpose || null,
        decaf,
        weight_grams: numOrNull(weight),
        price: numOrNull(price),
        currency: currency.trim() || null,
        rating,
        liked,
        comments: comments || null,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="label">{t("f_roaster")}</label>
          <input className="input" value={roaster} onChange={(e) => setRoaster(e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">{t("f_name")}</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">{t("f_origin")}</label>
          <input className="input" value={origin} onChange={(e) => setOrigin(e.target.value)} />
        </div>
        <div>
          <label className="label">{t("f_producer")}</label>
          <input className="input" value={producer} onChange={(e) => setProducer(e.target.value)} />
        </div>
        <div>
          <label className="label">{t("f_variety")}</label>
          <input className="input" value={variety} onChange={(e) => setVariety(e.target.value)} />
        </div>
        <div>
          <label className="label">{t("f_process")}</label>
          <input
            className="input"
            list="process-list"
            value={process}
            onChange={(e) => setProcess(e.target.value)}
          />
          <datalist id="process-list">
            {PROCESS_SUGGESTIONS.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="label">{t("f_altitude")}</label>
          <input className="input" value={altitude} onChange={(e) => setAltitude(e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">
            {t("f_tasting_notes")}{" "}
            <span className="font-normal normal-case text-coffee/50">
              ({t("f_tasting_notes_hint")})
            </span>
          </label>
          <input
            className="input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="chocolate, naranja, caramelo"
          />
        </div>
        <div>
          <label className="label">{t("f_roast_level")}</label>
          <select
            className="input"
            value={roastLevel}
            onChange={(e) => setRoastLevel(e.target.value as RoastLevel | "")}
          >
            <option value="">{t("none")}</option>
            {ROAST_LEVELS.map((o) => (
              <option key={o.value} value={o.value}>
                {o[lang]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">{t("f_roast_purpose")}</label>
          <select
            className="input"
            value={roastPurpose}
            onChange={(e) =>
              setRoastPurpose(e.target.value as RoastPurpose | "")
            }
          >
            <option value="">{t("none")}</option>
            {ROAST_PURPOSES.map((o) => (
              <option key={o.value} value={o.value}>
                {o[lang]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">{t("f_weight")}</label>
          <input
            className="input"
            type="number"
            inputMode="numeric"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div>
          <label className="label">{t("f_price")}</label>
          <div className="flex gap-2">
            <input
              className="input"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              className="input w-20"
              value={currency}
              maxLength={8}
              aria-label={t("f_currency")}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="label">{t("f_date_added")}</label>
          <input
            className="input"
            type="date"
            value={dateAdded}
            onChange={(e) => setDateAdded(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-espresso">
          <input
            type="checkbox"
            checked={decaf}
            onChange={(e) => setDecaf(e.target.checked)}
            className="h-4 w-4 accent-coffee"
          />
          {t("f_decaf")}
        </label>
      </div>

      <div className="rounded-xl2 border border-crema/70 bg-sand/40 p-4 space-y-3">
        <div>
          <label className="label">{t("f_rating")}</label>
          <Stars value={rating} onChange={setRating} />
        </div>
        <div>
          <label className="label">{t("f_liked")}</label>
          <LikeButtons value={liked} onChange={setLiked} />
        </div>
        <div>
          <label className="label">{t("f_comments")}</label>
          <textarea
            className="input min-h-[72px]"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? t("saving") : submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className="btn-ghost" onClick={onCancel}>
            {t("cancel")}
          </button>
        ) : null}
      </div>
    </form>
  );
}
