/**
 * states.test.ts — per-state invariants, iterated over getSupportedStates().
 *
 * Converts the inline validateDemoScenario per-state console.assert specs
 * (Cases 4/6/7 for totalEffective bounds, Cases 4/6/7 + childless for Medicaid
 * expansion behaviour) into a single data-driven sweep, plus the getCliffData
 * 121-point invariant (chart range $0–$120k in $1k increments).
 *
 * Property: every supported state must have an EXPECTATIONS entry. Adding a
 * state to the registry without adding its expected bounds here fails the
 * sweep — so "add a state = add a file + a passing test".
 *
 * Medicaid expansion expectations mirror the IIFE: at $44k/family-of-4/2-adults
 * (~133% FPL) expansion states cover both adults (2 × $2,250 proxy = $4,500);
 * non-expansion states (parents above the low parentFPL ceiling) → Medicaid 0.
 */
import { describe, it, expect } from 'vitest';
import { getEffectiveTakeHome, getCliffData, getSupportedStates, FED } from '@/lib/engine';

const PROXY = FED.medicaid.adultAnnualValueProxy; // 2250

interface StateExpectation {
  expansion: boolean;
  // totalEffective bounds at $44k / family of 4 / 2 adults (exclusive, per IIFE).
  minTotal: number;
  maxTotal: number;
}

// Bounds lifted 1:1 from the inline IIFE per-state cases.
const EXPECTATIONS: Record<string, StateExpectation> = {
  // OH: current effective 72000–78000 (Case 1 used >= / <=; here treated as the
  // documented inclusive band, asserted with >=/<=).
  OH: { expansion: true, minTotal: 72000, maxTotal: 78000 },
  TX: { expansion: false, minTotal: 60000, maxTotal: 78000 },
  NC: { expansion: true, minTotal: 53000, maxTotal: 72000 },
  MI: { expansion: true, minTotal: 58000, maxTotal: 79000 },
};

const supported = getSupportedStates();

describe('Supported state registry', () => {
  it('every supported state has an EXPECTATIONS entry (add a state = add a test)', () => {
    for (const { code } of supported) {
      expect(EXPECTATIONS[code], `missing EXPECTATIONS for state ${code}`).toBeDefined();
    }
  });
});

describe.each(supported)('State invariants: $code ($label)', ({ code }) => {
  const exp = EXPECTATIONS[code];
  const breakdown = () => getEffectiveTakeHome({ annualIncome: 44000, familySize: 4, state: code, adultCount: 2 });

  it('totalEffective at $44k/4/2-adults within documented bounds', () => {
    const total = breakdown().totalEffective;
    expect(total).toBeGreaterThanOrEqual(exp.minTotal);
    expect(total).toBeLessThanOrEqual(exp.maxTotal);
  });

  it('Medicaid behaviour matches expansion status', () => {
    const medicaid = breakdown().medicaidValue;
    if (exp.expansion) {
      // Expansion state at ~133% FPL → both adults covered.
      expect(medicaid).toBe(2 * PROXY);
    } else {
      // Non-expansion: parents above low parentFPL ceiling → no Medicaid.
      expect(medicaid).toBe(0);
    }
  });

  it('getCliffData returns exactly 121 points ($0–$120k, $1k step)', () => {
    const points = getCliffData({ familySize: 4, state: code, adultCount: 2 });
    expect(points).toHaveLength(121);
    expect(points[0].income).toBe(0);
    expect(points[points.length - 1].income).toBe(120000);
  });
});
