import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import type { Coffee, Brew } from "@/lib/types";

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
  liked: boolean | null;
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
    if (r.liked === true || r.liked === false) {
      g.likeCount += 1;
      if (r.liked) g.likeYes += 1;
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
  // Sort: highest avg rating first, then most samples.
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
      liked: c.liked,
    }));

  return NextResponse.json({
    totals: { coffees: coffees.length, brews: brews.length },
    byProcess: aggregate(coffeeRated("process")),
    // Origins are comma-separated for blends — count each country separately.
    byOrigin: aggregate(
      coffees.flatMap((c) =>
        (c.origin ?? "")
          .split(",")
          .map((o) => o.trim())
          .filter(Boolean)
          .map((o) => ({ group: o, rating: c.rating, liked: c.liked })),
      ),
    ),
    byRoast: aggregate(coffeeRated("roast_level")),
    byPurpose: aggregate(coffeeRated("roast_purpose")),
    byDrink: aggregate(
      brews.map((b) => ({
        group: b.drink_type,
        rating: b.rating,
        liked: b.liked,
      })),
    ),
  });
}
