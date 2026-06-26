/**
 * lib/engine/tax.ts — state income tax. Extracted verbatim from calcStateIncomeTax.
 */
import { getState } from './registry';
import type { CalcOpts } from './types';

// ── State Income Tax ───────────────────────────────────────────────────
// Per-state flat-tax model, gated on STATES.XX.incomeTax presence. States
// without an incomeTax block return 0 (TX has no income tax; NC/MI use
// bracketed structures not yet modelled). Currently only OH is wired up.
// Modelled on gross wages as a proxy for state AGI (user input doesn't
// capture itemised deductions). Returned as a positive owed amount; the
// orchestrator subtracts from totalEffective alongside ACA premium cost.
export function calcStateIncomeTax(annualIncome: number, opts?: CalcOpts): number {
  const { stateCode = 'OH' } = opts || {};
  const state = getState(stateCode);
  const tax = state.incomeTax;
  if (!tax) return 0;
  if (annualIncome <= tax.noTaxFloor) return 0;
  return Math.round((annualIncome - tax.noTaxFloor) * tax.flatRate);
}
