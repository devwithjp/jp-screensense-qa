import { NextResponse } from "next/server";

export const runtime = "nodejs";

// POST /api/feedback — body: { rating (1–5), notes?, findingId? }. Records whether a
// finding was useful. Stateless acknowledgement in the demo.
export async function POST(req: Request) {
  let body: { rating?: number; notes?: string; findingId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (typeof body.rating !== "number" || body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ error: "rating (1–5) is required" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
