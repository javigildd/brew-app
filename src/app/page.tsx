"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Coffee as CoffeeIcon, Search, Plus } from "lucide-react";
import AppShell from "@/components/AppShell";
import CoffeeCard from "@/components/CoffeeCard";
import { fetcher } from "@/lib/client";
import { useI18n } from "@/lib/i18n";
import type { Coffee } from "@/lib/types";

export default function HomePage() {
  const { t } = useI18n();
  const { data, isLoading } = useSWR<Coffee[]>("/api/coffees", fetcher);
  const [q, setQ] = useState("");

  const coffees = data ?? [];
  const filtered = coffees.filter((c) => {
    if (!q.trim()) return true;
    const hay = [
      c.name,
      c.roaster,
      c.country,
      c.region,
      c.origin,
      c.process,
      (c.tasting_notes ?? []).join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <AppShell>
      {isLoading ? (
        <p className="py-10 text-center text-coffee/60">{t("loading")}</p>
      ) : coffees.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center animate-fade-in">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent">
            <CoffeeIcon size={36} />
          </div>
          <p className="max-w-xs text-muted">{t("home_empty")}</p>
          <Link href="/add" className="btn-accent">
            {t("home_add_first")}
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl font-bold text-espresso lg:text-3xl">
                {t("nav_home")}
              </h1>
              <p className="text-sm text-muted">
                {coffees.length} {t("stats_total_coffees")}
              </p>
            </div>
            <Link href="/add" className="btn-accent hidden lg:inline-flex">
              <Plus size={16} /> {t("nav_add")}
            </Link>
          </div>
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              className="input pl-10"
              placeholder={t("search_placeholder")}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c) => (
              <CoffeeCard key={c.id} coffee={c} />
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
