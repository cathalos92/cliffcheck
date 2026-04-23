# CliffCheck — Benefits Cliff Navigator

> Last reviewed: Cycle 7 — 23-04-2026

## Problem Statement
Millions of working-class Americans are trapped in benefits cliffs — income thresholds where a modest raise causes a disproportionate loss of government benefits (SNAP, Medicaid, Section 8, childcare subsidies). A $4,000 raise can cost $24,000+ in lost benefits. The math is deliberately hidden by fragmented benefit systems, and no consumer-facing tool exists to reveal it. This is the #1 mechanism that keeps the "permanent underclass" permanent.

## Solution
A phone-first web app that lets users input their family situation and current benefits, then visualizes exactly where the cliffs are — and what to do about them.

**Core flow:**
1. User enters: state, family size, adult count, current income, current benefits (SNAP/Medicaid/Section 8/childcare subsidy)
2. Real-time sliders update the cliff chart as income changes
3. Interactive chart reveals cliff points where total compensation drops
4. Safe exit income displayed as hero output with plain-English verdict sentence
5. Shareable manager brief for salary negotiation conversations

## Demo Scenario
**Ohio warehouse worker** — two-adult household, two children, $44k wages. Offered promotion to $70k.
- Current effective take-home: ~$70.6k (wages $44k + SNAP $2.2k + Medicaid proxy $4.5k + PFCC childcare $19.9k)
- After promotion: ~$65.1k effective — loses SNAP, Medicaid, PFCC childcare; incurs ACA premiums
- Net: $26k raise leaves them ~$5.5k worse off in effective take-home
- Safe exit: ~$79k (first income where effective exceeds current + $2k buffer)
- The $44k→$48k range is the sharpest danger zone — PFCC childcare phase-out dominates the cliff shape

## Target Users
**Primary:** Working-class Americans earning $40k–$80k navigating benefits cliffs — warehouse workers, retail staff, gig workers, single parents. Mobile-primary, financially stressed, justifiably wary of cloud apps with financial data.
**Secondary:** Social workers, benefits counselors, HR professionals advising employees — need a credible, shareable tool to explain cliff math to workers and management.

## Constraints
- **Stack:** VibesOS (React + TinyBase + Tailwind, single HTML file, no backend)
- **Privacy:** Local-first — sensitive financial data stays on-device (TinyBase). This is a trust advantage for the target audience.
- **Scope:** Ohio complete. TX next, then CA, FL, NY and others in post-hackathon cycles.
- **Timeline:** April 20-25, 2026 — VibeJam hackathon
- **License:** Open source required

## What's Been Built (Cycle 4 — April 2026)
- **Ohio benefit engine** — SNAP, Medicaid (expansion), ACA premium tax credits, Section 8 HCV (voucher holder and non-holder), PFCC childcare (enrolled and non-enrolled). Pure JS, sources cited, validated against demo scenario.
- **Phone-first input form** — TinyBase-persisted profile: state, family size, adult count, income sliders, benefit toggles
- **Cliff chart** — Chart.js, $0–$120K at $1K increments. Real-time slider interaction. Per-income-point tooltips with full benefit breakdown. Cliff alert with breakdown detail.
- **Safe exit hero** — Elevated above the fold. Plain-English verdict sentence ("Your $10k raise makes you $27k poorer").
- **Manager brief** — Copy-to-clipboard: current effective, offered effective, safe-exit target, negotiation path.
- **Source references** — Collapsible links to 6 Ohio government sources.
- **Deploy** — Cloudflare Workers via VibesOS pipeline.

## What's Remaining Before Submission
- Demo mode (pre-loaded scenario for instant judge evaluation)
- Texas state module (second state proves architecture generalizability)
- UI dedup (remove duplicate breakdown from verdict card)
- Visual polish pass (.impeccable.md anti-patterns check)
- Submission package (deploy verification, README, VibeJam form, optional video)

## Judging Criteria (1-5 each)
1. **Design** — Phone-first, accessible, empathetic. Warm stone/amber palette. Not a government form.
2. **Functionality** — Real FY2026 benefit calculations, real-time interactive cliff chart, actionable safe-exit output
3. **Market viability** — No consumer product does this. Revenue paths: premium states, employer tools, HR integrations, social worker licensing
4. **Creativity** — Reveals the hidden truth that a $4k raise can cost $24k+. The "oh shit" cliff chart moment.
5. **Technical sophistication** — Local-first privacy model, state rule engine, source-verified data, real-time slider interaction

## Key Differentiators
- **Nobody has built this consumer-facing.** Government tools show individual program eligibility, not aggregate effective income.
- **Local-first = trust.** Target users are justifiably wary of sharing financial data with apps.
- **Actionable, not informational.** Don't just show the cliff — show the path around it with the manager brief.
- **Visceral output.** The cliff chart is an "oh shit" moment. The drop is real and measured.

## Data Sources
- SNAP income limits and benefit tables (USDA FY2026)
- Medicaid eligibility — Ohio expansion (CMS)
- ACA marketplace premium tax credit logic (Healthcare.gov)
- Section 8 / HCV payment standards (HUD)
- PFCC childcare subsidy thresholds (Ohio ODJFS)
- Federal poverty guidelines (HHS FY2026)

## Architecture
- **Frontend:** React 19 (JSX + Babel in-browser transpilation)
- **Data store:** TinyBase (local-first, persisted to localStorage)
- **Styling:** Tailwind CSS (Play CDN)
- **Benefit engine:** Pure JS state modules namespaced by state (OH, TX, CA...)
- **Visualization:** Chart.js via CDN
- **Deploy:** Cloudflare Workers via VibesOS pipeline

## Live URL
**https://cliffcheck.cliffcheck.workers.dev/**

## Success Criteria (Hackathon)
- [x] Working Ohio benefit engine — SNAP, Medicaid, ACA, Section 8, PFCC childcare
- [x] Interactive cliff chart with real-time sliders
- [x] Demo scenario flows end-to-end showing ~$5.5k effective loss on a $26k raise
- [x] Shareable manager brief with copy-to-clipboard
- [x] Safe exit hero number above the fold
- [x] Deployed and accessible via URL
- [x] Phone-first responsive design
- [ ] Demo mode (pre-loaded scenario)
- [ ] Texas state calculations
- [ ] Visual polish pass
- [ ] Submission package
