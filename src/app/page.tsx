"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
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
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <span className="text-5xl">☕</span>
          <p className="max-w-xs text-coffee/70">{t("home_empty")}</p>
          <Link href="/add" className="btn-accent">
            {t("home_add_first")}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            className="input"
            placeholder={t("search_placeholder")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
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
