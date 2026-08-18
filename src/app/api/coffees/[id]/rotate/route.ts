import { NextResponse } from "next/server";
import sharp from "sharp";
import { getSupabase, PHOTO_BUCKET } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;

type Ctx = { params: Promise<{ id: string }> };

// Rotate the bag photo 90° clockwise: re-encode, upload under a new path
// (so browser/CDN caches never serve the stale orientation), point the row
// at it and delete the old object.
export async function POST(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const supabase = getSupabase();

  const { data: coffee, error: fetchErr } = await supabase
    .from("coffees")
    .select("photo_url")
    .eq("id", id)
    .single();
  if (fetchErr || !coffee) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!coffee.photo_url) {
    return NextResponse.json({ error: "No photo to rotate" }, { status: 400 });
  }

  const oldPath = decodeURIComponent(
    coffee.photo_url.split(`/${PHOTO_BUCKET}/`)[1] ?? "",
  );
  if (!oldPath) {
    return NextResponse.json({ error: "Unrecognized photo URL" }, { status: 400 });
  }

  const { data: file, error: dlErr } = await supabase.storage
    .from(PHOTO_BUCKET)
    .download(oldPath);
  if (dlErr || !file) {
    return NextResponse.json(
      { error: `Photo download failed: ${dlErr?.message ?? "unknown"}` },
      { status: 500 },
    );
  }

  const original = Buffer.from(await file.arrayBuffer());
  // autoOrient bakes any EXIF orientation into pixels before the extra 90°,
  // since the re-encode below drops metadata.
  const rotated = await sharp(original, { autoOrient: true })
    .rotate(90)
    .jpeg({ quality: 88 })
    .toBuffer();

  const newPath = `${crypto.randomUUID()}.jpg`;
  const { error: upErr } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(newPath, rotated, { contentType: "image/jpeg", upsert: false });
  if (upErr) {
    return NextResponse.json(
      { error: `Photo upload failed: ${upErr.message}` },
      { status: 500 },
    );
  }

  const photo_url = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(newPath)
    .data.publicUrl;
  const { data, error } = await supabase
    .from("coffees")
    .update({ photo_url })
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    // Roll back the orphan upload; keep the old photo in place.
    await supabase.storage.from(PHOTO_BUCKET).remove([newPath]);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.storage.from(PHOTO_BUCKET).remove([oldPath]);
  return NextResponse.json(data);
}
