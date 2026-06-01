import { NextResponse } from "next/server";
import { getSupabase, PHOTO_BUCKET } from "@/lib/supabase";
import { coffeePatch } from "@/lib/validation";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const supabase = getSupabase();

  const [coffeeRes, brewsRes, recipesRes] = await Promise.all([
    supabase.from("coffees").select("*").eq("id", id).single(),
    supabase
      .from("brews")
      .select("*")
      .eq("coffee_id", id)
      .order("brew_date", { ascending: false }),
    supabase
      .from("recipes")
      .select("*")
      .eq("coffee_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (coffeeRes.error || !coffeeRes.data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    coffee: coffeeRes.data,
    brews: brewsRes.data ?? [],
    recipes: recipesRes.data ?? [],
  });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const supabase = getSupabase();
  const parsed = coffeePatch.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data" },
      { status: 400 },
    );
  }
  const { data, error } = await supabase
    .from("coffees")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const supabase = getSupabase();

  // Remove the bag photo from Storage so it isn't orphaned (DB cascade only
  // covers rows, not storage objects).
  const { data: existing } = await supabase
    .from("coffees")
    .select("photo_url")
    .eq("id", id)
    .single();
  const photoUrl: string | null = existing?.photo_url ?? null;
  if (photoUrl) {
    const path = photoUrl.split(`/${PHOTO_BUCKET}/`)[1];
    if (path) {
      await supabase.storage
        .from(PHOTO_BUCKET)
        .remove([decodeURIComponent(path)]);
    }
  }

  const { error } = await supabase.from("coffees").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
