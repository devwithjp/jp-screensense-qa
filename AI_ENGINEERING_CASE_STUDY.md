# AI Engineering Case Study — ScreenSense QA

**Problem.** Small teams ship interfaces without design review, accessibility checks, or PM-grade critique. They need fast, structured feedback — not a generic "looks good".

**Multimodal pipeline.** upload → preprocess → multimodal critique → rubric scoring → severity-ranked report.
- **Vision** (`vision.ts`): `claude-opus-4-8` receives the image + a rubric-focused prompt and returns a strict JSON contract via `output_config.format` (summary, findings[], recommendations[], risks[], confidence).
- **Severity ranking** (`analyze.ts`): findings sorted critical → low so the worst issues surface first.
- **Mock-first** (`mock.ts`): curated, rubric-specific fixtures power the demo with no key and make CI deterministic; the image stays client-side in mock mode.

**Trade-offs.**
- Pixel-accurate bounding boxes deferred — issue cards ranked by severity are the 80/20 and avoid the hardest part of visual grounding.
- Image sent to the model only in live mode (privacy + payload), with a size cap.

**What I'd improve next.** Bounding-box overlays on the screenshot; diff mode (before/after redesign); batch review of a flow; an eval set scoring critique usefulness against human labels.

**Interview talking points.** Designing a strict structured-output contract for a vision model; why bounding boxes were deferred; how severity + confidence make AI critique triageable.
