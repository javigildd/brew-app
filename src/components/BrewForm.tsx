"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { DRINK_TYPES, type DrinkType, type Recipe } from "@/lib/types";
import type { BrewInput } from "@/lib/validation";
import { Stars, LikeButtons } from "./Rating";
import { todayISO } from "@/lib/format";

export default function BrewForm({
  coffeeId,
  recipes,
  defaultValue,
  onSubmit,
  onCancel,
}: {
  coffeeId: string;
  recipes: Recipe[];
  defaultValue?: Partial<BrewInput>;
  onSubmit: (v: BrewInput) => Promise<void>;
  onCancel: () => void;
}) {
  const { t, lang } = useI18n();
  const d = defaultValue ?? {};
  const [brewDate, setBrewDate] = useState(d.brew_date ?? "");
  useEffect(() => {
    if (!d.brew_date) setBrewDate(todayISO());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [drinkType, setDrinkType] = useState<DrinkType | "">(
    (d.drink_type as DrinkType) ?? "",
  );
  const [recipeId, setRecipeId] = useState(d.recipe_id ?? "");
  const [liked, setLiked] = useState<boolean | null>(d.liked ?? null);
  const [rating, setRating] = useState<number | null>(d.rating ?? null);
  const [notes, setNotes] = useState(d.notes ?? "");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit({
        coffee_id: coffeeId,
        brew_date: brewDate,
        drink_type: drinkType || null,
        recipe_id: recipeId || null,
        liked,
        rating,
        notes: notes || null,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-3 p-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">{t("b_drink_type")}</label>
          <select
            className="input"
            value={drinkType}
            onChange={(e) => setDrinkType(e.target.value as DrinkType | "")}
          >
            <option value="">{t("none")}</option>
            {DRINK_TYPES.map((o) => (
              <option key={o.value} value={o.value}>
                {o[lang]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">{t("b_date")}</label>
          <input
            type="date"
            className="input"
            value={brewDate}
            onChange={(e) => setBrewDate(e.target.value)}
          />
        </div>
      </div>
      {recipes.length > 0 ? (
        <div>
          <label className="label">{t("b_recipe")}</label>
          <select
            className="input"
            value={recipeId}
            onChange={(e) => setRecipeId(e.target.value)}
          >
            <option value="">{t("b_no_recipe")}</option>
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name || `${r.method ?? ""} ${r.dose_grams ?? ""}→${r.yield_grams ?? ""}`}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <div>
        <label className="label">{t("f_liked")}</label>
        <LikeButtons value={liked} onChange={setLiked} size="sm" />
      </div>
      <div>
        <label className="label">{t("f_rating")}</label>
        <Stars value={rating} onChange={setRating} />
      </div>
      <div>
        <label className="label">{t("r_notes")}</label>
        <textarea
          className="input min-h-[60px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? t("saving") : t("save")}
        </button>
        <button type="button" className="btn-ghost" onClick={onCancel}>
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
