# CliffCheck — Project Instructions

## What This Is
Benefits Cliff Navigator — a phone-first web app revealing the hidden math behind benefits cliffs. Built for VibeJam 2026 hackathon (5-day sprint ending April 25 midnight PST).

**Theme:** "Escape the permanent underclass"
**Track:** VibesOS (React + TinyBase + Tailwind, single HTML file)
**Deploy:** GitHub Pages — `https://cathalos92.github.io/cliffcheck/` (canonical public URL)
**Repo:** github.com/cathalos92/cliffcheck (open source, required by rules)

## Stack (VibesOS)
- React 19 with JSX + Babel runtime transpilation
- TinyBase for local-first data (financial data stays on-device)
- Tailwind CSS for styling
- Single HTML file architecture — no backend server
- Deploy to GitHub Pages (canonical) — single `index.html` served as a static asset
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



## Documentation Maintenance

Before creating a new doc, check `docs/INDEX.md` — it may already exist. When creating or archiving docs, update the index.

After implementing any code change, check if the change affects any documentation in `docs/`. If a doc describes behaviour, architecture, or file interactions that your change modified, update the doc to stay accurate.

When updating a doc, add or update a review header immediately below the title:

```
# Document Title
> Last reviewed: task-NNN — DD-MM-YYYY
```

Replace `task-NNN` with the task ID that triggered the update, and `DD-MM-YYYY` with today's date.

## Session Start

When a conversation starts — fresh window, new session, or after context compression — orient before doing anything else:

1. **Run `orient`** — single call that returns cycle number, task counts, in-progress/in-review tasks, strategy review cadence, trends, and recommended next action.
2. **Fix orphaned tasks silently** — check for feat/task-XXX branches that don't match board status. Fix and report after.
3. **Summarise:** "You're on Cycle N. X tasks to build, Y builds pending review." or "Cycle N is complete — ready for the next plan."
4. **Run `build_list` when picking a task** — `orient` shows counts only. `build_list` shows the full task list with handoffs.

**CRITICAL: Check task statuses before acting.**
- **In Review** = already built. Suggest `review_list` → `review_submit`. **NEVER re-build an In Review task.**
- **In Progress** = build started but not completed. Check the branch and existing changes before writing new code.
- **Backlog** = not started. But first check if a `feat/task-XXX` branch already exists with commits — fix it, don't rebuild.
- If all cycle tasks are Done, suggest `release` or next `plan`.

## Workflow Sequences

PAPI tools follow structured flows. The agent manages the cycle workflow automatically — the user should never need to type tool names or remember the flow. Handle the plumbing, surface the summaries.

### Cycle Workflow (auto-managed)

- **Run tools automatically** — don't ask the user to invoke MCP tools manually
- Before implementing: silently run `build_execute <task_id>` (start phase)
- After implementing: run `build_execute <task_id>` (complete phase) with report fields
- After build_execute completes: audit the branch changes for bugs, convention violations, and doc drift (see Post-Build Audit below)
- After audit with findings: *MUST* automatically run `review_submit` with verdict `request-changes` and a concise summary of the audit findings as the changes requested — the builder fixes these before the task goes to human review
- After audit clean: present for human review — "Ready for your review — approve or request changes?"
- User approves/requests changes → run `review_submit` behind the scenes

### The Cycle (main flow)

```
plan → build_list → build_execute → audit → review_list → review_submit → build_list
```

1. **plan** — Run at the start of each cycle to generate the cycle plan and populate the board.
   Next: `build_list` to see prioritised tasks.
2. **build_list** — View tasks ready for execution, ordered by priority.
   Next: `build_execute <task_id>` to start a task.
3. **build_execute** (start) — Creates a feature branch and marks the task In Progress. Returns the build handoff.
   Next: Implement the task, then `build_execute <task_id>` again with report fields to complete.
4. **build_execute** (complete) — Submits the build report, commits, and marks the task In Review.
   Next: Run the post-build audit automatically.
5. **Post-build audit** — Review branch changes for bugs, convention violations, and doc drift (see Post-Build Audit section below).
   Next: If findings exist, run `review_submit` with `request-changes` and the audit findings. If clean, proceed to `review_list`.
6. **review_list** — Shows tasks pending human review (handoff-review or build-acceptance).
   Next: `review_submit` to approve, accept, or request changes.
7. **review_submit** — Records the review verdict and updates task status.
   Next: `build_list` to view next build

### Strategy Review

```
strategy_review → strategy_change
```

- **strategy_review** — Analyses project health, velocity, and estimation accuracy.
  Next: `strategy_change` if the review recommends adjustments.
- **strategy_change** — Updates active decisions, north star, or project direction based on review findings.

### Detect Strategic Decisions in Conversation

Watch for: direction changes, architecture shifts, deprioritisation with reasoning, new principles, competitive positioning decisions.

When detected:
1. Flag it: "That sounds like a strategic direction change — should I run `strategy_change`?"
2. If confirmed, run `strategy_change` immediately.
3. If mid-build, finish the current task first.

### Idea Capture

```
idea → (picked up by next plan)
```

- **idea** — Captures a new task idea and writes it to the backlog.
  Next: The next `plan` run will prioritise and schedule it.

### Project Bootstrap

```
setup → plan
```

- **setup** — Initialises the project in the database and scaffolds config files.
  Next: `plan` to run the first cycle planning session.

### Board Management

- **board_view** — Read-only view of all tasks on the board.
- **board_archive** — Removes completed/cancelled tasks from the board to an archive.
- **board_deprioritise** — Moves a task to a later phase.

### Quick Reference: Tool → Next Step

| Tool | Next Step |
|------|-----------|
| `setup` | `plan` |
| `plan` | `build_list` |
| `build_list` | `build_execute <task_id>` |
| `build_execute` (start) | Implement, then `build_execute` (complete) |
| `build_execute` (complete) | Post-build audit (automatic) |
| Audit (findings) | `review_submit` with `request-changes` |
| Audit (clean) | `review_list` |
| `review_list` | `review_submit` |
| `review_submit` (approve/accept) | `build_list` |
| `review_submit` (request-changes) | `build_execute` (redo) or `build_list` |
| `strategy_review` | `strategy_change` (if needed) |
| `idea` | Next `plan` picks it up |

## Post-Build Audit

After every `build_execute` (complete), audit the branch before presenting for human review. This catches bugs and convention violations early.

1. **Identify changed files:** Run `git diff origin/main --name-only` to find modified files. If no changes, report "No changes to audit" and skip.
2. **Review each changed file** for:
   - Logic errors, off-by-one mistakes, incorrect conditions
   - Unhandled edge cases (null, undefined, empty inputs)
   - Convention violations defined in this CLAUDE.md
   - Incorrect type narrowing or unsafe casts
3. **Documentation check:** If any `docs/` files describe behaviour that the change modified, flag as "Doc drift".
4. **Report:** For each issue: file path, severity (Bug/Convention/Doc drift), what's wrong, how to fix.
5. **If findings exist:** Run `review_submit` with `request-changes` and the findings. Fix before human review.
6. **If clean:** Present for human review — "Ready for your review — approve or request changes?"

## When to Start a New Conversation

Start a fresh window when:
- **After a release** — cycle is done, context is heavy. New window orients in seconds via `orient`.
- **After 3+ tasks built** — accumulated file reads, diffs, and discussions bloat context. Quality degrades.
- **Switching modes** — going from building to planning, or from strategy review to building. Each mode benefits from clean context.
- **After context compression fires** — if you notice earlier messages are missing, the window is getting stale. Open fresh.

Stay in the same window when:
- Building sequential tasks in a batch (especially XS/S tasks)
- Mid-task and not yet complete
- Having a strategic discussion that informs the next action

**Rule of thumb:** If you've been in the same window for 30+ minutes or 3+ tasks, it's time for a fresh one.

## Housekeeping — Fix Orphaned Tasks

On session start, silently check for and fix:
1. **Orphaned branches:** `git branch | grep feat/task` — cross-reference with board status. Fix by merging or flagging.
2. **In Review tasks with no PR:** If branch is already merged to main, the review_submit step was missed.
3. **Stale In Progress:** Branch has no recent commits — flag it.
4. **Config mismatches:** `.mcp.json` has DATABASE_URL but PAPI_ADAPTER is still `md` — flag it.

**Do this automatically and silently.** Report what you found and fixed.

## Plumbing Is Autonomous

Board status updates, branch cleanup, orphaned task fixes, commit/PR/merge for housekeeping — these are mechanical plumbing. **Do them end-to-end without stopping to ask.** Report after the fact.

## Context Compression Recovery

When the system compresses prior messages, immediately:
1. **Run `orient`** — single call for cycle state
2. Check your todo list for in-progress work
3. Run housekeeping checks
4. **NEVER re-build a task that is already In Review or Done.**
5. Continue where you left off — don't restart or re-plan

## Branching & PR Convention

- **XS/S tasks in the same cycle and module:** Group on shared branch. One PR, one merge.
- **M/L tasks or different modules:** Own branch per task. Isolated PRs.
- **Dependent tasks (any size):** When a task's BUILD HANDOFF lists a `DEPENDS ON` task from the same cycle, `build_execute` automatically reuses the upstream task's branch so commits stack for a single PR. Do not create a separate branch manually.
- **Commit per task within grouped branches** — traceable git history.
- **Never use `build_execute` with `light=true` on shared branches.** Light mode commits directly to the current branch without creating a PR. When a shared branch is squash-merged, those commits are collapsed — any CLAUDE.md or documentation changes are stripped. Use light mode only on isolated single-task branches where no squash-merge will occur.

## Quick Work vs PAPI Work

PAPI is for planned work. Quick fixes — just do them. No need for plan or build_execute.

**After completing quick/ad-hoc work** (bug fixes, config changes, small improvements done outside the cycle), call `ad_hoc` to record it. This creates a Done task + build report so the work appears in cycle history and metrics. Don't skip this — unrecorded work is invisible work.

## Data Integrity

- **Use MCP tools for all project data operations.** DB is the source of truth when using the pg adapter.
- Do NOT read `.papi/` files for context — use MCP tools.
- `.papi/` files may be stale when using pg adapter. This is expected.
- **`board_edit` never updates the `cycle` field.** When moving a task into or out of a cycle, always run a SQL update alongside `board_edit`:
  - Adding to current cycle: `UPDATE cycle_tasks SET cycle = <N> WHERE display_id = '<task-id>';`
  - Removing from cycle (backlog): `UPDATE cycle_tasks SET cycle = null WHERE display_id = '<task-id>';`

## Code Before Claims — No Assumptions

**Before making any claim about how the codebase works, read the relevant file first.**

This includes:
- How a feature is implemented ("it works like X") → read the source
- Whether something exists ("there's no baseline migration") → check the directory
- Whether a flow is broken or working → trace it in code
- What a user would experience → check the actual page/component

Do NOT rely on memory, prior conversation, or inference. Read first, then answer.
If the answer requires checking 2-3 files, check them all before responding.

## Process Rules

These rules come from 80+ cycles of dogfooding. They prevent the most common sources of wasted time and rework.

### Building
- **Verify before claiming done.** Hit the endpoint, check the rendered output, confirm the data round-trips. Never say "should work" — prove it works.
- **Preview frontend changes.** After any UI/styling build, provide the localhost URL so the user can visually review. Don't make them ask for it.
- **Debug one change at a time.** When fixing issues, make one change, verify it, then move on. Don't stack multiple untested fixes.
- **Test the write-read roundtrip.** Every data write path must have a verified read path. If you write to DB, confirm the read query returns what was written. This is the #1 source of silent failures.
- **Test after every build.** Run the project's test suite after implementing. Suggest follow-up tasks from learnings when meaningful.
- **Build patiently.** Validate each phase against the last. Don't rush through implementation — test through the UI, not just the API.

### Security
- **Audit before widening access.** Before any build that adds endpoints, modifies auth/RLS, introduces new user types, or changes access controls — review the security implications first. Fix findings before shipping.
- **Flag access-widening changes.** If a build touches auth, RLS policies, API keys, or user-facing access, note "Security surface reviewed" in the build report's `discovered_issues` or `architecture_notes`.
- **Never ship secrets.** Do not commit .env files, API keys, or credentials. Check `.gitignore` covers sensitive files before pushing.
- **Telemetry opt-out.** PAPI collects anonymous usage data (tool name, duration, project ID). To disable, add `"PAPI_TELEMETRY": "off"` to the `env` block in your `.mcp.json`.

### Planning & Scope
- **NEVER run `plan` more than once per cycle.** Adjust the cycle with `board_deprioritise` or `idea` instead.
- **NEVER skip cycles.** Complete and release the current cycle before running the next `plan`.
- **Only build tasks assigned to the current cycle.** Use `build_list` — it filters to current-cycle tasks with handoffs.
- **Don't ask premature questions.** If the project is in early cycles, don't ask about deployment accounts, hosting providers, OAuth setup, or commercial features. Focus on building core functionality first.
- **Split large ideas.** If an idea has 3+ concerns, submit it as 2-3 separate ideas so the planner creates properly scoped tasks — not kitchen-sink handoffs.
- **Auto-release completed cycles.** When all cycle tasks are Done and reviews accepted, run `release` immediately. Forgetting causes cycle number drift and merge conflicts in the next session.

### Communication
- **Show task names, not just IDs.** When summarising board state or reconciliation, include task names — e.g. "task-42: Add supplier form" not just "task-42".
- **Surface the next command.** After each step, tell the user what comes next. Commands should be surfaced, not memorised.

### Stage Readiness
- **Access-widening stages require auth/security phases.** Before declaring a stage complete, check if it widens who can access the product (e.g. Alpha Distribution, Alpha Cohort). If so, auth hardening and security review must be completed first — not discovered after the fact.
- **Pattern:** Audit access surface → fix vulnerabilities → then widen access. Never ship access-widening without a security phase.

## Design System

`.impeccable.md` at the project root is the design brain for all UI work. Read it before any frontend task. It defines:
- Colour tokens (warm stone/amber palette, chart zone colours)
- Typography rules (hierarchy, dollar formatting, number display)
- Component patterns (input fields, cliff alert card, manager brief card, CTA buttons)
- Anti-patterns checklist (non-negotiable before marking any UI task done)
- The "Oh Shit" test — the quality bar for the cliff chart output

## Code Style Conventions

- All app code lives inline in `index.html`. No separate `.js`, `.ts`, `.jsx`, or `.tsx` files. CDN URLs only — no local imports.
- React 19 functional components with hooks only. No class components.
- JSX transpiles in-browser via Babel standalone in a `<script type="text/babel">` block.
- Components: PascalCase. Event handlers: `handle` prefix. Derived values: `calc` prefix. Pure helpers: camelCase verbs.
- Benefit calculation logic as pure functions: `calcSnap()`, `calcMedicaid()`, `calcACAPremium()`, `calcSection8()`, `calcChildcareSubsidy()`, aggregated by `calcEffectiveTakeHome()`.
- State-specific rule tables namespaced as object literals: `OH.snapThreshold`, `CA.medicaidLimit`, etc.

## VibesOS Stack Conventions

- CDN sources only — pin major versions. React 19, TinyBase latest, Tailwind Play CDN, Chart.js, Babel standalone.
- No service workers, web workers, or WASM. Keep vanilla for trivial static hosting on GitHub Pages.
- Do NOT add `package.json`, a build script, or a bundler. Single-file is a hard VibeJam track rule.

## TinyBase Conventions

- Single store instance, created once at init, passed via React context.
- Persist via `createLocalPersister(store, 'cliffcheck-v1')`. Call `startAutoLoad()` then `startAutoSave()` at mount.
- Data model: `profile` table with one row (`current`) — state, familySize, currentIncome, offeredIncome, benefit flags. Results never persisted — recalculate from profile on every render.
- Use TinyBase React hooks (`useCell`, `useRow`, `useValues`) in components. Never read raw store during render.

## Tailwind Conventions

- Phone-first: base styles target 375px. Use `md:` only for tablet/desktop enhancements.
- Scale values only — no arbitrary `w-[347px]` unless necessary.
- Warm, empathetic palette. Stone/amber primary; red/amber for cliff danger zones, green for safe zones. Not a government form — no cold blues or dense grey tables.
- Generous line-height, clear hierarchy. Touch targets >= 44px. Full-width buttons on mobile.

## Benefit Calculation Conventions

- All income values in **annual dollars**. Convert to monthly for display only.
- Phase-outs as continuous functions — not binary on/off. Produces smooth cliff chart.
- Chart range: $0 to $120k in $1k increments (121 data points).
- Each state module exposes: `getEffectiveTakeHome({ state, familySize, annualIncome })` returning `{ grossWages, snapValue, medicaidValue, acaCost, section8Value, childcareValue, totalEffective }`.
- Dollar amounts as integers. No floating-point in UI.
- Cite sources inline at top of each state module: `// SNAP limits: USDA FY2026`.

## What NOT To Do

- Do not add a build step, bundler, or `package.json`.
- Do not add a backend server, API route, or database call.
- Do not use `localStorage`/`sessionStorage` directly — always via TinyBase persister.
- Do not add user auth, accounts, or cloud sync.
- Do not add chart libraries beyond Chart.js.

## Dogfood Logging

After each `release`, append a dogfood entry capturing observations from the cycle.
Call the adapter method with structured entries for each observation:

- **friction** — workflow pain points, confusing flows, things that broke or slowed you down
- **methodology** — what worked or didn't in the plan/build/review cycle
- **signal** — indicators of product-market fit, user value, or growth potential
- **commercial** — cost, pricing, or business model observations

This is autonomous plumbing — log observations after release without asking.

<!-- PAPI_ENRICHMENT_TIER_1 -->

## Batch Building (unlocked at cycle 6)

For cycles with multiple XS/S tasks, batch build them without stopping between each:
- Build all XS/S tasks first, then M/L tasks
- Group tasks touching the same module onto a shared branch where possible
- One commit per task for traceable history, even on shared branches
- After all tasks built, batch review them together

## Strategy Reviews

Every 5 cycles, PAPI offers a strategy review — a deep analysis of velocity, estimation accuracy, active decisions, and project direction.

- **Don't skip them.** They're where compounding value comes from.
- Strategy reviews run in their own session — don't mix with building.
- Reviews produce recommendations that feed into the next plan.
- If the review recommends AD changes, use `strategy_change` to apply them.

## Active Decision Lifecycle

Active Decisions (ADs) track architectural and product choices with confidence levels (LOW → MEDIUM → HIGH).

- Check ADs before making architectural choices — run `health` for the AD summary.
- ADs are for product/architecture choices only, not process preferences.
- When new evidence appears, update AD confidence via `strategy_change`.
- Supersede rather than overwrite — old decisions stay as history.
