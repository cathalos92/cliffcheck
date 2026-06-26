/**
 * takeHome.test.ts — effective take-home orchestrator scenarios.
 *
 * 1:1 conversion of the inline validateDemoScenario console.assert specs from
 * the v1 single-file build: Case 1 (demo 2-adult), Case 2 (single-parent),
 * Cases 4/6/7 (TX/NC/MI totals), Case 5 (TX childless), Case 8 (cross-state
 * regression), Case 11a (401k match), Case 11b (HSA/401k MAGI reduction).
 *
 * The inline IIFE called the positional `calcEffectiveTakeHome(income, size, opts)`
 * with `opts.stateCode`. The extracted public API is `getEffectiveTakeHome` with
 * an options object using `state` (not `stateCode`). Inputs are mapped 1:1.
 */
import { describe, it, expect } from 'vitest';
import { getEffectiveTakeHome, FED } from '@/lib/engine';

// Canonical demo handles — recomputed per describe block as needed.
const demoCurrent = () => getEffectiveTakeHome({ annualIncome: 44000, familySize: 4, state: 'OH', adultCount: 2 });
const demoOffered = () => getEffectiveTakeHome({ annualIncome: 70000, familySize: 4, state: 'OH', adultCount: 2 });

describe('Demo scenario (2-adult, family of 4, OH)', () => {
  it('current effective in range $72,000–$78,000', () => {
    const current = demoCurrent();
    expect(current.totalEffective).toBeGreaterThanOrEqual(72000);
    expect(current.totalEffective).toBeLessThanOrEqual(78000);
  });

  it('netDiff ($44k→$70k) in range -$12,000 to -$6,000', () => {
    const netDiff = demoOffered().totalEffective - demoCurrent().totalEffective;
    expect(netDiff).toBeGreaterThanOrEqual(-12000);
    expect(netDiff).toBeLessThanOrEqual(-6000);
  });

  it('canonical $44k→$70k netDiff is exactly -9754', () => {
    const netDiff = demoOffered().totalEffective - demoCurrent().totalEffective;
    expect(netDiff).toBe(-9754);
  });

  it('EITC at $44K for 2-child MFJ is mid-phase-out ($3,000–$6,000)', () => {
    const current = demoCurrent();
    expect(current.eitcValue).toBeGreaterThan(3000);
    expect(current.eitcValue).toBeLessThan(6000);
  });

  it('safeExit (first income > current + $2,000) in range $80,000–$95,000', () => {
    const current = demoCurrent();
    let safeExit: number | null = null;
    for (let i = 70000; i <= 120000; i += 1000) {
      if (
        getEffectiveTakeHome({ annualIncome: i, familySize: 4, state: 'OH', adultCount: 2 }).totalEffective >
        current.totalEffective + 2000
      ) {
        safeExit = i;
        break;
      }
    }
    expect(safeExit).not.toBeNull();
    expect(safeExit!).toBeGreaterThanOrEqual(80000);
    expect(safeExit!).toBeLessThanOrEqual(95000);
  });
});

describe('Single-parent (1-adult, family of 4, OH)', () => {
  const spCurrent = () => getEffectiveTakeHome({ annualIncome: 44000, familySize: 4, state: 'OH', adultCount: 1 });

  it('Medicaid value should be 1-adult proxy', () => {
    expect(spCurrent().medicaidValue).toBe(FED.medicaid.adultAnnualValueProxy);
  });

  it('childcare should cover 3 children (> $20,000)', () => {
    expect(spCurrent().childcareValue).toBeGreaterThan(20000);
  });
});

describe('Texas (non-expansion, family of 4)', () => {
  const txCurrent = () => getEffectiveTakeHome({ annualIncome: 44000, familySize: 4, state: 'TX', adultCount: 2 });

  it('non-expansion: family at 133% FPL should have Medicaid=0', () => {
    expect(txCurrent().medicaidValue).toBe(0);
  });

  it('SNAP at $44K/4 in OH-comparable range ($1,500–$3,000)', () => {
    expect(txCurrent().snapValue).toBeGreaterThan(1500);
    expect(txCurrent().snapValue).toBeLessThan(3000);
  });

  it('ACA cost at 133% FPL ~3.14% of income ($800–$2,500)', () => {
    expect(txCurrent().acaCost).toBeGreaterThan(800);
    expect(txCurrent().acaCost).toBeLessThan(2500);
  });

  it('94% AV CSR ($1,400 × 4 = $5,600)', () => {
    expect(txCurrent().acaCSRValue).toBe(5600);
  });

  it('childcare at $44K positive for 2 kids (> $10,000)', () => {
    expect(txCurrent().childcareValue).toBeGreaterThan(10000);
  });

  it('total effective at $44K/4 in range $60,000–$78,000', () => {
    expect(txCurrent().totalEffective).toBeGreaterThan(60000);
    expect(txCurrent().totalEffective).toBeLessThan(78000);
  });
});

describe('Texas childless couple (non-expansion, family of 2)', () => {
  it('Medicaid=0 even at low income ($15K)', () => {
    const txChildless = getEffectiveTakeHome({ annualIncome: 15000, familySize: 2, state: 'TX', adultCount: 2 });
    expect(txChildless.medicaidValue).toBe(0);
  });
});

describe('North Carolina (expansion, no BBCE, family of 4)', () => {
  const ncCurrent = () => getEffectiveTakeHome({ annualIncome: 44000, familySize: 4, state: 'NC', adultCount: 2 });

  it('SNAP=0 at 133% FPL (130% FPL gross limit)', () => {
    expect(ncCurrent().snapValue).toBe(0);
  });

  it('Medicaid for 2 adults (expansion)', () => {
    expect(ncCurrent().medicaidValue).toBe(2 * FED.medicaid.adultAnnualValueProxy);
  });

  it('on Medicaid → no ACA cost', () => {
    expect(ncCurrent().acaCost).toBe(0);
  });

  it('childcare at $44K positive for 2 kids (> $10,000)', () => {
    expect(ncCurrent().childcareValue).toBeGreaterThan(10000);
  });

  it('total effective at $44K/4 in range $53,000–$72,000', () => {
    expect(ncCurrent().totalEffective).toBeGreaterThan(53000);
    expect(ncCurrent().totalEffective).toBeLessThan(72000);
  });
});

describe('Michigan (expansion, BBCE 200% FPL, family of 4)', () => {
  const miCurrent = () => getEffectiveTakeHome({ annualIncome: 44000, familySize: 4, state: 'MI', adultCount: 2 });

  it('SNAP at $44K/4 in OH-comparable range ($1,500–$3,000)', () => {
    expect(miCurrent().snapValue).toBeGreaterThan(1500);
    expect(miCurrent().snapValue).toBeLessThan(3000);
  });

  it('Medicaid for 2 adults (expansion)', () => {
    expect(miCurrent().medicaidValue).toBe(2 * FED.medicaid.adultAnnualValueProxy);
  });

  it('on Medicaid → no ACA cost', () => {
    expect(miCurrent().acaCost).toBe(0);
  });

  it('childcare at $44K positive for 2 kids (> $10,000)', () => {
    expect(miCurrent().childcareValue).toBeGreaterThan(10000);
  });

  it('total effective at $44K/4 in range $58,000–$79,000', () => {
    expect(miCurrent().totalEffective).toBeGreaterThan(58000);
    expect(miCurrent().totalEffective).toBeLessThan(79000);
  });
});

describe('Cross-state regression (states are independent)', () => {
  it('OH scenario unchanged when recomputed', () => {
    const current = demoCurrent();
    const ohRegress = getEffectiveTakeHome({ annualIncome: 44000, familySize: 4, state: 'OH', adultCount: 2 });
    expect(ohRegress.totalEffective).toBe(current.totalEffective);
  });

  it('TX scenario unchanged when recomputed', () => {
    const a = getEffectiveTakeHome({ annualIncome: 44000, familySize: 4, state: 'TX', adultCount: 2 });
    const b = getEffectiveTakeHome({ annualIncome: 44000, familySize: 4, state: 'TX', adultCount: 2 });
    expect(b.totalEffective).toBe(a.totalEffective);
  });

  it('NC scenario unchanged when recomputed', () => {
    const a = getEffectiveTakeHome({ annualIncome: 44000, familySize: 4, state: 'NC', adultCount: 2 });
    const b = getEffectiveTakeHome({ annualIncome: 44000, familySize: 4, state: 'NC', adultCount: 2 });
    expect(b.totalEffective).toBe(a.totalEffective);
  });
});

describe('Employer 401(k) match (% of salary)', () => {
  it('default matchRate=0 → matchValue=0', () => {
    const noMatch = getEffectiveTakeHome({ annualIncome: 44000, familySize: 4, state: 'OH', adultCount: 2 });
    expect(noMatch.matchValue).toBe(0);
  });

  it('matchRate=0 → same totalEffective as canonical demo', () => {
    const noMatch = getEffectiveTakeHome({ annualIncome: 44000, familySize: 4, state: 'OH', adultCount: 2 });
    expect(noMatch.totalEffective).toBe(demoCurrent().totalEffective);
  });

  it('matchRate=4 at $44k → $1,760', () => {
    const matchCurrent = getEffectiveTakeHome({ annualIncome: 44000, familySize: 4, state: 'OH', adultCount: 2, matchRate: 4 });
    expect(matchCurrent.matchValue).toBe(1760);
  });

  it('matchRate=4 at $70k → $2,800', () => {
    const matchOffered = getEffectiveTakeHome({ annualIncome: 70000, familySize: 4, state: 'OH', adultCount: 2, matchRate: 4 });
    expect(matchOffered.matchValue).toBe(2800);
  });

  it('match must not change SNAP/Medicaid/EITC (deferred comp, not earned income)', () => {
    const current = demoCurrent();
    const matchCurrent = getEffectiveTakeHome({ annualIncome: 44000, familySize: 4, state: 'OH', adultCount: 2, matchRate: 4 });
    expect(matchCurrent.snapValue).toBe(current.snapValue);
    expect(matchCurrent.medicaidValue).toBe(current.medicaidValue);
    expect(matchCurrent.eitcValue).toBe(current.eitcValue);
  });
});

describe('HSA / pre-tax 401(k) MAGI reduction', () => {
  const txBase = () => getEffectiveTakeHome({ annualIncome: 70000, familySize: 4, state: 'TX', adultCount: 2 });

  it('HSA $5k reduces MAGI from $70k to $65k', () => {
    const txWithHSA = getEffectiveTakeHome({ annualIncome: 70000, familySize: 4, state: 'TX', adultCount: 2, hsaContribution: 5000 });
    expect(txWithHSA.magi).toBe(65000);
  });

  it('pre-tax 401k $5k reduces MAGI from $70k to $65k', () => {
    const txWith401k = getEffectiveTakeHome({ annualIncome: 70000, familySize: 4, state: 'TX', adultCount: 2, pretax401k: 5000 });
    expect(txWith401k.magi).toBe(65000);
  });

  it('MAGI reduction must not change SNAP (gross income test)', () => {
    const txWithHSA = getEffectiveTakeHome({ annualIncome: 70000, familySize: 4, state: 'TX', adultCount: 2, hsaContribution: 5000 });
    expect(txWithHSA.snapValue).toBe(txBase().snapValue);
  });

  it('MAGI reduction via HSA should not increase ACA cost', () => {
    const txWithHSA = getEffectiveTakeHome({ annualIncome: 70000, familySize: 4, state: 'TX', adultCount: 2, hsaContribution: 5000 });
    expect(txWithHSA.acaCost).toBeLessThanOrEqual(txBase().acaCost);
  });

  it('zero contributions → magi === annualIncome', () => {
    const noReduction = getEffectiveTakeHome({ annualIncome: 70000, familySize: 4, state: 'TX', adultCount: 2, hsaContribution: 0, pretax401k: 0 });
    expect(noReduction.magi).toBe(70000);
  });

  it('zero contributions → totalEffective unchanged vs base', () => {
    const noReduction = getEffectiveTakeHome({ annualIncome: 70000, familySize: 4, state: 'TX', adultCount: 2, hsaContribution: 0, pretax401k: 0 });
    expect(noReduction.totalEffective).toBe(txBase().totalEffective);
  });
});
