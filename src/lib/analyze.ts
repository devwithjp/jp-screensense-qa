import type { Critique, RubricId } from "./types";
import { SEVERITY_ORDER } from "./types";
import { mockCritique } from "./mock";
import { liveVisionAvailable, liveCritique } from "./vision";

// Orchestrator: real vision critique when a key + image are present, else the curated
// mock critique for the chosen rubric. Findings are always severity-sorted.
export async function analyze(
  rubric: RubricId,
  image?: { base64: string; mediaType: string },
  mode: "mock" | "live" = "mock"
): Promise<Critique> {
  let critique: Critique;
  if (mode === "live" && liveVisionAvailable() && image) {
    critique = await liveCritique(rubric, image.base64, image.mediaType);
  } else {
    critique = mockCritique(rubric);
  }
  critique.findings.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  return critique;
}

export function severityCounts(critique: Critique): Record<string, number> {
  const counts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const f of critique.findings) counts[f.severity]++;
  return counts;
}
