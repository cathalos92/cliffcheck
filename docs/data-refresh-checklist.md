# Annual Data Refresh Checklist
> Last reviewed: task-40 — 27-04-2026

Operational hygiene doc tracking when each benefit-rule data source needs to be refreshed in the engine, where the authoritative source lives, when the value was last captured, and which engine module consumes it. Without this, FY values silently drift between releases. AD-7 (accuracy-first credibility) requires this to be a routine, not an emergency.

## How to use this doc

1. Each row lists a data source, its annual update window, and an authoritative URL.
2. When the update window opens, read the source, capture the new value, and update the corresponding engine module file/section.
3. Update the **Last refreshed** column to the date you captured the new value.
4. Update the corresponding `// Source: ... Retrieved: YYYY-MM-DD` inline comment in `index.html`.
5. Bump the doc-freshness review header on `docs/state-rules/{state}.md` if state-specific values changed.
6. Run `index.html` in a browser with DevTools open and confirm the IIFE validation harness passes (`[CliffCheck] Demo PASSED` lines in console).

## Federal data sources

| Program | Update window | Authoritative URL | Last refreshed | Engine consumer |
|---|---|---|---|---|
| **Federal Poverty Guidelines (FPL)** | January (annual) | https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines | 2026-04-21 | `index.html` → `FED.fpl.base2026`, `FED.fpl.increment2026` |
| **SNAP** — max benefit, standard deduction, EID rate, excess shelter cap | October (USDA COLA, fiscal year start) | https://www.fns.usda.gov/snap/recipient/eligibility | 2026-04-21 | `index.html` → `FED.snap.*` (`maxMonthlyBenefit`, `stdDeduction`, `eidRate`, `excessShelterCap`, `shelterProxyShare`, `benefitReductionRate`, `netLimitFPL`) |
| **ACA Premium Tax Credit applicable percentages** | November (HHS NBPP final rule for following plan year) | https://thefinancebuff.com/aca-premium-tax-credit-percentages.html · https://www.congress.gov/crs-product/R48290 | 2026-04-21 | `index.html` → `FED.aca.pctTable`, `FED.aca.eligibleFPLMin`, `FED.aca.cliffFPL` |
| **ACA Cost-Sharing Reduction (CSR) AV tiers** | November (HHS NBPP final rule, 45 CFR 156.420) | https://www.federalregister.gov (search "Notice of Benefit and Payment Parameters") | 2026-04-26 (task-87) | `index.html` → `FED.aca.csr.tiers` |
| **HUD Fair Market Rents (FMR)** | October (federal fiscal year start) | https://www.huduser.gov/portal/datasets/fmr.html | 2026-04-21 | `index.html` → `STATES.{XX}.housing.paymentStandardMonthly` (per state) |
| **HUD Income Limits (50% AMI)** | April (mid-year HUD income limits release) | https://www.huduser.gov/portal/datasets/il.html | 2026-04-21 | `index.html` → `STATES.{XX}.housing.incomeLimitAnnual` (per state) |
| **Federal Earned Income Tax Credit (EITC)** | Late autumn (IRS Rev. Proc. for following tax year) | https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit/eitc-tables | 2026-04-25 (task-83) | `index.html` → `FED.eitc.{0,1,2,3}` |
| **Medicaid value proxy** | Annual (KFF marketplace cost-equivalent benchmarks) | https://www.kff.org/medicaid/ | 2026-04-21 | `index.html` → `FED.medicaid.adultAnnualValueProxy` |

## Per-state data sources

Each row covers a state-specific value that must be re-verified annually against the cited primary source. State agencies publish updates on different cadences — capture the actual update month in the **Update window** column.

### Ohio (OH)

| Program | Update window | Authoritative URL | Last refreshed | Engine consumer |
|---|---|---|---|---|
| Medicaid expansion FPL + child/CHIP FPL | January (state plan amendments tracked annually) | https://www.medicaid.gov/state-overviews/stateprofile.html?state=Ohio | 2026-04-21 | `STATES.OH.medicaid` |
| ACA SLCSP benchmark (Ohio, central/northeast representative) | November (open enrollment plan filings) | https://www.kff.org/interactive/subsidy-calculator/ | 2026-04-21 | `STATES.OH.aca.slcspMonthly` |
| PFCC childcare (entry/exit FPL, copay rate, market rate per child) | July (Ohio fiscal year, copay rate revisions) | https://childrenandyouth.ohio.gov/for-providers/resources/pfcc | 2026-04-21 | `STATES.OH.childcare` |
| Section 8 / HCV — Columbus MHA (CMHA) payment standard, 50% AMI | October (HUD FMR) + April (HUD income limits) | https://cmhanet.com | 2026-04-21 | `STATES.OH.housing` |

### Texas (TX)

| Program | Update window | Authoritative URL | Last refreshed | Engine consumer |
|---|---|---|---|---|
| Medicaid parent FPL + childless adult FPL (non-expansion) | January | https://www.kff.org/medicaid/state-indicator/medicaid-income-eligibility-limits/ | 2026-04-22 | `STATES.TX.medicaid` |
| ACA SLCSP benchmark (Dallas-Plano-Irving representative) | November | https://www.kff.org/interactive/subsidy-calculator/ | 2026-04-22 | `STATES.TX.aca.slcspMonthly` |
| CCS childcare (entry/exit FPL, copay rate, market rate per child) | September (Texas Workforce Commission fiscal year) | https://www.twc.texas.gov/programs/child-care | 2026-04-22 | `STATES.TX.childcare` |
| Section 8 / HCV — Dallas payment standard, 50% AMI | October + April | https://www.huduser.gov/portal/datasets/fmr.html | 2026-04-22 | `STATES.TX.housing` |

### North Carolina (NC)

| Program | Update window | Authoritative URL | Last refreshed | Engine consumer |
|---|---|---|---|---|
| Medicaid expansion FPL (post-Dec 2023) + child/CHIP FPL | January | https://medicaid.ncdhhs.gov/ · https://www.kff.org/medicaid/state-indicator/medicaid-income-eligibility-limits/ | 2026-04-22 | `STATES.NC.medicaid` |
| ACA SLCSP benchmark (Raleigh-Durham/Charlotte representative) | November | https://www.kff.org/interactive/subsidy-calculator/ | 2026-04-22 | `STATES.NC.aca.slcspMonthly` |
| SCCAP childcare (entry/exit FPL, copay rate, market rate per child) | July (NC DHHS DCDEE fiscal year) | https://ncchildcare.ncdhhs.gov/Home/Work-With-Parents/Financial-Assistance | 2026-04-22 | `STATES.NC.childcare` |
| Section 8 / HCV — Raleigh payment standard, 50% AMI | October + April | https://www.huduser.gov/portal/datasets/fmr.html | 2026-04-22 | `STATES.NC.housing` |

### Michigan (MI)

| Program | Update window | Authoritative URL | Last refreshed | Engine consumer |
|---|---|---|---|---|
| Medicaid (Healthy Michigan Plan) expansion FPL + MIChild FPL | January | https://www.michigan.gov/mdhhs/assistance-programs/medicaid | 2026-04-22 | `STATES.MI.medicaid` |
| ACA SLCSP benchmark (Detroit-Warren-Dearborn representative) | November | https://www.kff.org/interactive/subsidy-calculator/ | 2026-04-22 | `STATES.MI.aca.slcspMonthly` |
| MDHHS CDC scholarship (entry/exit FPL, copay rate, market rate per child) | October (MI fiscal year) | https://www.michigan.gov/mdhhs/assistance-programs/childcare | 2026-04-22 | `STATES.MI.childcare` |
| Section 8 / HCV — Detroit payment standard, 50% AMI | October + April | https://www.huduser.gov/portal/datasets/fmr.html | 2026-04-22 | `STATES.MI.housing` |

## State EITC top-ups

State EITC laws change less frequently than federal but DO change — track separately from federal EITC.

| State | Update window | Authoritative URL | Last refreshed | Engine consumer | Notes |
|---|---|---|---|---|---|
| **Federal EITC** | Late autumn (IRS Rev. Proc.) | https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit/eitc-tables | 2026-04-25 (task-83) | `FED.eitc` | TY2025 / Rev. Proc. 2024-40 |
| Ohio state EITC | Annual — Ohio DOT | https://tax.ohio.gov/individual/resources/credits-and-rebates | task-41 (Cycle 11) | (per task-41 implementation) | Confirm match-rate vs federal credit |
| Texas state EITC | n/a (no state income tax) | — | — | — | Texas has no state income tax — no state EITC by definition |
| North Carolina state EITC | Annual — NC DOR | https://www.ncdor.gov/ | task-41 (Cycle 11) | (per task-41 implementation) | Verify NC EITC repealed status (was 5% match, repealed 2014; check for re-instatement annually) |
| Michigan state EITC | Annual — MI Treasury | https://www.michigan.gov/treasury | task-41 (Cycle 11) | (per task-41 implementation) | MI EITC was raised to 30% match in 2023 — verify rate annually |

## Refresh routine

- **October sweep** — SNAP COLA, HUD FMR, MI childcare. Touch `FED.snap`, all `STATES.{XX}.housing`, `STATES.MI.childcare`. Re-run IIFE harness; if any of the 8 canonical scenarios moves outside its assertion range, the assertions need updating WITH justification (don't just widen the range).
- **November sweep** — ACA premium pct table, ACA CSR AV tiers, ACA SLCSP per state. Touch `FED.aca.pctTable`, `FED.aca.csr.tiers`, all `STATES.{XX}.aca.slcspMonthly`. Open enrollment plan filings drop in early November; KFF subsidy calculator updates by mid-month.
- **January sweep** — FPL guidelines, state Medicaid eligibility limits. Touch `FED.fpl`, all `STATES.{XX}.medicaid`. ASPE publishes the new poverty guidelines mid-January.
- **Spring sweep** — HUD income limits (April), state EITC matches (per state tax filings season). Touch `STATES.{XX}.housing.incomeLimitAnnual`, state EITC engine code (per task-41).
- **Summer sweep** — IRS EITC parameters (typically published in Rev. Proc. October–November but apply retroactively to the prior tax year), state-specific childcare program updates (varies). Touch `FED.eitc`, all `STATES.{XX}.childcare`.

## Refresh checklist template (copy this when running a sweep)

```
Sweep: [season] [year]
Date started: YYYY-MM-DD

[ ] Identify all rows with Update window = [this season]
[ ] For each row:
    [ ] Open the authoritative URL
    [ ] Capture the current value
    [ ] Diff against the engine module value
    [ ] If changed, update the engine module + inline comment + retrieval date
    [ ] Update this checklist's Last refreshed column
[ ] Update doc-freshness header on docs/state-rules/{state}.md for any state with changes
[ ] Run index.html locally with DevTools console open
[ ] Confirm all IIFE validation harness assertions pass
[ ] Commit with message: "data: {season} {year} refresh — {summary of changes}"
[ ] Tag a release if the changes materially shift the demo numbers
```

## Out of scope (deliberately)

- **Automation** — this is a manual checklist. Automating refreshes would require scraping authoritative URLs, which is brittle and adds infrastructure without proportional value at the current scale.
- **Per-county overrides** — ACA SLCSP, HUD FMR, and childcare market rates technically vary by county. Engine values are state representatives sourced from the largest metro area in each state. Per-county overrides are tracked separately (see `docs/research/all-states-findings.md`).
- **Native American / tribal program variants** — separate eligibility rules for AI/AN populations (zero-cost-sharing CSR, IHS interactions) are not modelled. Out of scope for the current 4-state cohort.
