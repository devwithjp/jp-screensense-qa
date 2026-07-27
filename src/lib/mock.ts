import type { Critique, Finding, Region, RubricId } from "./types";

// Curated sample critiques per rubric, grounded in the bundled sample screenshot
// (public/sample-checkout.svg — a deliberately flawed "CloudMetric" SaaS checkout).
// Every finding names a real element in that image, and `region` pins it as
// percentages of the 1200x750 canvas so the UI can draw numbered markers.
// Live mode replaces these with a real critique of the uploaded image.

const F = (
  id: string,
  title: string,
  severity: Finding["severity"],
  category: Finding["category"],
  description: string,
  suggestion: string,
  region?: Region
): Finding => ({ id, title, severity, category, description, suggestion, region });

const fixtures: Record<RubricId, Critique> = {
  accessibility: {
    mode: "mock",
    rubric: "accessibility",
    confidence: "high",
    summary:
      "This checkout has several WCAG failures concentrated in the payment form: every field relies on placeholder-only labels, the card error is colour-only, and both the close control and the CVC help icon are unusable for many users. Labels and the error message are the highest-impact fixes.",
    findings: [
      F(
        "a1",
        "Payment fields use placeholder-only labels",
        "critical",
        "accessibility",
        "The email and card number fields have no visible labels — only grey placeholder text ('Email address', 'Card number') that vanishes the moment the user types. At roughly 2.4:1 contrast the placeholders also fail WCAG AA before they disappear.",
        "Add persistent labels above each field and keep placeholders for format examples only (e.g. '4242 4242 4242 4242').",
        { x: 8.7, y: 29.9, w: 45.3, h: 13.9 }
      ),
      F(
        "a2",
        "Card error is signalled by colour alone",
        "high",
        "accessibility",
        "The card number field shows a red border but no error message or icon, so colour-blind users get no signal — and no user learns what is actually wrong (WCAG 1.4.1).",
        "Pair the red border with an inline error message and icon, e.g. 'Check your card number — it looks one digit short.'",
        { x: 8.7, y: 37.9, w: 45.3, h: 5.9 }
      ),
      F(
        "a3",
        "Close control is a ~15px target",
        "high",
        "accessibility",
        "The ✕ in the top-right corner is a bare 15px glyph — far below the 44×44px minimum touch target and easy to miss entirely on mobile.",
        "Wrap the ✕ in a ≥44px hit area with a visible hover/focus state, or replace it with a labelled 'Back to plans' link.",
        { x: 96.0, y: 2.9, w: 2.7, h: 4.0 }
      ),
      F(
        "a4",
        "Unlabelled '?' icon button next to CVC",
        "medium",
        "accessibility",
        "The tiny '?' circle beside the CVC field has no text label and no accessible name, so screen-reader users hear nothing useful — and its 18px size fails target-size minimums too.",
        "Give it an aria-label ('What is CVC?'), grow it to ≥24px, and show the explanation on focus as well as hover.",
        { x: 50.5, y: 46.1, w: 3.3, h: 5.3 }
      ),
      F(
        "a5",
        "Renewal terms fail contrast at 9px",
        "medium",
        "accessibility",
        "The auto-renew disclosure under the purchase button ('Renews automatically at $59/mo…') is set in ~9px type at roughly 1.6:1 contrast — effectively invisible to low-vision users.",
        "Raise the disclosure to ≥12px at 4.5:1 contrast; billing terms are exactly the text that must be readable.",
        { x: 8.7, y: 77.6, w: 45.3, h: 2.1 }
      ),
    ],
    recommendations: [
      "Fix labels and the card error message first — they block completion for the most users.",
      "Then sweep target sizes: the close ✕ and the '?' help icon both need ≥44px hit areas.",
    ],
    risks: [
      "Checkout abandonment from users who can't tell which field is wrong.",
      "Accessibility-compliance exposure on the money page, the worst place to have it.",
    ],
  },
  conversion: {
    mode: "mock",
    rubric: "conversion",
    confidence: "high",
    summary:
      "Two things suppress conversion on this checkout: 'Apply coupon' is styled as a second primary button competing with 'Complete purchase', and the CTA promises $49/mo while the order summary asks for $100.10 today. Price surprise plus a split primary action is the classic abandonment recipe.",
    findings: [
      F(
        "c1",
        "'Apply coupon' competes with 'Complete purchase'",
        "high",
        "conversion",
        "Both buttons use the same filled indigo treatment, so the screen has two primary actions. The coupon button sits higher in the form and reads as the next step, diluting the purchase CTA.",
        "Demote the coupon action to a text link ('Have a coupon?') that expands inline; keep exactly one filled button on the page.",
        { x: 8.7, y: 55.5, w: 45.3, h: 20.5 }
      ),
      F(
        "c2",
        "CTA price contradicts the total",
        "high",
        "conversion",
        "The button says 'Complete purchase — $49/mo' but the order summary totals $100.10 due today (seats + support + tax). Users who spot the mismatch at the last second are prime abandoners.",
        "Make the CTA state the real charge: 'Pay $100.10 today', with the monthly breakdown directly above it.",
        { x: 8.7, y: 69.6, w: 45.3, h: 6.4 }
      ),
      F(
        "c3",
        "Open coupon field invites users to leave",
        "medium",
        "conversion",
        "A permanently visible, empty 'Coupon code' field tells every buyer a discount exists — sending them off-site to hunt for codes mid-checkout.",
        "Collapse the field behind a low-key 'Have a coupon?' link; only voucher-holders will open it.",
        { x: 8.7, y: 55.5, w: 32.0, h: 5.9 }
      ),
      F(
        "c4",
        "Add-ons are easy to misread in the cramped summary",
        "medium",
        "ux",
        "'Additional seats × 3' and 'Priority support add-on' add $42 but sit in tightly packed rows with no edit affordance — a surprise-charge dispute waiting to happen.",
        "Space the line items, and give seats and add-ons inline 'change' controls so the total feels chosen, not imposed.",
        { x: 62.7, y: 22.4, w: 28.7, h: 19.7 }
      ),
      F(
        "c5",
        "No reassurance at the point of payment",
        "low",
        "trust",
        "Below the purchase button there's only unreadable fine print — no guarantee, refund note, or security cue where the user commits.",
        "Add one line of legible reassurance under the CTA, e.g. '30-day money-back guarantee · Secured by CloudPay'.",
        { x: 8.7, y: 76.3, w: 45.3, h: 4.0 }
      ),
    ],
    recommendations: [
      "Resolve the $49 vs $100.10 mismatch first — price surprise is the strongest abandonment trigger here.",
      "Then collapse the coupon action to a link; expect a measurable lift from removing the second primary.",
    ],
    risks: [
      "Cart abandonment at the final click from price surprise.",
      "Discount-code leakage: the open coupon field trains full-price buyers to go looking.",
    ],
  },
  trust: {
    mode: "mock",
    rubric: "trust",
    confidence: "high",
    summary:
      "This checkout leans on three dark-pattern-adjacent moves: the $49→$59 auto-renew jump is buried in 9px fine print, the partner-offers consent checkbox comes pre-ticked, and an unverifiable '#1 analytics platform' badge sits above the card field. Each is individually small; together they read as a screen designed to slip things past the buyer.",
    findings: [
      F(
        "t1",
        "Auto-renew price jump hidden in fine print",
        "high",
        "trust",
        "The button sells $49/mo, while barely legible 9px text below it discloses the price 'renews automatically at $59/mo after the 3-month promo'. Material billing terms are formatted to be skipped.",
        "State the renewal plainly beside the CTA at body size: '$49/mo for 3 months, then $59/mo. Cancel anytime.'",
        { x: 8.7, y: 77.6, w: 45.3, h: 2.1 }
      ),
      F(
        "t2",
        "Consent checkbox is pre-ticked",
        "high",
        "trust",
        "'Email me product updates and partner offers' comes pre-checked — opting users into third-party marketing by default, which fails GDPR-style consent standards and erodes goodwill.",
        "Default the box to unchecked, and split 'product updates' from 'partner offers' into separate opt-ins.",
        { x: 8.7, y: 63.5, w: 35.0, h: 3.5 }
      ),
      F(
        "t3",
        "'#1 analytics platform' claim is unsubstantiated",
        "medium",
        "copy",
        "The badge above the form claims '#1 analytics platform — loved by 50,000+ teams' with no source, rating, or link. Superlatives without evidence lower credibility exactly where card details are requested.",
        "Replace with a verifiable proof point ('4.7★ on G2, 1,200 reviews', linked) or remove the badge.",
        { x: 8.7, y: 22.7, w: 29.3, h: 3.5 }
      ),
      F(
        "t4",
        "'Total due today' quietly doubles the advertised price",
        "medium",
        "trust",
        "The summary's $100.10 'Total due today' — seats, add-on, and tax — appears at the same 13px weight as every other row, while the headline price everywhere else is $49/mo. It reads as a drip-pricing reveal.",
        "Show the full first-charge maths before checkout, and make the total row visually honest: larger, bolder, unmissable.",
        { x: 62.7, y: 38.9, w: 28.7, h: 2.9 }
      ),
    ],
    recommendations: [
      "Surface the renewal terms and true total at the decision point — transparency here is cheap, churn is not.",
      "Audit consent defaults: nothing that shares data with partners should ever be pre-checked.",
    ],
    risks: [
      "Chargebacks and support load when the $59 renewal or $100.10 first charge lands unexpectedly.",
      "Regulatory exposure (consumer-protection and consent rules) from pre-ticked marketing consent.",
    ],
  },
  ux: {
    mode: "mock",
    rubric: "ux",
    confidence: "high",
    summary:
      "The two-column layout is sound, but hierarchy breaks where it matters: two identical filled buttons split the primary action, the order summary packs seven money rows into an undifferentiated block, and spacing tightens arbitrarily around the expiry/CVC row. The screen works — it just makes the user do the sorting.",
    findings: [
      F(
        "u1",
        "Two equal-weight buttons split the screen's one job",
        "high",
        "hierarchy",
        "'Apply coupon' and 'Complete purchase' share the same filled indigo style, so the eye has no single terminus. A checkout has exactly one job; this one visually offers two.",
        "Keep 'Complete purchase' as the only filled button; restyle 'Apply coupon' as a quiet text link or ghost button.",
        { x: 8.7, y: 55.5, w: 45.3, h: 20.5 }
      ),
      F(
        "u2",
        "Order summary rows are cramped and the total doesn't land",
        "medium",
        "ux",
        "Seven money rows sit at ~22px line spacing with 'Total due today — $100.10' styled identically to 'Tax'. The most important number on the screen has the least emphasis.",
        "Add breathing room between rows and set the total apart: larger size, heavier weight, and a stronger divider above it.",
        { x: 62.7, y: 22.4, w: 28.7, h: 19.7 }
      ),
      F(
        "u3",
        "Expiry/CVC row is crowded",
        "medium",
        "ux",
        "The MM/YY and CVC inputs sit 8px apart — half the gutter used elsewhere — and the '?' icon crowds the CVC field's edge, making the row feel jammed against its neighbours.",
        "Use one consistent gutter (16px) across the form and give the help icon clear separation from the input.",
        { x: 8.7, y: 45.9, w: 45.3, h: 5.9 }
      ),
      F(
        "u4",
        "Button shapes disagree",
        "low",
        "ux",
        "'Apply coupon' is a full pill (22px radius) while 'Complete purchase' is a rounded rectangle (8px radius). Same colour, different species — a small tell that erodes perceived quality.",
        "Pick one radius token for buttons and apply it everywhere.",
        { x: 41.3, y: 55.5, w: 12.7, h: 5.9 }
      ),
    ],
    recommendations: [
      "Fix the button hierarchy first — one primary action makes the whole screen scannable.",
      "Then rework the order summary: spacing plus an emphasised total solves two findings at once.",
    ],
    risks: [
      "Higher cognitive load at the exact moment users decide whether to pay.",
      "Visual inconsistency reads as sloppiness, which users generalise to the product's reliability.",
    ],
  },
};

export function mockCritique(rubric: RubricId): Critique {
  // Return a fresh copy so callers can sort/filter without mutating the fixture.
  return JSON.parse(JSON.stringify(fixtures[rubric])) as Critique;
}
