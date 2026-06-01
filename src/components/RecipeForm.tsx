"use client";

import { useState } from "react";
import { Snowflake } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { BREW_METHODS, MILK_TYPES, type BrewMethod, type MilkType } from "@/lib/types";
import type { RecipeInput } from "@/lib/validation";
import { ratio } from "@/lib/format";

function numOrNull(s: string): number | null {
  if (s.trim() === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export default function RecipeForm({
  coffeeId,
  defaultValue,
  onSubmit,
  onCancel,
}: {
  coffeeId: string;
  defaultValue?: Partial<RecipeInput>;
  onSubmit: (v: RecipeInput) => Promise<void>;
  onCancel: () => void;
}) {
  const { t, lang } = useI18n();
  const d = defaultValue ?? {};
  const [name, setName] = useState(d.name ?? "");
  const [method, setMethod] = useState<BrewMethod | "">(
    (d.method as BrewMethod) ?? "",
  );
  const [dose, setDose] = useState(d.dose_grams != null ? String(d.dose_grams) : "");
  const [yld, setYld] = useState(d.yield_grams != null ? String(d.yield_grams) : "");
  const [grind, setGrind] = useState(d.grind ?? "");
  const [temp, setTemp] = useState(d.water_temp_c != null ? String(d.water_temp_c) : "");
  const [time, setTime] = useState(d.time_seconds != null ? String(d.time_seconds) : "");
  const [milk, setMilk] = useState(d.milk_ml != null ? String(d.milk_ml) : "");
  const [milkType, setMilkType] = useState<MilkType | "">(
    (d.milk_type as MilkType) ?? "",
  );
  const [ice, setIce] = useState(d.ice ?? false);
  const [notes, setNotes] = useState(d.notes ?? "");
  const [busy, setBusy] = useState(false);

  const liveRatio = ratio(numOrNull(dose), numOrNull(yld));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit({
        coffee_id: coffeeId,
        name: name || null,
        method: method || null,
        dose_grams: numOrNull(dose),
        yield_grams: numOrNull(yld),
        grind: grind || null,
        water_temp_c: numOrNull(temp),
        time_seconds: numOrNull(time),
        milk_ml: numOrNull(milk),
        milk_type: milkType || null,
        ice,
        notes: notes || null,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-3 p-4">
      <div>
        <label className="label">{t("r_name")} <span className="font-normal normal-case text-coffee/50">({t("optional")})</span></label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">{t("r_method")}</label>
          <select
            className="input"
            value={method}
            onChange={(e) => setMethod(e.target.value as BrewMethod | "")}
          >
            <option value="">{t("none")}</option>
            {BREW_METHODS.map((o) => (
              <option key={o.value} value={o.value}>
                {o[lang]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <div className="w-full">
            <label className="label">{t("r_ratio")}</label>
            <div className="input flex items-center bg-sand/50 font-semibold text-coffee">
              {liveRatio || "—"}
            </div>
          </div>
        </div>
        <div>
          <label className="label">{t("r_dose")}</label>
          <input className="input" type="number" inputMode="decimal" step="0.1" value={dose} onChange={(e) => setDose(e.target.value)} />
        </div>
        <div>
          <label className="label">{t("r_yield")}</label>
          <input className="input" type="number" inputMode="decimal" step="0.1" value={yld} onChange={(e) => setYld(e.target.value)} />
        </div>
        <div>
          <label className="label">{t("r_grind")}</label>
          <input className="input" value={grind} onChange={(e) => setGrind(e.target.value)} />
        </div>
        <div>
          <label className="label">{t("r_temp")}</label>
          <input className="input" type="number" inputMode="numeric" value={temp} onChange={(e) => setTemp(e.target.value)} />
        </div>
        <div>
          <label className="label">{t("r_time")}</label>
          <input className="input" type="number" inputMode="numeric" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div>
          <label className="label">{t("r_milk")}</label>
          <input className="input" type="number" inputMode="numeric" value={milk} onChange={(e) => setMilk(e.target.value)} />
        </div>
        <div>
          <label className="label">{t("r_milk_type")}</label>
          <select
            className="input"
            value={milkType}
            onChange={(e) => setMilkType(e.target.value as MilkType | "")}
          >
            <option value="">{t("none")}</option>
            {MILK_TYPES.map((o) => (
              <option key={o.value} value={o.value}>
                {o[lang]}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-espresso">
          <input
            type="checkbox"
            checked={ice}
            onChange={(e) => setIce(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          <Snowflake size={15} /> {t("r_ice")}
        </label>
      </div>
      <div>
        <label className="label">{t("r_notes")}</label>
        <textarea className="input min-h-[60px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
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
