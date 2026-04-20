# CliffCheck — Benefits Cliff Navigator

## Problem Statement
Millions of working-class Americans are trapped in benefits cliffs — income thresholds where a modest raise causes a disproportionate loss of government benefits (SNAP, Medicaid, Section 8, childcare subsidies). A $4,000 raise can cost $10,000+ in lost benefits. The math is deliberately hidden by fragmented benefit systems, and no consumer-facing tool exists to reveal it. This is the #1 mechanism that keeps the "permanent underclass" permanent.

## Solution
A phone-first web app that lets users input their family situation and current benefits, then visualizes exactly where the cliffs are — and what to do about them.

**Core flow:**
1. User enters: state, family size, current income, current benefits (SNAP/Medicaid/Section 8/childcare subsidy)
2. App calculates effective take-home (wages + benefits value) across the full income spectrum
3. Interactive chart reveals cliff points where total compensation drops
4. Actionable recommendations: "Don't accept. The next safe exit is $X. Here are 3 paths to get there."
5. Shareable one-page brief for manager conversations

## Demo Persona
**Keisha** — Warehouse worker in Ohio, two kids, makes $54k all-in after benefits. Offered promotion to $70k.
- Current effective take-home: $58k (wages + SNAP + childcare subsidy + Medicaid)
- After promotion: $64k wages but -$10k in lost benefits and new ACA premiums
- Net: she's worse off by $4k taking the raise
- Recommendation: negotiate to $82k+ (clears every cliff in OH), or use free state workforce program to upskill to $85k in 14 months

## Target Users
**Primary:** Working-class Americans navigating benefits cliffs — warehouse workers, retail staff, gig workers, single parents
**Secondary:** Social workers, benefits counselors, HR professionals advising employees

## Constraints
- **Stack:** VibesOS (React + TinyBase + Tailwind, single HTML file, no backend)
- **Privacy:** Local-first — sensitive financial data stays on-device (TinyBase). This is a trust advantage for the target audience.
- **Scope:** 2-3 US states for demo: Ohio (OH), California (CA), Texas (TX)
- **Timeline:** 5 days (April 20-25, 2026) — VibeJam hackathon
- **License:** Open source required

## Judging Criteria (1-5 each)
1. **Design** — Phone-first, accessible, empathetic. Not a government form. Warm, human UI.
2. **Functionality** — Real benefit calculations, interactive visualization, actionable output (manager brief)
3. **Market viability** — No consumer product does this. Clear path to revenue (premium states, employer partnerships, benefits counselor tools)
4. **Creativity** — Reveals hidden truth that affects millions. The "aha moment" when you see the cliff chart.
5. **Technical sophistication** — Local-first privacy model, benefit calculation engine, state-specific rule system, PDF/share artifact generation

## Data Sources
- State benefits eligibility thresholds (public, state websites)
- Federal poverty guidelines (HHS)
- SNAP income limits and benefit tables (USDA)
- Medicaid eligibility by state (CMS)
- ACA marketplace calculator logic
- Section 8 income limits (HUD)
- Childcare subsidy thresholds (state-specific)
- BLS wage data for career path recommendations

## Architecture
- **Frontend:** React (JSX + Babel) via VibesOS template
- **Data store:** TinyBase (local-first, on-device)
- **Styling:** Tailwind CSS
- **Benefit engine:** Pure JS calculation module per state (OH, CA, TX)
- **Visualization:** Chart library (lightweight, embeddable — Chart.js or similar via CDN)
- **Output:** Shareable artifact (downloadable one-pager / screenshot-friendly summary)
- **Deploy:** Cloudflare Workers via VibesOS deploy pipeline

## Key Differentiators
- **Nobody has built this consumer-facing.** Government tools show individual program eligibility, not aggregate effective income.
- **Local-first = trust.** Target users are justifiably wary of sharing financial data with apps.
- **Actionable, not informational.** Don't just show the cliff — show the path around it with the manager brief.
- **Visceral demo.** The cliff chart is an "oh shit" moment. Judges will sit up.

## Success Criteria (Hackathon)
- [ ] Working demo with at least Ohio state calculations
- [ ] Interactive cliff visualization chart
- [ ] Keisha demo persona flows end-to-end
- [ ] Shareable manager brief artifact
- [ ] Deployed and accessible via URL
- [ ] Phone-first responsive design
- [ ] Second state (CA or TX) calculations
