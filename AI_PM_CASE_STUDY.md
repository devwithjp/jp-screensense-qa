# AI PM Case Study — ScreenSense QA

**Product problem.** Founders and small teams without a designer need a credible heuristic review in seconds — framed as a prioritised backlog, not a critique essay.

**ICP & personas.** Solo builders / small SaaS teams reviewing landing pages, dashboards, onboarding, and forms before shipping. Jobs: catch the embarrassing issues; get a ranked to-do list.

**MVP scope.**
- In: upload, four rubrics, severity-ranked findings with fixes, filter, 👍/👎, Markdown export, metrics interpretation.
- Out (V2): bounding-box annotation, Figma integration, full-flow batch review.

**Metrics.**
- **North star:** actionable UX issues found per review.
- **Activation:** first screenshot review completed.
- **Retention:** repeat review after a redesign.
- **Quality:** user accepts a finding as useful (👍 rate).
- **Guardrail:** false / unsupported design claims (confidence labels surface uncertainty).

**Experiment plan.** Hypothesis: severity-ranked issue cards drive more fixes than a prose critique. Variant A: prose summary. Variant B: ranked cards with fixes. Success: higher 👍 rate and more issues marked resolved on re-review.

**Roadmap.** MVP (this) → V1: bounding boxes + before/after diff → V2: flow-level batch review, design-system-aware checks, integrations.

**GTM.** Wedge: "drop a screenshot, get a ranked design review in seconds, no signup." Distribute via design/build communities and the portfolio.

**Trade-offs.** Multimodal grounding is hard (mitigated by deferring bounding boxes to issue cards first); chose rubric lenses so one tool serves accessibility, conversion, trust, and UX audiences.
