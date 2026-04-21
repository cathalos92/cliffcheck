# CliffCheck — Benefits Cliff Navigator

> A phone-first web app that exposes the hidden math trapping working-class Americans in a permanent underclass — and gives them the exact income target needed to escape it.

**→ [Try it live](https://cathalos92.github.io/cliffcheck/)**

Built for [VibeJam 2026](https://jam.pieter.com) · Ohio · Open source

---

## The Problem

A $10,000 raise can make you $27,000 poorer.

That's not a typo. When you earn too much for SNAP, Medicaid, and childcare subsidies — but not enough to actually replace that lost value — you're worse off taking the raise. This is called a **benefits cliff**, and it's the #1 hidden mechanism keeping working-class families trapped.

Nobody tells you this. There's no government tool that shows your *total* effective income including benefits. No calculator that reveals the cliff before you say yes to a promotion. CliffCheck is that tool.

---

## See It In Action — The Jamie Scenario

**Jamie** is a warehouse worker in Ohio. Single parent, one child. Currently earning $44,000/year.

Her employer offers a promotion to $54,000/year. A $10,000 raise. She says yes.

Here's what actually happens:

| | Current ($44k) | After offer ($54k) |
|---|---|---|
| Wages | $44,000 | $54,000 |
| SNAP | +$2,184 | $0 (over limit) |
| Medicaid | +$4,500 | $0 (over limit → buys ACA) |
| ACA premiums | $0 | −$3,024 (new cost) |
| PFCC childcare | +$19,920 | $0 (over entry threshold) |
| **Total effective** | **~$70,600** | **~$51,000** |

**Taking the $10,000 raise costs Jamie $19,600/year in total effective income.**

The PFCC childcare cliff alone — losing $19,920 in subsidized childcare because her income crossed $47,850 — wipes out the entire raise and then some.

**CliffCheck tells Jamie:** her safe exit income is **$86,000/year** — the first point where she permanently clears all Ohio benefit cliffs and actually comes out ahead.

*Click "See the cliff in action" on the app to load Jamie's scenario instantly.*

---

## What CliffCheck Shows You

- **The cliff chart** — effective take-home across $0–$120k income range. You see the drop before you accept the offer.
- **The verdict** — "Your $10k raise makes you $27k poorer" in plain English, instantly.
- **Your safe exit** — the exact income target where you clear every cliff.
- **The manager brief** — a copy-paste script for your salary negotiation conversation.
- **The shareable card** — screenshot-ready output to show the math to anyone.

All calculated locally. No account. No data leaves your device.

---

## Why This Matters

- **Nobody has built this consumer-facing.** Government benefit tools show individual program eligibility — not your aggregate effective income across all programs simultaneously.
- **Local-first = trust.** Target users are justifiably wary of financial apps. Data stays on-device via TinyBase.
- **Actionable, not informational.** CliffCheck doesn't just show the cliff — it shows the path around it.
- **The numbers are real.** Every calculation is sourced against FY2026 federal and Ohio program rules, with citations.

---

## Tech Stack

Built on the [VibesOS](https://github.com/pieter-ai/vibeos) hackathon stack:

- **React 19** — JSX transpiled in-browser via Babel standalone (no build step)
- **TinyBase** — local-first state persistence via localStorage
- **Tailwind CSS** — Play CDN, phone-first (375px base)
- **Chart.js** — cliff chart visualization
- **Single `index.html`** — the entire app. No bundler, no server, no dependencies to install.

Deployed via **Cloudflare Workers**.

---

## Data Sources (Ohio, FY2026)

All benefit calculations are based on publicly available program rules:

| Program | Source |
|---------|--------|
| SNAP eligibility & allotments | [USDA FNS](https://www.fns.usda.gov/snap/recipient/eligibility) |
| Medicaid expansion (Ohio) | [medicaid.gov](https://www.medicaid.gov/state-overviews/stateprofile.html?state=Ohio) |
| ACA premium tax credits | [thefinancebuff.com](https://thefinancebuff.com/aca-premium-tax-credit-percentages.html) |
| Federal Poverty Level 2026 | [HHS/ASPE](https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines) |
| PFCC childcare subsidy (Ohio) | [Ohio DCY](https://childrenandyouth.ohio.gov/for-providers/resources/pfcc) |
| Section 8 / HCV | [HUD](https://www.hud.gov/helping-americans/housing-choice-vouchers-tenants) |

---

## Run It Locally

No install required. Open `index.html` in any modern browser.

```bash
git clone https://github.com/cathalos92/cliffcheck.git
cd cliffcheck
open index.html   # or just double-click it
```

That's it. No `npm install`. No build step. No server.

---

## Roadmap

- **Ohio** — complete. All major benefit programs modeled and source-verified.
- **Texas** — next. Different Medicaid rules (no expansion), similar SNAP.
- **California, Florida, New York** — planned post-hackathon.
- **All-states engine** — stretch goal: federal rules extracted as shared base, state modules for variations.

---

## License

MIT — open source as required by VibeJam rules.

---

*Built in 5 days for [VibeJam 2026](https://jam.pieter.com) · Theme: "Escape the permanent underclass"*
