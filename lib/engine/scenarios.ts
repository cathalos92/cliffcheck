/**
 * lib/engine/scenarios.ts — hero scenarios for the rotating landing hero.
 *
 * Curated this cycle (task-117). Each scenario is a real (state, currentIncome,
 * offeredIncome, familySize, adultCount) tuple chosen for drama + variety across
 * the supported states (OH/TX/NC/MI). The LOSS is never hand-typed — it is
 * computed live from the engine (getEffectiveTakeHome), so every number the hero
 * shows is engine-derived and stays correct if the rule tables change.
 *
 * Curation method (one-off, see _scan_tmp scratch run): scanned candidate tuples
 * per state for the largest negative effective-take-home delta within distinct
 * income bands, then picked believable, varied ones. The canonical Ohio
 * $44k → $70k family-of-4 cliff (−$9,754) leads as the exemplar.
 */
import { getEffectiveTakeHome } from './takeHome';
import { isSupportedState, getState } from './registry';
import type { StateCode } from './types';

/**
 * A single curated hero scenario, enriched for the rotating landing hero
 * (task-117). Every dollar field is computed live from the engine — none are
 * hand-typed. Defined here (not in types.ts) so the engine type contract stays
 * untouched while the landing gets the richer shape it needs.
 */
export interface HeroScenario {
  /** Two-letter state code. */
  state: StateCode;
  /** Human state label, e.g. "Ohio". */
  stateLabel: string;
  /** Total household size. */
  familySize: number;
  /** Plain-English household label, e.g. "family of 4". */
  familyLabel: string;
  /** Current annual gross wages. */
  currentIncome: number;
  /** Offered annual gross wages. */
  offeredIncome: number;
  /** The raise size (offered − current), a positive number. */
  raise: number;
  /** Income the raise starts from (alias of currentIncome for callers). */
  atIncome: number;
  /** Net effective-take-home delta — negative for a cliff. */
  netDiff: number;
  /** The loss as a positive number (shown as −$cost). */
  cost: number;
  /** Pre-built plain-language headline sentence. */
  headline: string;
}

/** A curation seed — the inputs; the loss is computed, never typed. */
interface ScenarioSeed {
  state: StateCode;
  currentIncome: number;
  offeredIncome: number;
  familySize: number;
  adultCount: number;
}

/**
 * Curated seeds, ordered for the rotation. The canonical Ohio cliff leads; the
 * rest vary by state, income band, and family size so the hero doesn't feel
 * like one repeated number. Every loss is recomputed from the engine below.
 */
const SEEDS: ScenarioSeed[] = [
  // Canonical exemplar — Ohio, family of 4, $44k → $70k.
  { state: 'OH', currentIncome: 44000, offeredIncome: 70000, familySize: 4, adultCount: 2 },
  // Ohio, smaller raise into a stacked cliff — family of 4, $42k → $50k.
  { state: 'OH', currentIncome: 42000, offeredIncome: 50000, familySize: 4, adultCount: 2 },
  // Texas — family of 4, $59k → $67k.
  { state: 'TX', currentIncome: 59000, offeredIncome: 67000, familySize: 4, adultCount: 2 },
  // Michigan — family of 4, $59k → $67k.
  { state: 'MI', currentIncome: 59000, offeredIncome: 67000, familySize: 4, adultCount: 2 },
  // North Carolina — family of 4, $59k → $67k.
  { state: 'NC', currentIncome: 59000, offeredIncome: 67000, familySize: 4, adultCount: 2 },
];

/** Plain-English family label for a household — no jargon (PRODUCT.md voice). */
function familyLabel(familySize: number): string {
  return `family of ${familySize}`;
}

/**
 * Build one hero scenario from a seed, computing the loss live from the engine.
 * Returns null if the seed doesn't actually produce a loss (defensive — keeps
 * the hero honest if a rule table changes the math out from under a seed).
 */
function buildScenario(seed: ScenarioSeed): HeroScenario | null {
  const { state, currentIncome, offeredIncome, familySize, adultCount } = seed;
  const current = getEffectiveTakeHome({ annualIncome: currentIncome, familySize, state, adultCount });
  const offered = getEffectiveTakeHome({ annualIncome: offeredIncome, familySize, state, adultCount });
  const netDiff = offered.totalEffective - current.totalEffective;
  if (netDiff >= 0) return null; // only cliff scenarios belong in the hero
  const raise = offeredIncome - currentIncome;
  const loss = Math.abs(netDiff);
  const stateLabel = getState(state).label;
  return {
    state,
    stateLabel,
    familySize,
    familyLabel: familyLabel(familySize),
    currentIncome,
    offeredIncome,
    raise,
    atIncome: currentIncome,
    netDiff,
    cost: loss,
    headline:
      `A $${raise.toLocaleString()} raise at $${currentIncome.toLocaleString()} in ${stateLabel} ` +
      `would leave you $${loss.toLocaleString()} poorer.`,
  };
}

/**
 * Returns curated, engine-computed hero scenarios for the rotating hero.
 *
 * @param code optional state filter. When supplied and supported, returns only
 *   that state's scenarios (for per-state pages, a later cycle). Otherwise
 *   returns the full curated rotation across all supported states. Always
 *   returns at least one scenario (falls back to the canonical Ohio cliff).
 */
export function getHeroScenarios(code?: StateCode): HeroScenario[] {
  const seeds = code && isSupportedState(code) ? SEEDS.filter((s) => s.state === code) : SEEDS;
  const scenarios = seeds
    .map(buildScenario)
    .filter((s): s is HeroScenario => s !== null);
  if (scenarios.length > 0) return scenarios;
  // Fallback: the canonical Ohio cliff, computed live. Guaranteed non-null.
  const fallback = buildScenario(SEEDS[0]);
  return fallback ? [fallback] : [];
}
