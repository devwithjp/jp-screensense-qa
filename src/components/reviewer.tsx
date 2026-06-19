"use client";

import { useRef, useState } from "react";
import type { Critique, Finding, Severity } from "@/lib/types";
import { rubricList } from "@/lib/rubrics";
import type { RubricId } from "@/lib/types";
import { track } from "@/lib/analytics";
import { apiPath } from "@/lib/base";

const sevChip: Record<Severity, string> = {
  critical: "bg-accent text-accent-fg",
  high: "border border-accent text-fg",
  medium: "border border-line text-muted",
  low: "border border-line text-muted/70",
};

function SeverityBadge({ s }: { s: Severity }) {
  return <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${sevChip[s]}`}>{s}</span>;
}

export function Reviewer() {
  const [rubric, setRubric] = useState<RubricId>("ux");
  const [preview, setPreview] = useState<string | null>(null);
  const [critique, setCritique] = useState<Critique | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Severity | "all">("all");
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function analyze(useSample: boolean) {
    setLoading(true);
    setError(null);
    setCritique(null);
    track("demo_started", { rubric, sample: useSample });
    try {
      const res = await fetch(apiPath("/api/analyze"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rubric, mode: "mock" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      if (useSample && !preview) setPreview("sample");
      setCritique(data.critique);
      setFilter("all");
      track("ai_output_generated", { rubric, findings: data.critique.findings.length });
      track("core_action_completed", { rubric });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      track("error_seen", { where: "analyze" });
    } finally {
      setLoading(false);
    }
  }

  function exportMd() {
    if (!critique) return;
    const md =
      `# UI Review — ${rubric}\n\n${critique.summary}\n\nConfidence: ${critique.confidence}\n\n## Findings\n` +
      critique.findings
        .map((f) => `### [${f.severity.toUpperCase()}] ${f.title} (${f.category})\n${f.description}\n\n**Fix:** ${f.suggestion}\n`)
        .join("\n") +
      `\n## Recommendations\n${critique.recommendations.map((r) => `- ${r}`).join("\n")}\n\n## Risks\n${critique.risks
        .map((r) => `- ${r}`)
        .join("\n")}\n`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ui-review.md";
    a.click();
    URL.revokeObjectURL(url);
    track("export_clicked", { rubric });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
      {/* Left: input */}
      <div className="space-y-5">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileRef.current?.click()}
          className="flex aspect-[16/10] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-surface text-center transition-colors hover:border-accent/50"
        >
          {preview && preview !== "sample" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Uploaded screenshot" className="h-full w-full object-contain" />
          ) : preview === "sample" ? (
            <div className="bg-grid flex h-full w-full items-center justify-center">
              <span className="font-mono text-xs text-muted">sample screenshot</span>
            </div>
          ) : (
            <div className="px-6">
              <div className="text-sm text-fg">Drop a screenshot or click to upload</div>
              <div className="mt-1 text-xs text-muted">PNG / JPG — analysed locally in mock mode</div>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          />
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-muted">Rubric</div>
          <div className="grid grid-cols-2 gap-2">
            {rubricList.map((r) => (
              <button
                key={r.id}
                onClick={() => setRubric(r.id)}
                className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                  rubric === r.id ? "border-accent bg-accent/5" : "border-line hover:bg-elevated"
                }`}
              >
                <div className="font-medium">{r.name}</div>
                <div className="mt-0.5 text-xs text-muted">{r.blurb}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => analyze(false)}
            disabled={loading}
            className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-accent-fg disabled:opacity-50"
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
          <button
            onClick={() => analyze(true)}
            disabled={loading}
            className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm hover:bg-elevated disabled:opacity-50"
          >
            Use sample
          </button>
        </div>
        {error ? <p className="text-sm text-muted">⚠ {error}</p> : null}
      </div>

      {/* Right: results */}
      <div>
        {!critique ? (
          <div className="flex h-full min-h-64 items-center justify-center rounded-xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
            Pick a rubric and click <span className="mx-1 text-fg">Analyze</span> to get severity-ranked findings.
          </div>
        ) : (
          <Results critique={critique} filter={filter} setFilter={setFilter} onExport={exportMd} />
        )}
      </div>
    </div>
  );
}

function Results({
  critique,
  filter,
  setFilter,
  onExport,
}: {
  critique: Critique;
  filter: Severity | "all";
  setFilter: (s: Severity | "all") => void;
  onExport: () => void;
}) {
  const counts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const f of critique.findings) counts[f.severity]++;
  const shown = critique.findings.filter((f) => filter === "all" || f.severity === filter);

  return (
    <div className="space-y-6">
      {critique.mode === "mock" ? (
        <div className="rounded-lg border border-line bg-surface px-4 py-2 font-mono text-xs text-muted">
          sample analysis (mock mode) — add ANTHROPIC_API_KEY for a real vision critique of your screenshot
        </div>
      ) : null}

      <div className="rounded-xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-muted">Summary</h2>
          <span className="font-mono text-xs text-muted">confidence: {critique.confidence}</span>
        </div>
        <p className="mt-2 leading-relaxed">{critique.summary}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(["all", "critical", "high", "medium", "low"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 font-mono text-xs capitalize transition-colors ${
              filter === s ? "bg-elevated text-fg" : "text-muted hover:text-fg"
            }`}
          >
            {s}
            {s !== "all" ? ` ${counts[s]}` : ` ${critique.findings.length}`}
          </button>
        ))}
        <button onClick={onExport} className="ml-auto rounded-full border border-line px-3 py-1 text-xs hover:bg-elevated">
          Export .md
        </button>
      </div>

      <div className="space-y-3">
        {shown.map((f) => (
          <FindingCard key={f.id} f={f} />
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-5">
          <div className="font-mono text-xs uppercase tracking-wider text-accent">Recommendations</div>
          <ul className="mt-2 space-y-1.5">
            {critique.recommendations.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted">
                <span className="mt-2 h-1 w-1 flex-none rounded-full bg-accent" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5">
          <div className="font-mono text-xs uppercase tracking-wider text-muted">Product risks</div>
          <ul className="mt-2 space-y-1.5">
            {critique.risks.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted">
                <span className="mt-2 h-1 w-1 flex-none rounded-full bg-muted" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface p-5">
        <div className="font-mono text-xs uppercase tracking-wider text-accent">Metrics interpretation</div>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {critique.findings.length} actionable issues found ({counts.critical} critical, {counts.high} high). North-star
          signal: actionable issues per review. A repeat review after a redesign should show fewer critical/high
          findings — that delta is the value.
        </p>
      </div>
    </div>
  );
}

function FindingCard({ f }: { f: Finding }) {
  const [rated, setRated] = useState(false);
  async function rate(n: number) {
    await fetch(apiPath("/api/feedback"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ rating: n, findingId: f.id }),
    });
    setRated(true);
    track("feedback_submitted", { rating: n, findingId: f.id });
  }
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center gap-2">
        <SeverityBadge s={f.severity} />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{f.category}</span>
        <h3 className="font-medium">{f.title}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{f.description}</p>
      <div className="mt-2 rounded-lg border border-line bg-bg p-3 text-sm">
        <span className="text-accent">Fix:</span> {f.suggestion}
      </div>
      <div className="mt-3 flex items-center gap-2">
        {rated ? (
          <span className="text-xs text-muted">Thanks.</span>
        ) : (
          <>
            <span className="text-xs text-muted">Useful?</span>
            <button onClick={() => rate(5)} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted hover:border-accent hover:text-fg">
              👍
            </button>
            <button onClick={() => rate(2)} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted hover:text-fg">
              👎
            </button>
          </>
        )}
      </div>
    </div>
  );
}
