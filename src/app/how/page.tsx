import type { Metadata } from "next";
import { Section, SectionHeader, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "How it works",
  description: "The ScreenSense QA multimodal pipeline and the thinking behind it.",
};

const steps = [
  { n: "1", t: "Upload", d: "Drop a screenshot. In mock mode it stays in your browser; in live mode it's sent to the vision model." },
  { n: "2", t: "Rubric", d: "Pick a lens — accessibility, conversion/PM, trust & safety, or general UX. The rubric focuses the critique." },
  { n: "3", t: "Critique", d: "claude-opus-4-8 vision analyses the image against the rubric and returns a strict JSON contract (summary, findings, recommendations, risks, confidence)." },
  { n: "4", t: "Severity ranking", d: "Findings are ordered critical → low so the worst issues surface first." },
  { n: "5", t: "Report", d: "Filter by severity, send a finding 👍/👎, and export a Markdown report." },
];

export default function HowPage() {
  return (
    <Section>
      <SectionHeader
        eyebrow="How it works"
        title="A senior design review, structured"
        intro="A single-call vision pipeline with a strict output contract — so the critique is safe to render, easy to test, and triageable by a PM."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {steps.map((s) => (
          <div key={s.n} className="flex gap-4 rounded-xl border border-line bg-surface p-5">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-line bg-elevated font-mono text-sm text-accent">
              {s.n}
            </span>
            <div>
              <div className="font-medium">{s.t}</div>
              <p className="mt-1 text-sm leading-relaxed text-muted">{s.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 max-w-2xl">
        <Eyebrow>Why a strict output contract</Eyebrow>
        <p className="mt-3 leading-relaxed text-muted">
          The model returns a fixed JSON shape (findings with severity, category, description, suggestion). That makes
          multimodal output safe to render, deterministic to test, and — crucially — triageable: a PM gets a ranked
          backlog, not an essay.
        </p>
        <Eyebrow>Why severity + confidence</Eyebrow>
        <p className="mt-3 leading-relaxed text-muted">
          Each finding carries a severity, and the critique carries a confidence label. That keeps the tool honest:
          the guardrail is unsupported design claims, and confidence makes uncertainty visible instead of hiding it.
        </p>
        <Eyebrow>What I deferred</Eyebrow>
        <p className="mt-3 leading-relaxed text-muted">
          Pixel-accurate bounding boxes are out of the MVP — issue cards ranked by severity are the 80/20 of value and
          avoid the hardest part of visual grounding.
        </p>
      </div>
    </Section>
  );
}
