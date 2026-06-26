/**
 * lib/engine/provenance.ts — source collection for the methodology page +
 * inline source chips.
 *
 * Minimal this cycle: the gov-source citations currently live in code comments
 * (not yet machine-readable Rule<Provenance> values — that's a later cycle).
 * collectSources/getStateSources return what's structurally available from the
 * state rule object today (program presence + label) without breaking callers.
 * Full citation population happens when rules are wrapped in Rule<Provenance>.
 */
import { getState, isSupportedState } from './registry';
import type { Source, StateCode } from './types';

/**
 * Walk a state's rule object and emit one Source per program present. URLs and
 * citations are intentionally left undefined this cycle (they live in comments
 * until the Rule<Provenance> wrap lands). Returns [] for unsupported states.
 */
export function collectSources(code: StateCode): Source[] {
  if (!isSupportedState(code)) return [];
  const state = getState(code);
  const sources: Source[] = [];

  if (state.snap) sources.push({ program: 'snap', label: 'SNAP (USDA FNS FY2026)' });
  if (state.medicaid) {
    sources.push({
      program: 'medicaid',
      label: `Medicaid (${state.medicaid.expanded ? 'expansion' : 'non-expansion'})`,
    });
  }
  if (state.aca) sources.push({ program: 'aca', label: 'ACA marketplace (SLCSP benchmark)' });
  if (state.childcare) {
    sources.push({ program: 'childcare', label: `Childcare subsidy (${state.childcare.subsidyName})` });
  }
  if (state.housing) sources.push({ program: 'housing', label: 'Section 8 / HCV (HUD FY2026)' });
  if (state.incomeTax) sources.push({ program: 'incomeTax', label: 'State income tax' });

  return sources;
}

/** Public alias used by the methodology page / source chips. */
export function getStateSources(code: StateCode): Source[] {
  return collectSources(code);
}
