"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { ChevronLeft, Pencil, Milk, Snowflake } from "lucide-react";
import AppShell from "@/components/AppShell";
import CoffeeForm, { type CoffeeFormValues } from "@/components/CoffeeForm";
import BrewForm from "@/components/BrewForm";
import RecipeForm from "@/components/RecipeForm";
import { Stars, LikeBadge } from "@/components/Rating";
import { fetcher, apiSend } from "@/lib/client";
import { useI18n } from "@/lib/i18n";
import { formatDate, formatTime, ratio } from "@/lib/format";
import {
  ROAST_LEVELS,
  ROAST_PURPOSES,
  DRINK_TYPES,
  BREW_METHODS,
  MILK_TYPES,
  optLabel,
} from "@/lib/types";
import type {
  CoffeeDetail,
  Coffee,
  Brew,
  Recipe,
} from "@/lib/types";
import type { BrewInput, RecipeInput } from "@/lib/validation";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between gap-4 border-b border-crema/50 py-1.5 text-sm last:border-0">
      <span className="text-coffee/60">{label}</span>
      <span className="text-right font-medium text-espresso">{value}</span>
    </div>
  );
}

export default function CoffeeDetailPage() {
  const { t, lang } = useI18n();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR<CoffeeDetail>(
    id ? `/api/coffees/${id}` : null,
    fetcher,
  );

  const [editing, setEditing] = useState(false);
  const [showBrew, setShowBrew] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);

  if (isLoading || !data) {
    return (
      <AppShell>
        <p className="py-10 text-center text-coffee/60">{t("loading")}</p>
      </AppShell>
    );
  }

  const { coffee, brews, recipes } = data;

  const saveCoffee = async (values: CoffeeFormValues) => {
    await apiSend(`/api/coffees/${id}`, "PATCH", values);
    setEditing(false);
    mutate();
  };

  const deleteCoffee = async () => {
    if (!confirm(t("confirm_delete"))) return;
    await apiSend(`/api/coffees/${id}`, "DELETE");
    router.push("/");
    router.refresh();
  };

  const addBrew = async (v: BrewInput) => {
    await apiSend("/api/brews", "POST", v);
    setShowBrew(false);
    mutate();
  };
  const delBrew = async (b: Brew) => {
    if (!confirm(t("confirm_delete"))) return;
    await apiSend(`/api/brews/${b.id}`, "DELETE");
    mutate();
  };
  const addRecipe = async (v: RecipeInput) => {
    await apiSend("/api/recipes", "POST", v);
    setShowRecipe(false);
    mutate();
  };
  const delRecipe = async (r: Recipe) => {
    if (!confirm(t("confirm_delete"))) return;
    await apiSend(`/api/recipes/${r.id}`, "DELETE");
    mutate();
  };

  if (editing) {
    const dv: Partial<CoffeeFormValues> = {
      date_added: coffee.date_added,
      roaster: coffee.roaster,
      name: coffee.name,
      origin: coffee.origin,
      producer: coffee.producer,
      variety: coffee.variety,
      process: coffee.process,
      altitude: coffee.altitude,
      tasting_notes: coffee.tasting_notes,
      roast_level: coffee.roast_level,
      roast_purpose: coffee.roast_purpose,
      decaf: coffee.decaf,
      weight_grams: coffee.weight_grams,
      price: coffee.price,
      currency: coffee.currency,
      rating: coffee.rating,
      liked: coffee.liked,
      comments: coffee.comments,
    };
    return (
      <AppShell>
        <h1 className="mb-4 font-serif text-2xl font-bold text-espresso">
          {t("edit")}
        </h1>
        <CoffeeForm
          defaultValue={dv}
          submitLabel={t("save")}
          onSubmit={saveCoffee}
          onCancel={() => setEditing(false)}
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <button
        onClick={() => router.push("/")}
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-espresso"
      >
        <ChevronLeft size={16} /> {t("back")}
      </button>

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
        {/* Header — left column on desktop */}
        <div className="lg:sticky lg:top-6">
          <div className="card overflow-hidden">
        {coffee.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coffee.photo_url}
            alt={coffee.name ?? "coffee"}
            className="max-h-72 w-full object-cover"
          />
        ) : null}
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-serif text-2xl font-bold leading-tight text-espresso">
                {coffee.name || t("none")}
              </h1>
              <p className="text-coffee/70">{coffee.roaster}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {coffee.rating ? <Stars value={coffee.rating} readOnly /> : null}
              <LikeBadge value={coffee.liked} />
            </div>
          </div>

          {coffee.tasting_notes?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {coffee.tasting_notes.map((n, i) => (
                <span key={i} className="chip">
                  {n}
                </span>
              ))}
            </div>
          ) : null}

          <div className="rounded-lg bg-sand/40 p-3">
            <Row label={t("f_origin")} value={coffee.origin} />
            <Row label={t("f_producer")} value={coffee.producer} />
            <Row label={t("f_variety")} value={coffee.variety} />
            <Row label={t("f_process")} value={coffee.process} />
            <Row label={t("f_altitude")} value={coffee.altitude} />
            <Row
              label={t("f_roast_level")}
              value={optLabel(ROAST_LEVELS, coffee.roast_level, lang)}
            />
            <Row
              label={t("f_roast_purpose")}
              value={optLabel(ROAST_PURPOSES, coffee.roast_purpose, lang)}
            />
            <Row label={t("f_decaf")} value={coffee.decaf ? t("yes") : null} />
            <Row
              label={t("f_weight")}
              value={coffee.weight_grams ? `${coffee.weight_grams} g` : null}
            />
            <Row
              label={t("f_price")}
              value={
                coffee.price != null
                  ? `${coffee.price} ${coffee.currency ?? ""}`.trim()
                  : null
              }
            />
            <Row
              label={t("f_date_added")}
              value={formatDate(coffee.date_added, lang)}
            />
          </div>

          {coffee.comments ? (
            <p className="rounded-lg bg-sand/40 p-3 text-sm italic text-espresso">
              “{coffee.comments}”
            </p>
          ) : null}

          <div className="flex gap-2 pt-1">
            <button onClick={() => setEditing(true)} className="btn-outline flex-1">
              <Pencil size={15} /> {t("edit")}
            </button>
            <button onClick={deleteCoffee} className="btn-ghost text-danger hover:bg-danger/10">
              {t("delete")}
            </button>
          </div>
        </div>
          </div>
        </div>

        {/* Recipes + Brews — right column on desktop */}
        <div className="mt-6 space-y-6 lg:mt-0">
      {/* Recipes */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-espresso">
            {t("detail_recipes")}
          </h2>
          {!showRecipe ? (
            <button onClick={() => setShowRecipe(true)} className="text-sm font-semibold text-terracotta">
              {t("detail_add_recipe")}
            </button>
          ) : null}
        </div>
        {showRecipe ? (
          <RecipeForm
            coffeeId={coffee.id}
            onSubmit={addRecipe}
            onCancel={() => setShowRecipe(false)}
          />
        ) : null}
        <div className="mt-3 space-y-2">
          {recipes.length === 0 && !showRecipe ? (
            <p className="text-sm text-coffee/50">{t("detail_no_recipes")}</p>
          ) : null}
          {recipes.map((r) => (
            <div key={r.id} className="card p-3 text-sm">
              <div className="flex items-start justify-between">
                <span className="font-semibold text-espresso">
                  {r.name || optLabel(BREW_METHODS, r.method, lang) || t("detail_recipes")}
                </span>
                <button onClick={() => delRecipe(r)} className="text-xs font-medium text-danger">
                  {t("delete")}
                </button>
              </div>
              <div className="mt-1 flex flex-wrap gap-1.5 text-coffee/80">
                {r.method ? <span className="chip">{optLabel(BREW_METHODS, r.method, lang)}</span> : null}
                {r.dose_grams && r.yield_grams ? (
                  <span className="chip">
                    {r.dose_grams}g → {r.yield_grams}g ({ratio(r.dose_grams, r.yield_grams)})
                  </span>
                ) : null}
                {r.water_temp_c ? <span className="chip">{r.water_temp_c}°C</span> : null}
                {r.time_seconds ? <span className="chip">{formatTime(r.time_seconds)}</span> : null}
                {r.grind ? <span className="chip">{r.grind}</span> : null}
                {r.milk_ml ? (
                  <span className="chip gap-1">
                    <Milk size={12} /> {r.milk_ml}ml {optLabel(MILK_TYPES, r.milk_type, lang)}
                  </span>
                ) : null}
                {r.ice ? (
                  <span className="chip gap-1">
                    <Snowflake size={12} /> {t("r_ice")}
                  </span>
                ) : null}
              </div>
              {r.notes ? <p className="mt-1 text-coffee/70">{r.notes}</p> : null}
            </div>
          ))}
        </div>
      </section>

      {/* Brews */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-espresso">
            {t("detail_brews")}
          </h2>
          {!showBrew ? (
            <button onClick={() => setShowBrew(true)} className="text-sm font-semibold text-terracotta">
              {t("detail_add_brew")}
            </button>
          ) : null}
        </div>
        {showBrew ? (
          <BrewForm
            coffeeId={coffee.id}
            recipes={recipes}
            onSubmit={addBrew}
            onCancel={() => setShowBrew(false)}
          />
        ) : null}
        <div className="mt-3 space-y-2">
          {brews.length === 0 && !showBrew ? (
            <p className="text-sm text-coffee/50">{t("detail_no_brews")}</p>
          ) : null}
          {brews.map((b) => {
            const recipe = recipes.find((r) => r.id === b.recipe_id);
            return (
              <div key={b.id} className="card p-3 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-semibold text-espresso">
                      {optLabel(DRINK_TYPES, b.drink_type, lang) || t("detail_brews")}
                    </span>
                    <span className="ml-2 text-xs text-coffee/50">
                      {formatDate(b.brew_date, lang)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {b.rating ? <Stars value={b.rating} readOnly /> : null}
                    <button onClick={() => delBrew(b)} className="text-xs font-medium text-danger">
                      {t("delete")}
                    </button>
                  </div>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <LikeBadge value={b.liked} />
                  {recipe ? (
                    <span className="chip">
                      {recipe.name || optLabel(BREW_METHODS, recipe.method, lang)}
                    </span>
                  ) : null}
                </div>
                {b.notes ? <p className="mt-1 text-coffee/70">{b.notes}</p> : null}
              </div>
            );
          })}
        </div>
      </section>
        </div>
      </div>
    </AppShell>
  );
}
