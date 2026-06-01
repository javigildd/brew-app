import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { recipeInput } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const supabase = getSupabase();
  const parsed = recipeInput.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data" },
      { status: 400 },
    );
  }
  const { data, error } = await supabase
    .from("recipes")
    .insert(parsed.data)
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
