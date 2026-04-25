# VibeJam 2026 — Rules Compliance Gap Analysis
> Last reviewed: task-56 — 25-04-2026

**Status:** Findings draft — pending owner triage. **DO NOT** auto-create follow-up fix tasks. Human decides which become P0 fixes.

## Framing correction

The "rules" for VibeJam 2026 are the **5 judging criteria** — Design, Functionality, Market viability, Creativity, Technical sophistication. The owner restated these as the canonical rule set in `PRODUCT_BRIEF.md` (L53–58) and `CLAUDE.md` (L30–37). There is no separate hidden rule book to fetch.

What this means for compliance vs. scoring:
- **Compliance gates** (binary PASS/FAIL): the submission must be (a) open-source on a public repo, (b) on the VibesOS stack — single-file React + TinyBase + Tailwind, no build step, CDN-only, (c) reachable by judges, (d) submitted within the timeline (Apr 20–25, 2026).
- **Scoring** (1–5 per criterion): handled by **task-57** (judging scorecard). That is where build-effort should be focused — not on compliance theatre. Build TOWARDS the 5 criteria.

This audit covers (a)–(d) only. Scoring optimisation is task-57's job.

---

## Compliance gates

| # | Gate | Status | Evidence | Fix needed |
|---|---|---|---|---|
| 1 | **Reachable by judges** | ⚠️ **PARTIAL** | Workers URL `cliffcheck.cliffcheck.workers.dev` is behind a Cloudflare Access login wall (302 → CF Access login). GitHub Pages mirror `cathalos92.github.io/cliffcheck/` returns 200 publicly. App IS reachable, just not on the Workers URL. | Pick the URL strategy (see Decision below). |
| 2 | **Open-source — LICENSE in repo root** | ❌ **FAIL** | No `LICENSE` file at repo root. Public on GitHub but no licence = ambiguous open-source status. | Add `LICENSE` (MIT). |
| 3 | **Open-source — README in repo root** | ❌ **FAIL** | No `README.md` at repo root. | Create `README.md` covering: 1-line tagline, live URL(s), repo URL, demo scenario, local-run, AI-assistance disclosure, licence reference. |
| 4 | **Single-file HTML constraint** (CLAUDE.md L322 — "hard VibeJam track rule") | ✅ **PASS** | Repo root has only `index.html`. No `.js`/`.ts`/`.tsx`/`.jsx` files; no `package.json`, no bundler config. | None. |
| 5 | **No build step / CDN-only imports** | ✅ **PASS** | All deps loaded via `unpkg`, `jsdelivr`, `esm.sh` in `index.html` head. | None. |
| 6 | **VibesOS stack — React 19 + TinyBase + Tailwind** | ✅ **PASS** | All three loaded via importmap and CDN (verified in `index.html:9–22`). | None. |
| 7 | **Cloudflare Workers deploy** (CLAUDE.md L7 — track rule) | ⚠️ **PARTIAL** | `wrangler.toml` configured, Worker exists. Currently access-gated (see gate 1). Track rule says "Cloudflare Workers" — GitHub Pages alone may not satisfy track compliance. | Tied to gate 1. |
| 8 | **Repo publicly accessible** | ✅ **PASS** | `gh repo view cathalos92/cliffcheck --json visibility` → `PUBLIC`. | None. |
| 9 | **Submission within timeline** (Apr 20–25, 2026) | ✅ **ON TRACK** | Today is 2026-04-25. Repo has commits within the window. | Submit before midnight PST. |

---

## Decision needed: URL strategy

Three options for resolving gates 1 + 7:

- **A) Submit both URLs in README** — Cloudflare Workers (track-required) + GitHub Pages (judge-accessible mirror). Belt and braces. **Recommended.**
- **B) Submit only GitHub Pages.** Risk: VibesOS track may strictly require Cloudflare Workers — could fail track compliance.
- **C) Disable Cloudflare Access on the Worker, submit only the Workers URL.** Cleanest single canonical URL. Requires a dashboard click in Cloudflare Zero Trust → Access → Applications.

**Recommendation: A** (zero risk, two minutes to write into the README).

---

## Recommended fix order

1. **Add `LICENSE`** (MIT). ~5 min.
2. **Add `README.md`** — tagline, BOTH URLs, repo URL, demo scenario, local-run, AI-assistance disclosure, licence reference. ~20 min.
3. **(Optional) Disable Cloudflare Access on the Worker** if you want a single canonical URL. ~5 min in dashboard.

After these three, all compliance gates are PASS or PARTIAL-acceptable. Remaining build effort goes to task-57 — score-lifting work against the 5 judging criteria.

## Out-of-scope items discovered

- Code quality findings: defer to task-55 (PAPI codebase audit)
- Security findings (XSS, secrets, SRI/CSP): defer to task-58 (security audit)
- Judging-criteria scoring + score-lift levers: **task-57** — this is where the real submission-quality work lives

## Owner decision needed

1. **URL strategy:** A, B, or C above?
2. **Fix order:** Want me to add LICENSE + README now (option A baked in), or wait?
