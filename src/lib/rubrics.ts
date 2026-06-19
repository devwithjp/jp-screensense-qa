import type { RubricId } from "./types";

export type Rubric = {
  id: RubricId;
  name: string;
  blurb: string;
  focus: string; // appended to the vision prompt
};

export const rubrics: Record<RubricId, Rubric> = {
  accessibility: {
    id: "accessibility",
    name: "Accessibility",
    blurb: "Contrast, target size, focus, alt text, semantics, keyboard paths.",
    focus:
      "Prioritise WCAG issues: colour contrast, text size/legibility, touch-target size, focus indicators, missing labels/alt text, and reliance on colour alone.",
  },
  conversion: {
    id: "conversion",
    name: "Conversion / PM",
    blurb: "Primary CTA clarity, funnel friction, value proposition, trust signals.",
    focus:
      "Prioritise conversion: is the primary action obvious, is the value proposition clear above the fold, what friction blocks the next step, and is the copy benefit-led?",
  },
  trust: {
    id: "trust",
    name: "Trust & safety",
    blurb: "Credibility, transparency, dark patterns, data/consent clarity.",
    focus:
      "Prioritise trust: credibility signals, transparency of pricing/terms, any dark patterns or pressure, and clarity of data/consent handling.",
  },
  ux: {
    id: "ux",
    name: "General UX",
    blurb: "Hierarchy, spacing, consistency, clarity, cognitive load.",
    focus:
      "Prioritise general UX: visual hierarchy, spacing/alignment, consistency, scannability, and cognitive load.",
  },
};

export const rubricList = Object.values(rubrics);
