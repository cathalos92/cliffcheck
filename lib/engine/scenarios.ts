/**
 * lib/engine/scenarios.ts — hero scenarios for the rotating landing hero.
 *
 * STUB this cycle. Real curation (running the engine over candidate
 * (currentIncome, offeredIncome, familySize) tuples per state and selecting the
 * dramatic ones) lands in a later cycle. For now this returns a minimal valid
 * array — computed from the engine so the numbers are never hand-typed — so the
 * barrel and downstream types compile.
 */
import { getEffectiveTakeHome } from './takeHome';
import { isSupportedState } from './registry';
import type { HeroScenario, StateCode } from './types';

/**
 * Returns curated hero scenarios. STUB: emits a single canonical Ohio scenario
 * (the $44k → $70k family-of-4 cliff) computed live from the engine. `code`
 * narrows to that state when supported; otherwise falls back to the canonical OH.
 */
export function getHeroScenarios(code?: StateCode): HeroScenario[] {
  const state: StateCode = code && isSupportedState(code) ? code : 'OH';
  const familySize = 4;
  const currentIncome = 44000;
  const offeredIncome = 70000;

  const current = getEffectiveTakeHome({ annualIncome: currentIncome, familySize, state, adultCount: 2 });
  const offered = getEffectiveTakeHome({ annualIncome: offeredIncome, familySize, state, adultCount: 2 });
  const netDiff = offered.totalEffective - current.totalEffective;

  return [
    {
      state,
      familySize,
      currentIncome,
      offeredIncome,
      netDiff,
      headline: `A $${(offeredIncome - currentIncome).toLocaleString()} raise at $${currentIncome.toLocaleString()} could cost you $${Math.abs(netDiff).toLocaleString()}.`,
    },
  ];
}
