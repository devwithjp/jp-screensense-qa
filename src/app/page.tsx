import { app } from "@/lib/site";
import { Container, Section, Eyebrow } from "@/components/ui";
import { Reviewer } from "@/components/reviewer";

export default function Home() {
  return (
    <>
      <div className="relative overflow-hidden border-b border-line">
        <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
        <div className="accent-glow absolute inset-0 -z-10" aria-hidden />
        <Container className="py-14 sm:py-16">
          <div className="max-w-3xl">
            <Eyebrow>Multimodal · Product UX</Eyebrow>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">{app.tagline}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{app.description}</p>
            <p className="mt-4 font-mono text-xs text-muted">
              Mock mode shows a curated sample analysis — no key. Add ANTHROPIC_API_KEY for real vision critique of your screenshot.
            </p>
          </div>
        </Container>
      </div>

      <Section>
        <Reviewer />
      </Section>
    </>
  );
}
