import { NextResponse } from "next/server";
import type { RubricId } from "@/lib/types";
import { rubrics } from "@/lib/rubrics";
import { analyze } from "@/lib/analyze";

export const runtime = "nodejs";

// POST /api/analyze — body: { rubric, mode?, imageBase64?, mediaType? }
// In mock mode the image stays client-side (preview only); live mode sends it for vision.
export async function POST(req: Request) {
  let body: { rubric?: string; mode?: "mock" | "live"; imageBase64?: string; mediaType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rubric = body.rubric as RubricId;
  if (!rubric || !rubrics[rubric]) {
    return NextResponse.json({ error: "Valid rubric required" }, { status: 400 });
  }
  if (body.imageBase64 && body.imageBase64.length > 7_000_000) {
    return NextResponse.json({ error: "Image too large (max ~5MB)" }, { status: 413 });
  }

  try {
    const image =
      body.imageBase64 && body.mediaType
        ? { base64: body.imageBase64, mediaType: body.mediaType }
        : undefined;
    const critique = await analyze(rubric, image, body.mode ?? "mock");
    return NextResponse.json({ critique });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
