import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

const hopperInput = z.object({
  coffee_id: z.string().uuid().nullable(),
});

// Set which coffee is currently in the grinder hopper (at most one).
// { coffee_id: null } empties the hopper.
export async function POST(req: Request) {
  const supabase = getSupabase();
  const parsed = hopperInput.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const { coffee_id } = parsed.data;

  const { error: clearErr } = await supabase
    .from("coffees")
    .update({ in_hopper: false })
    .eq("in_hopper", true);
  if (clearErr) {
    return NextResponse.json({ error: clearErr.message }, { status: 500 });
  }

  if (!coffee_id) {
    return NextResponse.json({ ok: true });
  }

  const { data, error } = await supabase
    .from("coffees")
    .update({ in_hopper: true })
    .eq("id", coffee_id)
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
