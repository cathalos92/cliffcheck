# CliffCheck — Benefits Cliff Navigator

> See the hidden math that keeps families stuck. Find out if a raise actually makes you poorer.

**Live app:** **https://cathalos92.github.io/cliffcheck/** (phone-first — open on mobile for the intended experience)

A working-class American earning $44k can be offered a $26k raise and end up **$5.5k poorer** in effective take-home — once SNAP, Medicaid, ACA premium tax credits, Section 8, and childcare subsidies phase out together. The math is deliberately hidden by fragmented benefit systems. CliffCheck reveals it.

Built for **VibeJam 2026** (April 20–25, 2026) — VibesOS track.

---

## What it does

1. Pick your state (Ohio, Texas, North Carolina, Michigan supported).
2. Enter family size, adult count, current annual income, and which benefits you receive.
3. Move the income slider — watch the cliff chart redraw in real time. Cliffs (ranges where a raise costs more than it earns) are highlighted; safe-exit income is shown above the fold.
4. Generate a **manager brief** — a copy-pasteable script for negotiating either a raise large enough to clear the cliff, or staying put.

All calculation runs locally in your browser. **No financial data leaves your device.** The TinyBase persister stores your profile in browser localStorage under a single namespaced key (`cliffcheck-v1`); nothing is sent anywhere.

## Why it matters

| Criterion | What CliffCheck does |
|---|---|
| **Design** | Phone-first, warm stone/amber palette, empathetic copy — not a government form |
| **Functionality** | Real FY2026 benefit calculations across 4 states, real-time interactive cliff chart, actionable manager brief |
| **Market viability** | No consumer-facing tool does this. Government tools show single-program eligibility, never aggregate effective income |
| **Creativity** | Reveals the "oh shit" moment — a $4k raise can cost $24k+ in lost benefits. Visceral, measured, hidden in plain sight |
| **Technical sophistication** | Local-first privacy (data never leaves device), pluggable state-rule engine, single-file VibesOS app |

## Demo scenario

**Ohio warehouse worker, family of 4, currently earning $44k.** Offered a promotion to $70k.

- **Current** effective take-home: ~$70.6k (wages $44k + SNAP $2.2k + Medicaid proxy $4.5k + PFCC childcare subsidy $19.9k)
- **After promotion**: ~$65.1k effective — loses SNAP, Medicaid, PFCC childcare; incurs ACA premiums
- **Net**: $26k raise leaves them **$5.5k worse off**
- **Safe exit**: ~$79k — first income where effective take-home exceeds current + a $2k buffer

Open the app, click **"Try the demo"**, watch the chart.

## Why this scales

CliffCheck solves a problem that touches 50+ million Americans — but the revenue paths require no mass-consumer scale to be commercially viable.

**Employer benefits-counselling tool.** HR teams and benefits brokers routinely handle raise and promotion conversations where cliff math is invisible but decisive. A worker turning down a $20k offer costs a company far more in recruitment. CliffCheck gives HR an evidence-based tool to structure compensation conversations — showing the cliff, the safe-exit number, and the negotiation path. The wedge: mid-sized benefits-broker firms (100+ employer clients) who already advise on benefits utilization. No cold-start problem — they already have the relationships and the pain.

**Social worker / benefits-counselor pro license.** Benefits counselors and social workers run dozens of these conversations monthly, currently with spreadsheets or nothing. A pro tier with multi-client saves, caseload history, and exportable reports addresses their exact workflow. BenefitsCheckUp Pro charges $25–80/mo per seat for less. The local-first architecture is a trust differentiator here too — case managers cannot upload client financial data to cloud services under many agency data-handling policies.

Both paths leverage the same advantage: **CliffCheck works on-device, with no accounts, no uploads, no vendor lock-in.** That's not a feature for consumer apps — it's a compliance requirement for institutional ones.

## Stack — VibesOS

- **Single `index.html`** — no build step, no bundler, no `package.json`
- **React 19** (JSX transpiled in-browser via Babel standalone)
- **TinyBase 8** for local-first reactive data + browser persister
- **Tailwind CSS** (Play CDN) — phone-first styling
- **Chart.js** — cliff visualisation, $0–$120k at $1k increments

All dependencies loaded from CDN (`unpkg`, `jsdelivr`, `esm.sh`). Open `index.html` in any modern browser to run locally — no `npm install`, no setup. The repo also contains a `wrangler.toml` for the Cloudflare Workers track-stack deploy (the public Worker URL is access-gated; GitHub Pages is the primary judging URL).

## Run locally

```bash
git clone https://github.com/cathalos92/cliffcheck.git
cd cliffcheck
open index.html  # or just double-click it
```

That's it. The app runs entirely in the browser.

## AI assistance disclosure

CliffCheck was built with [Claude Code](https://claude.com/claude-code) (Anthropic) as the primary development tool, using the **PAPI** project-management methodology (planning → building → reviewing in cycles). Cycle history, architecture decisions, and dogfood observations are tracked in [`CLAUDE.md`](CLAUDE.md), [`PRODUCT_BRIEF.md`](PRODUCT_BRIEF.md), and [`DOGFOOD_LOG.md`](DOGFOOD_LOG.md).

The benefit calculation rules (SNAP, Medicaid, ACA, Section 8, PFCC childcare) were sourced from the cited federal and state government documents and verified against published FY2026 thresholds — see the source links in `index.html` and [`docs/ohio-benefit-rules.md`](docs/ohio-benefit-rules.md).

## Repo

- **Live app:** https://cathalos92.github.io/cliffcheck/
- **Source:** https://github.com/cathalos92/cliffcheck
- **Licence:** MIT — see [`LICENSE`](LICENSE)

## Data sources

- SNAP income limits and benefit tables — USDA FNS FY2026
- Medicaid eligibility — state-specific (Ohio, Texas, North Carolina, Michigan)
- ACA marketplace premium tax credit logic — Healthcare.gov / IRC §36B
- Section 8 / HCV payment standards — HUD
- Childcare subsidy thresholds — state DHS rule books
- Federal poverty guidelines — HHS/ASPE FY2026

Citations are inline in the relevant calculation modules in `index.html`.
