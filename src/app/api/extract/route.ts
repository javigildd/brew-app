import { NextResponse } from "next/server";
import { extractCoffeeFromImage, NO_KEY, type ImageMediaType } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED: ImageMediaType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("image");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    const mediaType = (file.type || "image/jpeg") as ImageMediaType;
    if (!ALLOWED.includes(mediaType)) {
      return NextResponse.json(
        { error: `Unsupported image type: ${mediaType}` },
        { status: 400 },
      );
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const base64 = bytes.toString("base64");
    const apiKey = req.headers.get("x-anthropic-key");
    const data = await extractCoffeeFromImage(base64, mediaType, apiKey);
    return NextResponse.json(data);
  } catch (err) {
    const status = (err as { status?: number })?.status;
    const message = err instanceof Error ? err.message : "Extraction failed";
    if (message === NO_KEY) {
      return NextResponse.json({ error: NO_KEY }, { status: 400 });
    }
    if (status === 401) {
      return NextResponse.json({ error: "INVALID_KEY" }, { status: 401 });
    }
    console.error("extract error", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
