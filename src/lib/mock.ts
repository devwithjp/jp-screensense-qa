import type { Critique, Finding, RubricId } from "./types";

// Curated sample critiques per rubric. In mock mode (no vision key) these realistic
// findings for a typical UI screenshot power the demo — clearly labelled as a sample
// analysis. Live mode replaces these with a real critique of the uploaded image.

const F = (
  id: string,
  title: string,
  severity: Finding["severity"],
  category: Finding["category"],
  description: string,
  suggestion: string
): Finding => ({ id, title, severity, category, description, suggestion });

const fixtures: Record<RubricId, Critique> = {
  accessibility: {
    mode: "mock",
    rubric: "accessibility",
    confidence: "medium",
    summary:
      "Several WCAG issues would block users with low vision or motor impairments. Contrast and touch-target sizing are the highest-impact fixes.",
    findings: [
      F("a1", "Low contrast body text", "critical", "accessibility", "Secondary/grey text appears below the 4.5:1 WCAG AA contrast ratio against the background.", "Darken muted text to meet 4.5:1; verify with a contrast checker."),
      F("a2", "Touch targets below 44px", "high", "accessibility", "Icon buttons and links look smaller than the 44×44px minimum, hard to hit on mobile.", "Increase hit areas to ≥44px; add padding around icon-only controls."),
      F("a3", "Color-only status cues", "high", "accessibility", "Status appears conveyed by colour alone (e.g. red/green), invisible to colour-blind users.", "Pair colour with an icon or text label."),
      F("a4", "Missing visible focus state", "medium", "accessibility", "No obvious keyboard focus indicator is visible on interactive elements.", "Add a high-contrast focus ring for keyboard navigation."),
      F("a5", "Placeholder used as label", "medium", "copy", "Fields appear to rely on placeholder text instead of persistent labels.", "Add persistent labels; keep placeholders for examples only."),
    ],
    recommendations: [
      "Fix contrast and target sizing first — they affect the most users.",
      "Run an automated axe/Lighthouse pass, then a manual keyboard walkthrough.",
    ],
    risks: ["Legal/accessibility-compliance exposure if shipped as-is.", "Mobile usability drop for a meaningful share of users."],
  },
  conversion: {
    mode: "mock",
    rubric: "conversion",
    confidence: "medium",
    summary:
      "The primary action competes with secondary elements and the value proposition is thin above the fold — both likely suppress conversion.",
    findings: [
      F("c1", "Primary CTA lacks emphasis", "high", "conversion", "The main call-to-action doesn't stand out from secondary buttons, diluting the next step.", "Make one primary CTA visually dominant; demote the rest to secondary styling."),
      F("c2", "Weak above-the-fold value prop", "high", "copy", "The headline describes the product but not the user benefit or outcome.", "Lead with the outcome the user gets, not the feature."),
      F("c3", "Form friction", "medium", "ux", "The form appears to ask for more fields than needed to start.", "Cut to the minimum fields; defer the rest post-signup."),
      F("c4", "No trust signals near CTA", "medium", "trust", "No social proof, guarantee, or reassurance sits next to the action.", "Add a brief proof point or risk-reducer beside the CTA."),
      F("c5", "Unclear pricing path", "low", "conversion", "It's not obvious how to get to pricing or what the next commitment is.", "Surface a clear, low-friction next step (e.g. 'See pricing')."),
    ],
    recommendations: [
      "Establish one dominant CTA and a benefit-led headline before other tweaks.",
      "A/B test the headline and CTA prominence — likely the biggest levers.",
    ],
    risks: ["Lost conversions from a diluted primary action.", "Bounce risk if the value isn't clear in the first few seconds."],
  },
  trust: {
    mode: "mock",
    rubric: "trust",
    confidence: "medium",
    summary:
      "A few patterns could erode trust: unclear terms near commitments and emphasis that nudges toward the costlier path. No egregious dark patterns detected in this sample.",
    findings: [
      F("t1", "Hidden/ambiguous terms near action", "high", "trust", "Commitment-related terms (billing, auto-renew) appear small or absent near the action.", "State key terms plainly next to the action, not only in a footer."),
      F("t2", "Asymmetric option emphasis", "medium", "trust", "The more expensive option is visually pushed while the cheaper/decline path is muted.", "Give options balanced emphasis; don't visually penalise the cheaper choice."),
      F("t3", "Vague data/consent copy", "medium", "copy", "What happens with the user's data isn't clearly stated at the point of entry.", "Add a one-line, plain-language data note near the input."),
      F("t4", "Unsubstantiated claims", "low", "copy", "Superlatives ('best', '#1') without evidence reduce credibility.", "Replace with specific, verifiable proof points."),
    ],
    recommendations: [
      "Make commitments and terms transparent at the decision point.",
      "Audit for emphasis asymmetry across pricing/consent choices.",
    ],
    risks: ["Trust erosion and churn if terms feel hidden.", "Reputational/regulatory risk from dark-pattern-adjacent emphasis."],
  },
  ux: {
    mode: "mock",
    rubric: "ux",
    confidence: "medium",
    summary:
      "The layout is functional but visual hierarchy and spacing are inconsistent, raising cognitive load and making the primary path less scannable.",
    findings: [
      F("u1", "Flat visual hierarchy", "high", "hierarchy", "Headings, body, and actions are too similar in weight, so the eye has no clear path.", "Increase contrast between heading/body/action; establish a clear type scale."),
      F("u2", "Inconsistent spacing", "medium", "ux", "Padding and gaps vary between similar elements, making the layout feel unsettled.", "Adopt a consistent spacing scale (e.g. 4/8px steps)."),
      F("u3", "Dense information block", "medium", "ux", "A region packs too much at once, increasing cognitive load.", "Group and chunk content; add whitespace and progressive disclosure."),
      F("u4", "Inconsistent component styling", "low", "ux", "Buttons/inputs vary in radius/size across the screen.", "Unify component styles via shared tokens/components."),
    ],
    recommendations: [
      "Fix hierarchy first — it makes everything else more scannable.",
      "Introduce a spacing scale and apply it consistently.",
    ],
    risks: ["Higher cognitive load slows task completion.", "Perceived lower quality from visual inconsistency."],
  },
};

export function mockCritique(rubric: RubricId): Critique {
  // Return a fresh copy so callers can sort/filter without mutating the fixture.
  return JSON.parse(JSON.stringify(fixtures[rubric])) as Critique;
}
