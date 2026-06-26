/**
 * lib/engine/types.ts — public type contract for the CliffCheck benefit engine.
 *
 * Extracted verbatim from the v1 single-file build (_archive/index.html).
 * Types only — no calculation logic. See docs/replatform/PLAN.md §"Engine extraction".
 */

/** Two-letter state code for a supported (or candidate) state. */
export type StateCode = string;

/**
 * Input to the take-home orchestrator. Options-object signature (the documented
 * contract). `annualIncome`, `familySize`, and `state` are required; the rest are
 * optional knobs that default to the same values the original orchestrator used.
 */
export interface TakeHomeInput {
  /** Annual gross wages in dollars. */
  annualIncome: number;
  /** Total household size (adults + children). */
  familySize: number;
  /** Two-letter state code (e.g. 'OH'). */
  state: StateCode;
  /** Number of adults in the household. Default 2. */
  adultCount?: number;
  /** Whether the family is enrolled in the state childcare subsidy (continuation eligibility). */
  pfccEnrolled?: boolean;
  /** Whether the household holds a Section 8 / Housing Choice Voucher. */
  hasVoucher?: boolean;
  /** Whether the household has employer-sponsored health insurance (short-circuits ACA). */
  employerHealthInsurance?: boolean;
  /** Employer 401(k) match rate as a percent of salary. */
  matchRate?: number;
  /** Annual HSA contribution (reduces MAGI). */
  hsaContribution?: number;
  /** Annual pre-tax 401(k) contribution (reduces MAGI). */
  pretax401k?: number;
}

/**
 * Full 13-field breakdown returned by getEffectiveTakeHome. All dollar values are
 * annual integers. `acaCost` and `stateTaxOwed` are positive amounts subtracted
 * from totalEffective; everything else is additive.
 */
export interface TakeHomeBreakdown {
  grossWages: number;
  magi: number;
  magiReduction: number;
  snapValue: number;
  medicaidValue: number;
  acaCost: number;
  acaCSRValue: number;
  section8Value: number;
  childcareValue: number;
  eitcValue: number;
  stateTaxOwed: number;
  matchValue: number;
  totalEffective: number;
}

/** Provenance metadata for a gov-sourced rule value (populated in a later cycle). */
export interface Provenance {
  source: string;
  url: string;
  citation?: string;
  retrieved: string;
  note?: string;
}

/** A rule value paired with its provenance. Not yet applied per-value (later cycle). */
export interface Rule<T> {
  value: T;
  prov: Provenance;
}

// ── State rule shapes ───────────────────────────────────────────────────────

export interface StateSnapRules {
  grossLimitFPL: number;
}

export interface StateMedicaidRules {
  expanded: boolean;
  /** Expansion-state adult eligibility ceiling (FPL fraction). */
  expansionFPL?: number;
  /** Children eligibility ceiling (FPL fraction). */
  childrenFPL?: number;
  /** Non-expansion: parent eligibility ceiling (FPL fraction). */
  parentFPL?: number;
  /** Non-expansion: childless-adult eligibility ceiling (FPL fraction). */
  childlessAdultFPL?: number;
}

export interface StateAcaRules {
  /** Second-lowest-cost Silver plan monthly premium by household size (1–6). */
  slcspMonthly: Record<number, number>;
}

export interface StateChildcareRules {
  subsidyName: string;
  entryFPL: number;
  exitFPL: number;
  coPayRate: number;
  coPayFreeFPL: number;
  /** Annual gross childcare value indexed by number of children (0..3+). */
  valuePerChild: number[];
}

export interface StateHousingRules {
  incomeLimitAnnual: number;
  paymentStandardMonthly: number;
  tenantShareRate: number;
}

export interface StateIncomeTaxRules {
  noTaxFloor: number;
  flatRate: number;
}

/** Shape of a single state's rule object (a slice of the original STATES table). */
export interface StateRules {
  supported: boolean;
  label: string;
  snap: StateSnapRules;
  medicaid: StateMedicaidRules;
  aca: StateAcaRules;
  childcare: StateChildcareRules;
  housing: StateHousingRules;
  /** Optional — present only for states with a modelled (flat) income tax. */
  incomeTax?: StateIncomeTaxRules;
}

/** A gov source entry surfaced by getStateSources / collectSources. */
export interface Source {
  /** Program key (e.g. 'snap', 'medicaid', 'aca', 'childcare', 'housing', 'incomeTax'). */
  program: string;
  /** Human label for the source. */
  label: string;
  /** Gov URL (or 3P, until swapped in a later cycle). */
  url?: string;
  /** Inline citation text, where available. */
  citation?: string;
}

/** Options shared by the per-program calc functions (internal positional opts). */
export interface CalcOpts {
  stateCode?: StateCode;
  pfccEnrolled?: boolean;
  hasVoucher?: boolean;
  adultCount?: number;
  employerHealthInsurance?: boolean;
  matchRate?: number;
  hsaContribution?: number;
  pretax401k?: number;
}

/** A single hero scenario (curated in a later cycle; stub shape for now). */
export interface HeroScenario {
  state: StateCode;
  familySize: number;
  currentIncome: number;
  offeredIncome: number;
  netDiff: number;
  headline: string;
}
