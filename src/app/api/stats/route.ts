import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { coffeeCountry, coffeeRegion } from "@/lib/format";
import type { Coffee, Brew, Verdict } from "@/lib/types";

export const runtime = "nodejs";

interface Group {
  key: string;
  count: number;
  avgRating: number | null;
  likePct: number | null;
  ratingCount: number;
  likeCount: number;
}

interface Rated {
  group: string | null | undefined;
  rating: number | null;
  verdict: Verdict | null;
}

function aggregate(rows: Rated[]): Group[] {
  const map = new Map<
    string,
    { count: number; ratingSum: number; ratingCount: number; likeYes: number; likeCount: number }
  >();
  for (const r of rows) {
    const key = (r.group ?? "").toString().trim();
    if (!key) continue;
    const g =
      map.get(key) ??
      { count: 0, ratingSum: 0, ratingCount: 0, likeYes: 0, likeCount: 0 };
    g.count += 1;
    if (typeof r.rating === "number") {
      g.ratingSum += r.rating;
      g.ratingCount += 1;
    }
    if (r.verdict === 1 || r.verdict === 0 || r.verdict === -1) {
      g.likeCount += 1;
      if (r.verdict === 1) g.likeYes += 1;
    }
    map.set(key, g);
  }
  const out: Group[] = [];
  for (const [key, g] of map) {
    out.push({
      key,
      count: g.count,
      avgRating: g.ratingCount ? g.ratingSum / g.ratingCount : null,
      likePct: g.likeCount ? (g.likeYes / g.likeCount) * 100 : null,
      ratingCount: g.ratingCount,
      likeCount: g.likeCount,
    });
  }
  out.sort((a, b) => {
    const ar = a.avgRating ?? -1;
    const br = b.avgRating ?? -1;
    if (br !== ar) return br - ar;
    return b.count - a.count;
  });
  return out;
}

export async function GET() {
  const supabase = getSupabase();
  const [coffeesRes, brewsRes] = await Promise.all([
    supabase.from("coffees").select("*"),
    supabase.from("brews").select("*"),
  ]);
  if (coffeesRes.error || brewsRes.error) {
    return NextResponse.json(
      { error: coffeesRes.error?.message ?? brewsRes.error?.message },
      { status: 500 },
    );
  }
  const coffees = (coffeesRes.data ?? []) as Coffee[];
  const brews = (brewsRes.data ?? []) as Brew[];

  const coffeeRated = (key: keyof Coffee): Rated[] =>
    coffees.map((c) => ({
      group: c[key] as string | null,
      rating: c.rating,
      verdict: c.verdict,
    }));

  return NextResponse.json({
    totals: { coffees: coffees.length, brews: brews.length },
    // Country (comma-split for blends), region, process, roast, purpose, drink.
    byCountry: aggregate(
      coffees.flatMap((c) =>
        (coffeeCountry(c) ?? "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
          .map((x) => ({ group: x, rating: c.rating, verdict: c.verdict })),
      ),
    ),
    byRegion: aggregate(
      coffees.map((c) => ({ group: coffeeRegion(c), rating: c.rating, verdict: c.verdict })),
    ),
    byProcess: aggregate(coffeeRated("process")),
    byRoast: aggregate(coffeeRated("roast_level")),
    byPurpose: aggregate(coffeeRated("roast_purpose")),
    byDrink: aggregate(
      brews.map((b) => ({ group: b.drink_type, rating: b.rating, verdict: b.verdict })),
    ),
  });
}
