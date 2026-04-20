# CliffCheck — Project Instructions

## What This Is
Benefits Cliff Navigator — a phone-first web app revealing the hidden math behind benefits cliffs. Built for VibeJam 2026 hackathon (5-day sprint ending April 25 midnight PST).

**Theme:** "Escape the permanent underclass"
**Track:** VibesOS (React + TinyBase + Tailwind, single HTML file, Cloudflare Workers)
**Repo:** github.com/cathalos92/cliffcheck (open source, required by rules)

## Stack (VibesOS)
- React 19 with JSX + Babel runtime transpilation
- TinyBase for local-first data (financial data stays on-device)
- Tailwind CSS for styling
- Single HTML file architecture — no backend server
- Deploy to Cloudflare Workers via VibesOS deploy pipeline
- Chart.js (or similar lightweight library) for cliff visualization

## VibesOS Stack (Direct)
Using VibesOS stack directly (no plugin wrapper). Reference repo at `~/Ai-App-Projects/VibesOS`.
- `index.html` is the single-file app — React + TinyBase + Tailwind loaded from CDN
- JSX transpiled via Babel in-browser (`<script type="text/babel">`)
- TinyBase for local-first data persistence (localStorage via persister-browser)
- All app code lives inline in index.html — no build step needed
- For VibesOS patterns/hooks reference, see `~/Ai-App-Projects/VibesOS/skills/vibes/SKILL.md`

## PAPI Project Management
This project uses PAPI for planning/building/reviewing. MCP server configured in `.mcp.json`.
Follow the standard cycle: `plan -> build_list -> build_execute -> implement -> review -> release`

## Judging Criteria (optimize for ALL)
| Criterion | Weight | Our Angle |
|-----------|--------|-----------|
| Design | 1-5 | Phone-first, empathetic, warm — not a government form |
| Functionality | 1-5 | Real calculations, interactive chart, actionable output |
| Market viability | 1-5 | No competitor exists. Revenue paths: premium states, employer tools |
| Creativity | 1-5 | Reveals hidden truth — the "oh shit" cliff chart moment |
| Technical sophistication | 1-5 | Local-first privacy, state rule engine, artifact generation |

## Architecture Decisions
- **Local-first (TinyBase):** Privacy is a feature. Target users won't trust cloud apps with financial data.
- **State-scoped demo:** Ohio primary, CA and TX stretch goals. State benefit rules are complex — better to nail 1 state than half-ass 3.
- **Phone-first:** Target users are mobile-primary. Design for 375px first, desktop second.
- **Actionable output:** The shareable manager brief differentiates this from a calculator. It's a tool, not just information.

## Scope Guard (5-day hackathon)
**In scope:** Benefit calculator, cliff chart, manager brief, 2-3 states, deploy
**Out of scope:** User accounts, data persistence across devices, real-time benefit API integration, all 50 states, PDF export (screenshot-friendly is sufficient)

## Key Files
- `index.html` — THE app. Single-file React+TinyBase+Tailwind. All code inline.
- `PRODUCT_BRIEF.md` — Full hackathon context, persona, architecture, success criteria
