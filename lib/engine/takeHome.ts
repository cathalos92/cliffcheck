/**
 * lib/engine/takeHome.ts — effective take-home orchestrator + cliff-chart data.
 *
 * Extracted verbatim from calcEffectiveTakeHome / getCliffChartData. The only
 * change is the PUBLIC signature: getEffectiveTakeHome takes an options object
 * (TakeHomeInput) instead of positional args, per the documented contract. The
 * internal calc flow — including MAGI threading and match-value handling — is
 * preserved exactly.
 */
import { calcSnap } from './snap';
import { calcACAPremium, calcACACSR } from './aca';
import { isOnMedicaid, calcMedicaidValue } from './medicaid';
import { calcChildcareSubsidy } from './childcare';
import { calcSection8Value } from './housing';
import { calcFederalEITC } from './eitc';
import { calcStateIncomeTax } from './tax';
import type { TakeHomeInput, TakeHomeBreakdown } from './types';

// ── Effective Take-Home ────────────────────────────────────────────────
// Returns breakdown + totalEffective for any income across all programs.
// employerHealthInsurance=true short-circuits ACA premium math entirely.
// matchRate (% of salary) is added to totalEffective only — not to annualIncome.
// hsaContribution + pretax401k reduce MAGI for ACA and Medicaid only.
// SNAP uses gross income (federal eligibility rule — NOT MAGI-based).
// EITC, Section 8, childcare, and state income tax also use gross wages.
// IRS MAGI for ACA/Medicaid: AGI = gross wages − pre-tax 401(k) − HSA contributions.
// Source: IRS Pub 969 (HSA), IRS Pub 525 (401k elective deferrals), healthcare.gov MAGI definition.
export function getEffectiveTakeHome(input: TakeHomeInput): TakeHomeBreakdown {
  const {
    annualIncome,
    familySize,
    state: stateCode = 'OH',
    pfccEnrolled = false,
    hasVoucher = false,
    adultCount = 2,
    employerHealthInsurance = false,
    matchRate = 0,
    hsaContribution = 0,
    pretax401k = 0,
  } = input;

  // MAGI used for ACA and Medicaid only — SNAP/EITC/Section8/childcare use gross.
  const magi = Math.max(
    0,
    annualIncome - Math.max(0, Number(hsaContribution) || 0) - Math.max(0, Number(pretax401k) || 0)
  );
  const calcOpts = { stateCode, pfccEnrolled, hasVoucher, adultCount };
  const onMedicaid = isOnMedicaid(magi, familySize, calcOpts);

  const snapValue = calcSnap(annualIncome, familySize, calcOpts);
  const medicaidValue = onMedicaid ? calcMedicaidValue(magi, familySize, calcOpts) : 0;
  const onMarketplace = !onMedicaid && !employerHealthInsurance;
  const acaCost = onMarketplace ? calcACAPremium(magi, familySize, calcOpts) : 0;
  const acaCSRValue = onMarketplace ? calcACACSR(magi, familySize) : 0;
  const section8Value = calcSection8Value(annualIncome, familySize, calcOpts);
  const childcareValue = calcChildcareSubsidy(annualIncome, familySize, calcOpts);
  const eitcValue = calcFederalEITC(annualIncome, familySize, calcOpts);
  const stateTaxOwed = calcStateIncomeTax(annualIncome, calcOpts);
  const matchPct = Math.max(0, Number(matchRate) || 0);
  const matchValue = Math.round((matchPct / 100) * annualIncome);
  const magiReduction = annualIncome - magi;

  const totalEffective = Math.round(
    annualIncome +
      snapValue +
      medicaidValue +
      section8Value +
      childcareValue +
      eitcValue +
      acaCSRValue +
      matchValue -
      acaCost -
      stateTaxOwed
  );

  return {
    grossWages: annualIncome,
    magi,
    magiReduction,
    snapValue,
    medicaidValue,
    acaCost,
    acaCSRValue,
    section8Value,
    childcareValue,
    eitcValue,
    stateTaxOwed,
    matchValue,
    totalEffective,
  };
}

// ── Cliff Chart Data ───────────────────────────────────────────────────
// 121 points: $0 to $120,000 in $1,000 increments.
export function getCliffData(
  input: Omit<TakeHomeInput, 'annualIncome'>
): Array<{ income: number } & TakeHomeBreakdown> {
  const points: Array<{ income: number } & TakeHomeBreakdown> = [];
  for (let income = 0; income <= 120000; income += 1000) {
    points.push({ income, ...getEffectiveTakeHome({ ...input, annualIncome: income }) });
  }
  return points;
}
