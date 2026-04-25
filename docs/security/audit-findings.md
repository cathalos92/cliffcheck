# Security Audit — Public Open-Source Repo Sweep
> Last reviewed: task-58 — 25-04-2026

**Status:** Findings draft — pending owner triage. **DO NOT** auto-create follow-up fix tasks. Human decides.

**Scope:** Full repo + git history. Pre-submission clinical sweep before VibeJam 2026 judging — repo is already public on GitHub.

**Bottom line:** **Zero P0 security findings.** The "local-first privacy" claim — central to the Technical Sophistication score — is defensible. Two best-practice gaps (SRI, CSP) flagged below, neither breaks the app.

---

## Headline result

| Lens | Status |
|---|---|
| Secret exposure (current files) | ✅ Clean |
| Secret exposure (full git history) | ✅ Clean |
| XSS sinks (DOM injection, eval) | ✅ Clean |
| Copy-to-clipboard surface | ✅ Clean |
| localStorage / TinyBase persister scope | ✅ Clean — single namespaced key, profile data only |
| Demo persona PII | ✅ Clean — no real names, no PII |
| `.gitignore` coverage | ✅ Pass |
| `wrangler.toml` content | ✅ Pass — no inline secrets, no account_id |
| SRI hashes on CDN scripts | ⚠️ Missing (P1, not safely fixable pre-submission — see below) |
| CSP response headers / meta | ⚠️ Missing (P2, defence-in-depth only) |

---

## Detailed findings

### 1. Secrets — full repo + git history → ✅ CLEAN

- **Tracked files scan:** Pattern match for `sk-*`, `ghp_*`, `AKIA*`, `xox[bp]-*`, `AIza*`, `account_id=`, `api_key`, `secret=`, `token=`, `bearer` → **0 matches**.
- **Git history scan:** `git log --all -G '<secret patterns>'` across all branches and all commits → **0 matches**. No historical secret leak.
- **`.gitignore` coverage:** `.env`, `.env.local`, `.vscode/`, `.idea/`, `node_modules/`, `.papi/`, `.mcp.json`, `.wrangler/`, `.vibes/`, `.DS_Store`. ✅ Comprehensive.
- **`wrangler.toml`:** 5 lines — `name = "cliffcheck"`, `compatibility_date = "2025-01-01"`, `[assets] directory = "./"`. No inline `account_id`, no API token, no zone ID.

### 2. XSS surface — `index.html` → ✅ CLEAN

Pattern-searched for `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `document.write`, `eval(`, `new Function(`, `execCommand`. **All zero matches.** Every render path goes through React's escaped JSX. No raw HTML injection vector.

### 3. Copy-to-clipboard — `index.html:1288–1290` → ✅ CLEAN

```js
async function handleCopy() {
  await navigator.clipboard.writeText(briefText);
}
```
`navigator.clipboard.writeText` accepts plain text only — not a DOM-injection sink. `briefText` is constructed from typed user input plus calculated values, written as text to the user's clipboard. No XSS path.

### 4. localStorage / TinyBase persister — `index.html:1354–1357` → ✅ CLEAN

- Single persister key: **`cliffcheck-v1`** (one match in repo; namespaced).
- Lifecycle: `startAutoLoad({ profile: { current: DEFAULTS } }) → startAutoSave() → destroy()` on unmount.
- Stored data: `profile` table only — `state`, `familySize`, `adultCount`, `currentIncome`, `offeredIncome`, benefit-toggle flags. **No PII, no auth tokens, no third-party identifiers.**
- No raw `localStorage` / `sessionStorage` access — all goes through TinyBase persister, per CLAUDE.md L327 convention.
- **Local-first privacy claim is defensible.** ✅ Reinforces Technical Sophistication scoring.

### 5. Demo persona PII → ✅ CLEAN

Pattern-searched for `Keisha`, `Maya`, `cathal`, `cathalos92`, `@gmail`, `@protonmail`, `persona`. Only match: a code comment at `index.html:432` reading "Ohio warehouse worker: family of 4, current wages $44K, offered $70K." Generic, no PII. ✅

### 6. SRI (subresource integrity) — `index.html:9–22` → ⚠️ P1 — **DOCUMENT, DO NOT FIX**

CDN scripts loaded **without** `integrity="sha384-..."` attributes:
- `unpkg.com/@babel/standalone@7.26.0/babel.min.js`
- `cdn.jsdelivr.net/npm/@tailwindcss/browser@4`
- `cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js`
- `esm.sh/stable/react@19.2.4` (and `react-dom`, `tinybase`)

**Theoretical blast radius:** Compromised CDN → arbitrary code execution in every visitor's browser. Real-world risk on these CDNs is low but nonzero.

**Why not fix now:** `tailwindcss/browser@4` is unpinned at minor — adding SRI would lock to a snapshot that drifts on update. `esm.sh` resolves modules dynamically per request — SRI is impractical without major refactor. Adding SRI mid-submission risks breaking the live deploy.

**Recommendation:** Accept for hackathon. Post-hackathon: pin all CDN URLs to specific versions, generate SRI hashes via `curl <url> | openssl dgst -sha384 -binary | openssl base64 -A`, and add `integrity` + `crossorigin="anonymous"` per script. Track as a follow-up backlog idea AFTER owner approves.

### 7. CSP (Content Security Policy) → ⚠️ P2 — **DEFENCE-IN-DEPTH ONLY**

- `<head>` of `index.html` has **no** `<meta http-equiv="Content-Security-Policy">`.
- GitHub Pages response: no `content-security-policy` header (GitHub Pages doesn't set one by default).
- Cloudflare Workers route headers couldn't be inspected on the app response (auth-gated). `wrangler.toml` doesn't define a CSP either.

**Why low priority:** Without an XSS sink (per finding 2) there's no payload to constrain. CSP is belt-and-braces. Adding a workable CSP for an app that loads scripts from `unpkg`, `jsdelivr`, `esm.sh` is non-trivial and would risk breaking the deploy. Not worth doing pre-submission.

**Recommendation:** Defer post-hackathon. Same mechanic — track as backlog idea AFTER owner approves.

---

## Cross-references

- **Workers URL gating** (Cloudflare Access login wall on `cliffcheck.cliffcheck.workers.dev`) is already documented in [task-56 findings](../submission/rules-compliance.md#compliance-gates) row 1. Not duplicated here. URL strategy decision still pending.

## Out-of-scope items discovered

- Code quality (dead code, magic numbers, calc duplication): defer to **task-55** (PAPI codebase audit)
- Judging-criteria scoring: defer to **task-57** (scorecard)
- Penetration testing on live deploy: out of audit scope per handoff

## Owner decision needed

The audit is reassuring — no real holes. Two questions:

1. **Approve the doc?** No P0s; SRI/CSP are post-hackathon work.
2. **Convert SRI + CSP to backlog ideas now?** Or leave them as embedded recommendations in this doc until you've digested it?

Awaiting your call. No follow-up tasks created.
