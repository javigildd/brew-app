import { NextResponse } from "next/server";
import { getSupabase, PHOTO_BUCKET } from "@/lib/supabase";
import { coffeeInput } from "@/lib/validation";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("coffees")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const supabase = getSupabase();
  try {
    const form = await req.formData();
    const raw = form.get("data");
    if (typeof raw !== "string") {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }
    const parsed = coffeeInput.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid data" },
        { status: 400 },
      );
    }
    const fields = parsed.data;

    // Optional photo upload.
    let photo_url: string | null = null;
    const image = form.get("image");
    if (image instanceof File && image.size > 0) {
      const ext = (image.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
      const path = `${crypto.randomUUID()}.${ext}`;
      const bytes = Buffer.from(await image.arrayBuffer());
      const { error: upErr } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(path, bytes, { contentType: image.type, upsert: false });
      if (upErr) {
        return NextResponse.json(
          { error: `Photo upload failed: ${upErr.message}` },
          { status: 500 },
        );
      }
      photo_url = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path)
        .data.publicUrl;
    }

    const { data, error } = await supabase
      .from("coffees")
      .insert({ ...fields, photo_url })
      .select("*")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
