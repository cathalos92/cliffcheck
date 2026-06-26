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
export { getStateSources } from './provenance';
export { getHeroScenarios } from './scenarios';

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
