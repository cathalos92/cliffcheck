# Changelog

## v0.7.1 — 2026-04-25

Real Cycle 7 release. v0.7.0 tagged before the two shared cycle branches were merged, so it shipped only task-35. v0.7.1 brings in the rest.

- feat(task-37): Add Texas (TX) state module — non-expansion Medicaid, BBCE 165% FPL, Dallas SLCSP, TWC childcare, HUD FMR
- feat(task-38): Add North Carolina (NC) state module — recent expansion (Dec 2023), no BBCE, Raleigh SLCSP, NC SCCAP childcare, HUD FMR
- feat(task-39): Add Michigan (MI) state module — Healthy Michigan expansion, BBCE 200% FPL, Detroit SLCSP, MDHHS childcare, HUD FMR
- feat(task-36): Add ProfileForm state selector — dynamic from supported STATES, persisted via TinyBase
- feat(task-34): Section 8 sliding-formula header comment correction
- engine: extend isOnMedicaid with parent vs childless-adult branching for non-expansion states
- tests: 4-way cross-state regression matrix in the validation IIFE

## v0.7.0 — 2026-04-24T13:56:19.941Z

- cc93272 Merge pull request #7 from cathalos92/feat/task-35
- 46df3ae feat(task-35): Refactor OH module to FED + STATES pattern — extract federal-uniform rules into shared FED namespace, parameterise calc functions with stateCode
- dfdda3b docs: add C7 design critique + register in doc index
- d38f3ef fix: align demo scenario across brief and engine; rename validateKeisha
