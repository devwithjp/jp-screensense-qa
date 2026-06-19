// ScreenSense QA — domain types for multimodal UI critique.

export type Severity = "critical" | "high" | "medium" | "low";
export type Category = "accessibility" | "ux" | "copy" | "hierarchy" | "trust" | "conversion";
export type RubricId = "accessibility" | "conversion" | "trust" | "ux";

export type Finding = {
  id: string;
  title: string;
  severity: Severity;
  category: Category;
  description: string;
  suggestion: string;
};

export type Critique = {
  mode: "mock" | "live";
  rubric: RubricId;
  summary: string;
  confidence: "low" | "medium" | "high";
  findings: Finding[];
  recommendations: string[];
  risks: string[];
};

export const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};
