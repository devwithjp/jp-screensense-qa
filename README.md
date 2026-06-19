# ScreenSense QA

**Ship better screens.** A multimodal UX & product QA tool: upload a screenshot, pick a rubric, and get **severity-ranked** accessibility, UX, copy, and trust findings — each with a concrete fix.

Part of [JP's AI portfolio](../jp-ai-portfolio). Built mock-first: the demo runs with **zero API keys** (curated sample critiques).

> One-line pitch: *Multimodal UX & accessibility review assistant.*

## Live demo

- _(deploying to Vercel — URL added at launch)_

## What it does

- **Upload** a screenshot (or use a sample).
- Choose a **rubric**: Accessibility · Conversion/PM · Trust & safety · General UX.
- Get a structured **critique**: summary, severity-ranked findings (title, category, description, fix), recommendations, risks, confidence.
- **Filter** by severity, rate findings 👍/👎, **export** a Markdown report, read a metrics interpretation.

## How it works

```
upload → rubric → multimodal critique → severity rank → report
```

- **Strict output contract:** the model returns fixed JSON (findings with severity/category/description/suggestion) — safe to render, deterministic to test, triageable by a PM.
- **Mock mode (default):** curated, rubric-specific sample critiques — no key, clearly labelled.
- **Live mode:** `claude-opus-4-8` vision critiques the actual uploaded image; same JSON contract.

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Claude vision (`claude-opus-4-8`) · structured output · Vercel.

## Architecture

- `src/lib` — `types`, `rubrics`, `mock` (fixtures), `vision` (live Claude vision + JSON schema), `analyze` (orchestrator + severity sort), `analytics`.
- `src/app/api` — `POST /api/analyze`, `POST /api/feedback`.
- `src/components/reviewer.tsx` — upload + rubric + severity-filtered results + export.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000 — mock mode, no key
npm run lint && npx tsc --noEmit && npm run build
```

## Environment variables

See `.env.example` — all optional. `ANTHROPIC_API_KEY` enables real vision. No secrets committed; `.env.local` git-ignored.

## Deployment

Import into Vercel (Next.js preset). Optionally add `ANTHROPIC_API_KEY` for live vision. Mock mode needs no config.

## AI engineering skills demonstrated

Multimodal (vision) pipeline, strict structured-output contract, severity ranking, mock-first fixtures, image handling, Next.js API routes.

## AI PM skills demonstrated

Framing AI critique as a prioritised backlog (not an essay), a quality/guardrail metric pair, rubric-driven product lenses. See `AI_PM_CASE_STUDY.md`.
