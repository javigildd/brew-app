import { NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/anthropic";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let key = "";
  try {
    const body = await req.json();
    key = typeof body?.key === "string" ? body.key.trim() : "";
  } catch {
    /* ignore */
  }
  if (!key) {
    return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  }
  try {
    await verifyApiKey(key);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const status = (err as { status?: number })?.status;
    // 401 = bad key; anything else = transient/other error.
    return NextResponse.json(
      { ok: false, error: status === 401 ? "invalid" : "error" },
      { status: 200 },
    );
  }
}
