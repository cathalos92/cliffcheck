/**
 * tax.test.ts — state income tax (OH HB 96 2025, flat 2.75% above $26,050).
 *
 * 1:1 conversion of the inline validateDemoScenario console.assert specs
 * (Case 10) from the v1 single-file build. No new cases.
 */
import { describe, it, expect } from 'vitest';
import { calcStateIncomeTax } from '@/lib/engine';

describe('OH state tax (HB 96 flat 2.75%)', () => {
  it('OH state tax at $44k should be $494 ((44000-26050)*0.0275)', () => {
    const ohTaxAt44k = calcStateIncomeTax(44000, { stateCode: 'OH' });
    expect(ohTaxAt44k).toBe(494);
  });

  it('OH state tax at $70k should be $1,209 ((70000-26050)*0.0275)', () => {
    const ohTaxAt70k = calcStateIncomeTax(70000, { stateCode: 'OH' });
    expect(ohTaxAt70k).toBe(1209);
  });

  it('OH state tax below $26,050 should be 0', () => {
    const ohTaxBelowFloor = calcStateIncomeTax(20000, { stateCode: 'OH' });
    expect(ohTaxBelowFloor).toBe(0);
  });
});

describe('non-OH state tax (unmodelled → 0)', () => {
  it('TX has no state income tax → should be 0', () => {
    const txTaxAt70k = calcStateIncomeTax(70000, { stateCode: 'TX' });
    expect(txTaxAt70k).toBe(0);
  });

  it('NC not yet modelled → should be 0', () => {
    const ncTaxAt70k = calcStateIncomeTax(70000, { stateCode: 'NC' });
    expect(ncTaxAt70k).toBe(0);
  });

  it('MI not yet modelled → should be 0', () => {
    const miTaxAt70k = calcStateIncomeTax(70000, { stateCode: 'MI' });
    expect(miTaxAt70k).toBe(0);
  });
});
