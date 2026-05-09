# CliffCheck — Benefits Cliff Navigator

> Last reviewed: Cycle 9 strategy review — 25-04-2026

## Problem Statement
Millions of working-class Americans are trapped in benefits cliffs — income thresholds where a modest raise causes a disproportionate loss of government benefits (SNAP, Medicaid, Section 8, childcare subsidies). A $4,000 raise can cost $24,000+ in lost benefits. The math is deliberately hidden by fragmented benefit systems, and no consumer-facing tool exists to reveal it. This is the #1 mechanism that keeps the "permanent underclass" permanent.

## Solution
A phone-first web app that lets users input their family situation and current benefits, then visualizes exactly where the cliffs are — and what to do about them.

**Core flow:**
1. User enters: state (OH/TX/NC/MI), family size, adult count, current income, current benefits (SNAP/Medicaid/Section 8/childcare subsidy)
2. Real-time sliders update the cliff chart as income changes
3. Interactive chart reveals cliff points where total compensation drops
4. Safe exit income displayed as hero output with plain-English verdict sentence
5. Shareable manager brief for salary negotiation conversations

## Demo Scenario
**Ohio warehouse worker** — two-adult household, two children, $44k wages. Offered promotion to $70k.
- Current effective take-home: ~$74.4k (wages $44k + SNAP $2.2k + Medicaid proxy $4.5k + PFCC childcare $19.9k + federal EITC $4.3k − OH state tax $0.5k)
- After promotion: ~$63.9k effective — loses SNAP, Medicaid, PFCC childcare, and most of the EITC; incurs ACA premiums (partially offset by the cost-sharing reduction at 200–250% FPL); OH state tax bill rises to ~$1.2k
- Net: $26k raise leaves them ~$10.5k worse off in effective take-home
- Safe exit: ~$85k (first income where effective exceeds current + $2k buffer)
- The $44k→$48k range is the sharpest danger zone — PFCC childcare phase-out dominates the cliff shape

## Target Users
**Primary:** Working-class Americans earning $40k–$80k navigating benefits cliffs — warehouse workers, retail staff, gig workers, single parents. Mobile-primary, financially stressed, justifiably wary of cloud apps with financial data.
**Secondary:** Social workers, benefits counselors, HR professionals advising employees — need a credible, shareable tool to explain cliff math to workers and management.

## Constraints
- **Stack:** VibesOS (React + TinyBase + Tailwind, single HTML file, no backend)
- **Privacy:** Local-first — sensitive financial data stays on-device (TinyBase). This is a trust advantage for the target audience.
- **Scope:** OH, TX, NC, MI live. Additional states sequenced by audience size + cliff severity + primary-source data availability.
- **Timeline:** Submitted to VibeJam 2026 on 2026-04-25 (v0.9.0). Now in post-submission accuracy-hardening phase.
- **License:** MIT (open source, required by hackathon rules)

## What's Been Built (Through Cycle 9 — April 25 2026)
- **Multi-state benefit engine** — FED + STATES architecture. Four states live: Ohio, Texas, North Carolina, Michigan. Each covers SNAP (with state BBCE thresholds), Medicaid (expansion vs. non-expansion), ACA premium tax credits, Section 8 HCV, state childcare subsidy. Pure JS, sources cited inline, validation harness via IIFE on page load.
- **Phone-first input form** — TinyBase-persisted profile: state selector, family size, adult count, income sliders, benefit toggles
- **Cliff chart** — Chart.js, $0–$120K at $1K increments. Real-time slider interaction. Per-income-point tooltips with full benefit breakdown. Cliff alert with breakdown detail.
- **Safe exit hero** — Above the fold. Plain-English verdict sentence ("Your $26k raise makes you $5.5k poorer").
- **Manager brief** — Copy-to-clipboard 3-line negotiation brief.
- **Try the demo button** — One-click pre-loaded Ohio scenario for instant cliff visualization (task-72).
- **Source references** — Collapsible links to government sources per benefit per state.
- **Share-ready surface** — OG image (task-71), social meta tags, screenshot polish.
- **Audits shipped** — VibeJam rules compliance (task-56), security audit (task-58), PAPI codebase audit (task-55), judging-criteria scorecard (task-57).
- **Deploy** — GitHub Pages on `cliffcheck.com` (custom domain), v0.9.0 tagged.

## Known Gaps (post-submission carry-forward to C10+)
- **Accuracy fixes**: employer-coverage toggle (task-74), combined-household income labels (task-75), SNAP net-income gating (task-79), per-state childcare label (task-53), unsupported-state guard (task-51), full benefit-calc audit with primary sources (task-54).
- **Hygiene**: C8 codebase audit findings (task-62 through task-67), doc freshness headers (task-68).
- **Security**: SRI hashes on CDN scripts (task-69), CSP meta tag (task-70).
- **Infrastructure**: custom domain (task-77), tip jar / contact / suggestion footer (task-76).
- **Future expansion**: state EITC (task-41), data-refresh checklist (task-40), county-level SLCSP overrides (post-C10).

## Judging Criteria (1-5 each — VibeJam 2026)
1. **Design** — Phone-first, accessible, empathetic. Warm stone/amber palette. Not a government form.
2. **Functionality** — Real FY2026 benefit calculations, real-time interactive cliff chart, actionable safe-exit output, multi-state coverage.
3. **Market viability** — No consumer product does this. Revenue paths in README: premium-state licensing, employer/HR tooling.
4. **Creativity** — Reveals the hidden truth that a $4k raise can cost $24k+. The "oh shit" cliff chart moment.
5. **Technical sophistication** — Local-first privacy, FED/STATES rule engine, IIFE validation harness, source-verified data, real-time slider interaction.

## Key Differentiators
- **Nobody has built this consumer-facing.** Government tools (Atlanta Fed CLIFF) target workforce counselors, not workers.
- **Local-first = trust.** Target users are justifiably wary of sharing financial data with apps.
- **Actionable, not informational.** Don't just show the cliff — show the path around it with the manager brief.
- **Visceral output.** The cliff chart is an "oh shit" moment. The drop is real and measured against primary sources.

## Data Sources
- SNAP income limits and benefit tables (USDA FY2026)
- Medicaid eligibility per state (CMS, state Medicaid agencies)
- ACA marketplace premium tax credit logic (Healthcare.gov / IRS)
- Section 8 / HCV payment standards (HUD)
- State childcare subsidy programs: PFCC (OH/ODJFS), CCS (TX/Workforce Commission), SCCAP (NC/DHHS), CDC (MI/MDHHS)
- Federal poverty guidelines (HHS FY2026)

## Architecture
- **Frontend:** React 19 (JSX + Babel in-browser transpilation)
- **Data store:** TinyBase (local-first, persisted to localStorage)
- **Styling:** Tailwind CSS (Play CDN)
- **Benefit engine:** Pure JS — FED namespace for federal-uniform rules + STATES.XX namespaces for state-specific rules
- **Validation:** IIFE harness on page load (validateDemoScenario)
- **Visualization:** Chart.js via CDN
- **Deploy:** GitHub Pages (canonical), MIT licensed, open source on GitHub

## Live URL
**https://cliffcheck.com**

## Phase
Submitted to VibeJam 2026. Now in post-submission accuracy-hardening phase. See AD-7 for sequencing rationale.

## Success Criteria (Hackathon — DONE)
- [x] Working multi-state benefit engine — SNAP, Medicaid, ACA, Section 8, state childcare subsidies (OH/TX/NC/MI)
- [x] Interactive cliff chart with real-time sliders
- [x] Demo scenario flows end-to-end showing ~$5.5k effective loss on a $26k raise
- [x] Shareable manager brief with copy-to-clipboard
- [x] Safe exit hero number above the fold
- [x] Deployed and accessible via URL (GitHub Pages)
- [x] Phone-first responsive design
- [x] Demo mode (pre-loaded scenario)
- [x] Multi-state coverage (4 states live)
- [x] Visual polish pass (.impeccable.md anti-patterns)
- [x] Submission package (v0.9.0, README, OG image, social meta tags)
