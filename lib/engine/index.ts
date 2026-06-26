/**
 * lib/engine/index.ts — public barrel for the CliffCheck benefit engine.
 *
 * Pure, typed, framework-free. UI imports only from `@/lib/engine`.
 * Extracted from the v1 single-file build (_archive/index.html) — see
 * docs/replatform/PLAN.md §"Engine extraction".
 */

// Public API
export { getEffectiveTakeHome, getCliffData } from './takeHome';
export { getSupportedStates, isSupportedState } from './registry';
export { getStateSources, collectSources, isGovSource, SOURCE_URLS } from './provenance';
export { getHeroScenarios } from './scenarios';

// Per-program calc functions — exposed for the engine validation suite, which
// converts the inline console.assert specs that called these directly. Tests
// import only from this barrel.
export { calcFederalEITC } from './eitc';
export { calcACACSR } from './aca';
export { calcStateIncomeTax } from './tax';
export { FED } from './federal';

// Public types
export type {
  TakeHomeInput,
  TakeHomeBreakdown,
  Provenance,
  Rule,
  StateCode,
  StateRules,
  Source,
  HeroScenario,
} from './types';
