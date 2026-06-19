import Anthropic from "@anthropic-ai/sdk";
import type { Critique, Finding, RubricId } from "./types";
import { rubrics } from "./rubrics";

export function liveVisionAvailable(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

const SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          severity: { type: "string", enum: ["critical", "high", "medium", "low"] },
          category: { type: "string", enum: ["accessibility", "ux", "copy", "hierarchy", "trust", "conversion"] },
          description: { type: "string" },
          suggestion: { type: "string" },
        },
        required: ["title", "severity", "category", "description", "suggestion"],
        additionalProperties: false,
      },
    },
    recommendations: { type: "array", items: { type: "string" } },
    risks: { type: "array", items: { type: "string" } },
  },
  required: ["summary", "confidence", "findings", "recommendations", "risks"],
  additionalProperties: false,
} as const;

type RawCritique = Omit<Critique, "mode" | "rubric" | "findings"> & {
  findings: Omit<Finding, "id">[];
};

// Multimodal critique of a real screenshot via claude-opus-4-8 vision.
export async function liveCritique(
  rubric: RubricId,
  imageBase64: string,
  mediaType: string
): Promise<Critique> {
  const r = rubrics[rubric];
  const prompt = `You are a senior product designer and accessibility reviewer. Critique this UI screenshot.\n\n${r.focus}\n\nReturn a structured critique: a one-paragraph summary, your confidence, a list of findings (each with title, severity, category, description, and a concrete suggestion), prioritised recommendations, and product risks. Be specific and only describe what is visible. Do not invent content that isn't in the image.`;

  const res = await getClient().messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
          { type: "text", text: prompt },
        ],
      },
    ],
    output_config: { format: { type: "json_schema", schema: SCHEMA } },
  } as unknown as Anthropic.MessageCreateParamsNonStreaming);

  const text = res.content.find((b) => b.type === "text") as Anthropic.TextBlock;
  const raw = JSON.parse(text.text) as RawCritique;
  return {
    mode: "live",
    rubric,
    summary: raw.summary,
    confidence: raw.confidence,
    findings: raw.findings.map((f, i) => ({ ...f, id: `f${i + 1}` })),
    recommendations: raw.recommendations,
    risks: raw.risks,
  };
}
