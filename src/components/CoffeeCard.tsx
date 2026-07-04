"use client";

import Link from "next/link";
import { Coffee as CoffeeIcon, Star, ChevronRight } from "lucide-react";
import type { Coffee } from "@/lib/types";
import { ROAST_LEVELS, ROAST_PURPOSES, optLabel } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { coffeeCountry, coffeeRegion } from "@/lib/format";
import { CHIP_BASE, countryColor, processColor, roastColor } from "@/lib/colors";
import { LikeBadge } from "./Rating";

// Rendered as a row inside the home page's list container.
export default function CoffeeCard({ coffee }: { coffee: Coffee }) {
  const { t, lang } = useI18n();
  const country = coffeeCountry(coffee);
  const region = coffeeRegion(coffee);
  return (
    <Link
      href={`/coffee/${coffee.id}`}
      className="group flex items-center gap-4 bg-surface px-4 py-3.5 transition-colors duration-150 hover:bg-sand/50"
    >
      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-sand ring-1 ring-crema/50">
        {coffee.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coffee.photo_url}
            alt={coffee.name ?? "coffee"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted/40">
            <CoffeeIcon size={22} strokeWidth={1.8} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-[15px] font-semibold tracking-tight text-espresso">
            {coffee.name || t("none")}
            {coffee.roaster ? (
              <span className="ml-2 font-normal text-muted">
                {coffee.roaster}
              </span>
            ) : null}
          </p>
          <span className="flex flex-shrink-0 items-center gap-2">
            {coffee.verdict !== null ? <LikeBadge value={coffee.verdict} /> : null}
            {coffee.rating ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-espresso">
                <Star
                  size={13}
                  className="text-star"
                  fill="currentColor"
                  strokeWidth={0}
                />
                {coffee.rating.toFixed(1)}
              </span>
            ) : null}
            <ChevronRight
              size={15}
              className="text-muted/50 transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {country ? (
            <span className={`${CHIP_BASE} ${countryColor(country)}`}>{country}</span>
          ) : null}
          {region ? <span className="chip">{region}</span> : null}
          {coffee.process ? (
            <span className={`${CHIP_BASE} ${processColor(coffee.process)}`}>
              {coffee.process}
            </span>
          ) : null}
          {coffee.roast_level ? (
            <span className={`${CHIP_BASE} ${roastColor(coffee.roast_level)}`}>
              {optLabel(ROAST_LEVELS, coffee.roast_level, lang)}
            </span>
          ) : null}
          {coffee.roast_purpose ? (
            <span className="chip">
              {optLabel(ROAST_PURPOSES, coffee.roast_purpose, lang)}
            </span>
          ) : null}
          {coffee.decaf ? <span className="chip">decaf</span> : null}
        </div>
      </div>
    </Link>
  );
}
