"use client";

import useSWR from "swr";
import { Star, ThumbsUp } from "lucide-react";
import AppShell from "@/components/AppShell";
import { fetcher } from "@/lib/client";
import { useI18n } from "@/lib/i18n";
import {
  ROAST_LEVELS,
  ROAST_PURPOSES,
  DRINK_TYPES,
  optLabel,
  type Lang,
  type Opt,
} from "@/lib/types";

interface Group {
  key: string;
  count: number;
  avgRating: number | null;
  likePct: number | null;
  ratingCount: number;
  likeCount: number;
}
interface Stats {
  totals: { coffees: number; brews: number };
  byProcess: Group[];
  byOrigin: Group[];
  byRoast: Group[];
  byPurpose: Group[];
  byDrink: Group[];
}

function GroupList({
  title,
  items,
  mapKey,
}: {
  title: string;
  items: Group[];
  mapKey?: (key: string, lang: Lang) => string;
}) {
  const { t, lang } = useI18n();
  if (!items.length) return null;
  return (
    <section className="card p-4">
      <h2 className="mb-3 font-serif text-lg font-bold text-espresso">{title}</h2>
      <div className="space-y-2.5">
        {items.map((g) => {
          const label = mapKey ? mapKey(g.key, lang) : g.key;
          const pct = g.avgRating != null ? (g.avgRating / 5) * 100 : g.likePct ?? 0;
          return (
            <div key={g.key}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-espresso">{label}</span>
                <span className="flex items-center gap-2 text-muted">
                  {g.avgRating != null ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-star">
                      <Star size={13} fill="currentColor" /> {g.avgRating.toFixed(1)}
                    </span>
                  ) : null}
                  {g.likePct != null ? (
                    <span className="inline-flex items-center gap-1">
                      <ThumbsUp size={13} /> {Math.round(g.likePct)}%
                    </span>
                  ) : null}
                  <span className="text-xs text-muted/60">
                    {g.count} {t("stats_count")}
                  </span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-sand">
                <div
                  className="h-full rounded-full bg-accent/70"
                  style={{ width: `${Math.max(4, Math.min(100, pct))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const mapOpt =
  <T extends string>(opts: Opt<T>[]) =>
  (key: string, lang: Lang) =>
    optLabel(opts, key as T, lang) || key;

export default function StatsPage() {
  const { t } = useI18n();
  const { data, isLoading } = useSWR<Stats>("/api/stats", fetcher);

  const hasData =
    data &&
    (data.byProcess.length ||
      data.byOrigin.length ||
      data.byRoast.length ||
      data.byPurpose.length ||
      data.byDrink.length);

  return (
    <AppShell>
      <h1 className="font-serif text-2xl font-bold text-espresso lg:text-3xl">
        {t("stats_title")}
      </h1>
      <p className="mb-5 mt-1 text-sm text-muted">{t("stats_intro")}</p>

      {isLoading ? (
        <p className="py-10 text-center text-coffee/60">{t("loading")}</p>
      ) : !hasData ? (
        <p className="py-10 text-center text-coffee/60">{t("stats_no_data")}</p>
      ) : (
        <div className="space-y-4">
          {data ? (
            <div className="flex gap-3">
              <div className="card flex-1 p-3 text-center">
                <div className="text-2xl font-bold text-espresso">
                  {data.totals.coffees}
                </div>
                <div className="text-xs text-coffee/60">
                  {t("stats_total_coffees")}
                </div>
              </div>
              <div className="card flex-1 p-3 text-center">
                <div className="text-2xl font-bold text-espresso">
                  {data.totals.brews}
                </div>
                <div className="text-xs text-coffee/60">
                  {t("stats_total_brews")}
                </div>
              </div>
            </div>
          ) : null}
          <div className="grid gap-4 lg:grid-cols-2">
            <GroupList title={t("stats_by_origin")} items={data!.byOrigin} />
            <GroupList title={t("stats_by_process")} items={data!.byProcess} />
            <GroupList
              title={t("stats_by_roast")}
              items={data!.byRoast}
              mapKey={mapOpt(ROAST_LEVELS)}
            />
            <GroupList
              title={t("stats_by_purpose")}
              items={data!.byPurpose}
              mapKey={mapOpt(ROAST_PURPOSES)}
            />
            <GroupList
              title={t("stats_by_drink")}
              items={data!.byDrink}
              mapKey={mapOpt(DRINK_TYPES)}
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}
