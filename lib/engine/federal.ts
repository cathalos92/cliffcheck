/**
 * lib/engine/federal.ts — federal benefit-rule constants (the `FED` table).
 *
 * Extracted verbatim from _archive/index.html. Gov-source citation comments are
 * preserved as-is — they become the provenance source-of-truth in a later cycle.
 */

export const FED = {
  fpl: {
    base2026: 15960,
    increment2026: 5680,
  },
  snap: {
    // Federal SNAP rules — USDA FNS FY2026.
    // Sources:
    //  • Standard/excess-shelter/EID/net limits: 7 CFR §273.9 + USDA COLA notice FY2026.
    //    https://www.fns.usda.gov/snap/recipient/eligibility (retrieved 2026-04-25)
    //  • Excess shelter deduction cap: $712/mo for households without elderly/disabled
    //    members in 48 contiguous states + DC (FY2026 COLA).
    //  • Net income test: 100% FPL applies to all households (BBCE waives gross test
    //    + asset test, but never the net test). Confirmed against USDA BBCE policy notes.
    netLimitFPL: 1.0,
    stdDeduction: [0, 209, 209, 209, 228, 247, 266],
    eidRate: 0.2,
    excessShelterCap: 712, // $/mo, 48 states + DC, FY2026
    // Shelter cost proxy when user input doesn't capture rent/mortgage explicitly.
    // HUD affordability threshold = 30% of gross. Voucher holders' tenant share is
    // already capped at 30% by Section 8 design — net excess shelter ≈ 0 for them.
    shelterProxyShare: 0.3,
    benefitReductionRate: 0.3,
    maxMonthlyBenefit: [0, 298, 549, 785, 994, 1183, 1419],
  },
  aca: {
    eligibleFPLMin: 1.0,
    cliffFPL: 4.0,
    pctTable: [
      [1.0, 0.021],
      [1.33, 0.0314],
      [1.5, 0.0419],
      [2.0, 0.066],
      [2.5, 0.0844],
      [3.0, 0.0996],
      [4.0, 0.0996],
    ] as ReadonlyArray<readonly [number, number]>,
    // CSR: Cost-Sharing Reduction (Silver plan AV uplift below 250% FPL).
    // Source: HHS Notice of Benefit and Payment Parameters 2026, 45 CFR 156.420.
    // CSR reduces deductible/copay/OOP-max — NOT premium. Modelled as an
    // *effective value* (annual avoided cost-sharing per enrollee), separate
    // from the premium tax credit (calcACAPremium).
    // Per-enrollee dollar values are KFF national averages (Silver plan
    // expected annual cost-sharing at base 70% AV minus expected cost-sharing
    // at the CSR-uplifted AV tier). Simplification: per-enrollee × familySize;
    // does not vary by age, region, or actual utilization. Eligibility:
    // <250% FPL AND on the marketplace (not Medicaid, not employer-covered).
    csr: {
      tiers: [
        { maxFPL: 1.5, av: 0.94, perEnrolleeAnnual: 1400 },
        { maxFPL: 2.0, av: 0.87, perEnrolleeAnnual: 900 },
        { maxFPL: 2.5, av: 0.73, perEnrolleeAnnual: 200 },
      ],
    },
  },
  medicaid: {
    // Dollar proxy for the value of free Medicaid coverage (per adult per year).
    // Represents the marketplace premium cost a family avoids by having Medicaid.
    adultAnnualValueProxy: 2250, // $/adult/year
  },
  // Federal Earned Income Tax Credit — Tax Year 2025 (filed in 2026).
  // Source: IRS Rev. Proc. 2024-40 (annual inflation adjustments).
  // https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit/eitc-tables
  // Retrieved 2026-04-25.
  // Three-region piecewise: phase-in (linear), plateau (flat at maxCredit), phase-out (linear).
  // Phase-out start is higher for MFJ filers (married-filing-jointly) than single by a fixed delta.
  // Keys = number of qualifying children (0, 1, 2, 3+ → clamp at 3).
  eitc: {
    0: { phaseInRate: 0.0765, earnedAmt: 8490, maxCredit: 649, phaseOutStartSingle: 10620, phaseOutStartMFJ: 17730, phaseOutRate: 0.0765 },
    1: { phaseInRate: 0.34, earnedAmt: 12730, maxCredit: 4328, phaseOutStartSingle: 23350, phaseOutStartMFJ: 30470, phaseOutRate: 0.1598 },
    2: { phaseInRate: 0.4, earnedAmt: 17880, maxCredit: 7152, phaseOutStartSingle: 23350, phaseOutStartMFJ: 30470, phaseOutRate: 0.2106 },
    3: { phaseInRate: 0.45, earnedAmt: 17880, maxCredit: 8046, phaseOutStartSingle: 23350, phaseOutStartMFJ: 30470, phaseOutRate: 0.2106 },
  } as Record<number, { phaseInRate: number; earnedAmt: number; maxCredit: number; phaseOutStartSingle: number; phaseOutStartMFJ: number; phaseOutRate: number }>,
} as const;
