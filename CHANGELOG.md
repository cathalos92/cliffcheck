# Changelog

## v0.14.0-feat-cycle-14-core — 2026-06-26

- 6a40f10 chore(security): untrack .mcp.json (contains DB credentials)

## v0.13.0 — 2026-05-09T20:36:11.028Z

- 5f8f829 Merge pull request #12 from cathalos92/feat/task-85
- 3ca3dae Merge pull request #11 from cathalos92/feat/task-80
- 400cdf0 feat(task-85): Add "Should the second adult work?" scenario mode
- 192f5fc feat(task-80): Advanced levers panel — HSA/401k pre-tax MAGI reduction for ACA and Medicaid
- f392d10 chore(task-81): post-build audit fix — mention match in manager brief copy
- d74542d feat(task-81): Extend total compensation toggle (task-74) to include employer 401k match as offsetting raise value
- bd17c6d chore: refresh hero stat to ~$10k post task-84 OH state tax
- df95ee2 chore(task-84): post-build audit fix — reorder OH state tax test case to Case 10
- 20632f7 feat(task-84): Model Ohio flat income tax (2.75% above $26,050) — accuracy improvement, not a cliff
- 649a3b9 docs: dogfood log — Cycle 12 post-release observations
- 74dc12b Merge feat/cycle-12-ui: chart legend + UX polish (task-88, task-89, task-51, task-53)
- 9e5b715 Merge feat/cycle-12-core: docs convention + data refresh checklist (task-42, task-43, task-40)
- 0223c55 Merge feat/cycle-12-benefit-engine: ACA Cost-Sharing Reductions + hero stat refresh (task-87)
- 0864d3e feat(task-40): Create annual data refresh checklist — doc tracking update cadence for SNAP, FPL, ACA SLCSP, HUD FMR, and state childcare rates
- b46a590 feat(task-43): Rename docs/ohio-benefit-rules.md to follow multi-state convention — prepare docs structure for Cycle 7 multi-state expansion
- e8db8f9 feat(task-42): Fix PRODUCT_BRIEF deployment URL reference — replace github.io reference with Cloudflare Workers URL
- b4f0ed8 feat(task-53): Localise childcare subsidy label per state — show the active state's actual program name (CCS/SCCAP/CDC/PFCC)
- 1d87ae0 feat(task-51): Add unsupported-state guard in state selector UI — prevent silent fallback to Ohio
- 869c672 feat(task-89): Decouple "household composition" from "has children" — support childless adults, and rename the single-parent/two-adult options
- 693f5b0 feat(task-88): Cliff chart legend and annotation overhaul — make line meanings, FPL thresholds, and cliff causes legible without explanation
- 86b8c47 chore: refresh hero stat to ~$9k post-CSR (task-87 follow-up)
- fa2e212 feat(task-87): Model ACA Cost Sharing Reductions (CSR) — Silver plan reduced cost-sharing below 250% FPL, including 94% AV below 200%
