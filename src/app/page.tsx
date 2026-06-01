"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Coffee as CoffeeIcon, Search } from "lucide-react";
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
    const hay = [c.name, c.roaster, c.origin, c.process, (c.tasting_notes ?? []).join(" ")]
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
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sand text-coffee">
            <CoffeeIcon size={36} />
          </div>
          <p className="max-w-xs text-muted">{t("home_empty")}</p>
          <Link href="/add" className="btn-accent">
            {t("home_add_first")}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
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
          <div className="space-y-3">
            {filtered.map((c) => (
              <CoffeeCard key={c.id} coffee={c} />
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
