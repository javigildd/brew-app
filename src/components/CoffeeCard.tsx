"use client";

import Link from "next/link";
import { Coffee as CoffeeIcon } from "lucide-react";
import type { Coffee } from "@/lib/types";
import { ROAST_LEVELS, ROAST_PURPOSES, optLabel } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { coffeeCountry, coffeeRegion } from "@/lib/format";
import { CHIP_BASE, countryColor, processColor, roastColor } from "@/lib/colors";
import { Stars, LikeBadge } from "./Rating";

export default function CoffeeCard({ coffee }: { coffee: Coffee }) {
  const { t, lang } = useI18n();
  const country = coffeeCountry(coffee);
  const region = coffeeRegion(coffee);
  return (
    <Link
      href={`/coffee/${coffee.id}`}
      className="card flex gap-3 overflow-hidden p-3 transition hover:shadow-pop"
    >
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-sand">
        {coffee.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coffee.photo_url} alt={coffee.name ?? "coffee"} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted/50">
            <CoffeeIcon size={28} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-espresso">{coffee.name || t("none")}</p>
            <p className="truncate text-sm text-muted">{coffee.roaster || ""}</p>
          </div>
          {coffee.rating ? <Stars value={coffee.rating} readOnly /> : null}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {country ? <span className={`${CHIP_BASE} ${countryColor(country)}`}>{country}</span> : null}
          {region ? <span className="chip">{region}</span> : null}
          {coffee.process ? (
            <span className={`${CHIP_BASE} ${processColor(coffee.process)}`}>{coffee.process}</span>
          ) : null}
          {coffee.roast_level ? (
            <span className={`${CHIP_BASE} ${roastColor(coffee.roast_level)}`}>
              {optLabel(ROAST_LEVELS, coffee.roast_level, lang)}
            </span>
          ) : null}
          {coffee.roast_purpose ? (
            <span className="chip">{optLabel(ROAST_PURPOSES, coffee.roast_purpose, lang)}</span>
          ) : null}
          {coffee.decaf ? <span className="chip">decaf</span> : null}
        </div>
        {coffee.verdict !== null ? (
          <div className="mt-1.5">
            <LikeBadge value={coffee.verdict} />
          </div>
        ) : null}
      </div>
    </Link>
  );
}
