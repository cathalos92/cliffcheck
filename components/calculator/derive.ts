/**
 * components/calculator/derive.ts — pure derivations layered on the engine.
 *
 * The engine (@/lib/engine) is the source of truth for every dollar. This module
 * adds NO new money math — it only scans the engine's 121-point cliff curve to
 * derive the *scenario-level* facts the UI needs: the safe-exit income, the
 * steepest single-step cliff (and its dominant program cause), per-program
 * thresholds where a benefit ends, and the per-benefit monthly deltas between the
 * current and offered scenarios. Logic ported 1:1 from index.html (v1).
 *
 * Kept framework-free + typed so it can be unit-reasoned and reused.
 */
import {
  getEffectiveTakeHome,
  getCliffData,
  type TakeHomeInput,
  type TakeHomeBreakdown,
} from "@/lib/engine";

/** Engine options minus the income axis (the shared scenario knobs). */
export type ScenarioOpts = Omit<TakeHomeInput, "annualIncome">;

export type CliffPoint = { income: number } & TakeHomeBreakdown;

export interface CliffAnnotation {
  /** Income midpoint of the steepest drop step (for label placement). */
  midIncome: number;
  /** Effective take-home at the bottom of the drop. */
  bottomEffective: number;
  /** Signed step delta (negative for a drop). */
  dy: number;
  /** Absolute drop amount (rounded). */
  dropAmount: number;
  /** Dominant program responsible for the drop, or null. */
  cause: string | null;
}

export interface ProgramCliff {
  /** Income where the program drops to zero. */
  income: number;
  /** Human label ("SNAP ends"). */
  label: string;
}

export interface BenefitDelta {
  label: string;
  /** Monthly delta in dollars (offered − current). */
  delta: number;
  /** True if this line is a cost (ACA cost / state tax) where +delta = a loss. */
  isCost: boolean;
}

export interface DerivedResults {
  points: CliffPoint[];
  current: TakeHomeBreakdown;
  offered: TakeHomeBreakdown;
  /** Effective offered − effective current (signed; negative = a cliff). */
  diff: number;
  /** True when the offer leaves the household meaningfully worse off. */
  isWorse: boolean;
  /** True when the offer is meaningfully better. */
  isBetter: boolean;
  /** First income past ALL cliffs where effective permanently beats today, or null. */
  safeExit: number | null;
  /** Y-axis minimum for the chart (zoomed to the relevant band). */
  yMin: number;
  /** The steepest single-step drop across the curve, or null if monotonic. */
  cliffAnnotation: CliffAnnotation | null;
  /** Per-program income thresholds where a benefit ends. */
  programCliffs: ProgramCliff[];
  /** Per-benefit monthly deltas (only when worse; itemises the loss). */
  breakdown: BenefitDelta[];
  /** Total current benefit value (for the manager brief). */
  currentBenefitValue: number;
}

/**
 * Compute everything the calculator UI renders from a scenario. One pass over the
 * engine; presentational components consume this and never call the engine again.
 */
export function deriveResults(
  opts: ScenarioOpts,
  currentIncome: number,
  offeredIncome: number
): DerivedResults {
  const points = getCliffData(opts) as CliffPoint[];
  const current = getEffectiveTakeHome({ ...opts, annualIncome: currentIncome });
  const offered = getEffectiveTakeHome({ ...opts, annualIncome: offeredIncome });

  const diff = offered.totalEffective - current.totalEffective;
  const isWorse = diff < -500;
  const isBetter = diff > 500;

  // Safe exit = minimum income past ALL cliffs where effective permanently
  // exceeds today's baseline. Scan high→low: the last income below baseline is
  // the final cliff; safe exit is the next $1k step up (if it's above current).
  let safeExit: number | null = null;
  const baseline = current.totalEffective;
  for (let i = points.length - 1; i >= 0; i--) {
    if (points[i].totalEffective < baseline) {
      if (i + 1 < points.length && points[i + 1].income > currentIncome) {
        safeExit = points[i + 1].income;
      }
      break;
    }
  }

  // Y-axis min: zoom to the relevant band, floored to a clean $5k, never < 0.
  const minY = Math.min(...points.map((p) => p.totalEffective));
  const yMin = Math.max(0, Math.floor((minY - 6000) / 5000) * 5000);

  // Steepest single-step drop + dominant program cause.
  let cliffAnnotation: CliffAnnotation | null = null;
  for (let i = 0; i < points.length - 1; i++) {
    const dy = points[i + 1].totalEffective - points[i].totalEffective;
    if (!cliffAnnotation || dy < cliffAnnotation.dy) {
      const dSnap = points[i + 1].snapValue - points[i].snapValue;
      const dMedicaid = points[i + 1].medicaidValue - points[i].medicaidValue;
      const dCC = points[i + 1].childcareValue - points[i].childcareValue;
      const dACA = points[i].acaCost - points[i + 1].acaCost; // cost rises = benefit falls
      const candidates = [
        { name: "SNAP", delta: dSnap },
        { name: "Medicaid", delta: dMedicaid },
        { name: "Childcare", delta: dCC },
        { name: "ACA", delta: dACA },
      ]
        .filter((c) => c.delta < -200)
        .sort((a, b) => a.delta - b.delta);
      cliffAnnotation = {
        midIncome: (points[i].income + points[i + 1].income) / 2,
        bottomEffective: points[i + 1].totalEffective,
        dy,
        dropAmount: Math.round(Math.abs(dy)),
        cause: candidates[0]?.name ?? null,
      };
    }
  }
  // Only annotate a genuine cliff (a real drop), not gentle noise.
  if (cliffAnnotation && cliffAnnotation.dy >= -200) cliffAnnotation = null;

  // Per-program thresholds where a benefit ends (positive → zero).
  const programCliffs: ProgramCliff[] = [];
  const programs: Array<{ key: keyof TakeHomeBreakdown; label: string }> = [
    { key: "medicaidValue", label: "Medicaid ends" },
    { key: "snapValue", label: "SNAP ends" },
    { key: "childcareValue", label: "Childcare ends" },
  ];
  for (const { key, label } of programs) {
    for (let i = 0; i < points.length - 1; i++) {
      if (points[i][key] > 0 && points[i + 1][key] === 0) {
        programCliffs.push({ income: points[i + 1].income, label });
        break;
      }
    }
  }

  // Per-benefit monthly deltas — itemises the loss (only when worse).
  const employerHealthInsurance = !!opts.employerHealthInsurance;
  const hasVoucher = !!opts.hasVoucher;
  const matchRate = Number(opts.matchRate) || 0;
  const m = (a: number, b: number) => Math.round((a - b) / 12);
  const breakdown: BenefitDelta[] = isWorse
    ? [
        { label: "SNAP", delta: m(offered.snapValue, current.snapValue), isCost: false },
        { label: "Medicaid", delta: m(offered.medicaidValue, current.medicaidValue), isCost: false },
        ...(employerHealthInsurance
          ? []
          : [
              { label: "ACA cost", delta: m(offered.acaCost, current.acaCost), isCost: true },
              { label: "ACA savings", delta: m(offered.acaCSRValue, current.acaCSRValue), isCost: false },
            ]),
        { label: "Childcare", delta: m(offered.childcareValue, current.childcareValue), isCost: false },
        ...(hasVoucher
          ? [{ label: "Section 8", delta: m(offered.section8Value, current.section8Value), isCost: false }]
          : []),
        { label: "State tax", delta: m(offered.stateTaxOwed, current.stateTaxOwed), isCost: true },
        ...(matchRate > 0
          ? [{ label: "401(k) match", delta: m(offered.matchValue, current.matchValue), isCost: false }]
          : []),
      ].filter((b) => b.delta !== 0)
    : [];

  const currentBenefitValue =
    current.snapValue +
    current.medicaidValue +
    current.section8Value +
    current.childcareValue +
    current.acaCSRValue -
    current.acaCost;

  return {
    points,
    current,
    offered,
    diff,
    isWorse,
    isBetter,
    safeExit,
    yMin,
    cliffAnnotation,
    programCliffs,
    breakdown,
    currentBenefitValue,
  };
}

/** Format an integer dollar amount as `$12,400` (no cents, en-US grouping). */
export function fmtDollars(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

/** Format a monthly figure from an annual amount, rounded to whole dollars. */
export function fmtMonthly(annual: number): string {
  return fmtDollars(annual / 12);
}
