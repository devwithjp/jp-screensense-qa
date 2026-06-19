# Security & privacy — ScreenSense QA

## Secrets
- No secrets in source. `ANTHROPIC_API_KEY` is read only server-side, only in live mode.
- `.env.example` ships blank; `.env.local` git-ignored; production secrets in Vercel env vars.
- The vision call runs in a Node API route (`runtime = "nodejs"`); the client never sees the key.

## Data & privacy
- **Mock mode: the uploaded image never leaves the browser** — it's used only for local preview; the server receives just the rubric.
- Live mode sends the image to the vision model for that single request; it is not persisted by this app.
- No uploads are stored server-side. Add a retention/consent notice before accepting sensitive screenshots.

## Input validation
- `POST /api/analyze` validates the rubric against an allowlist and caps image payloads (~5MB → 413).
- `POST /api/feedback` validates a 1–5 rating.

## Rate limiting & cost
- Mock mode makes no model calls.
- Live mode caps `max_tokens` (2048) per critique. Add a platform rate limit before exposing live mode publicly.

## Threat model (MVP)
- **Prompt injection via image text:** the model is instructed to critique only what's visible and not follow embedded instructions; output is rendered, never executed.
- **Unsupported design claims (guardrail):** each finding carries a severity and the critique a confidence label; uncertainty is surfaced, not hidden.
- **Leaked keys / token spend:** server-only key access, mock-first default, capped tokens, image size cap.
