/**
 * lib/engine/provenance.ts — source collection for the methodology page +
 * inline source chips.
 *
 * Minimal this cycle: the gov-source citations currently live in code comments
 * (not yet machine-readable Rule<Provenance> values — that's a later cycle).
 * collectSources/getStateSources now carry a representative `url` per program
 * (transcribed from the inline citation comments / index.html) so the build-time
 * gov-source provenance guard can assert every exposed URL is a government host.
 * Full per-value Rule<Provenance> population happens in a later cycle.
 */
import { getState, isSupportedState } from './registry';
import type { Source, StateCode } from './types';

/**
 * Gov-host allowlist for the provenance guard. A URL is a valid gov source iff
 * its hostname ends in `.gov` (covers federal + every state, e.g. ohio.gov,
 * medicaid.gov, irs.gov, huduser.gov, fns.usda.gov, aspe.hhs.gov) OR exactly
 * matches one of the explicit federal hosts below (belt-and-braces — these are
 * all already `.gov`, listed so the intent reads clearly and stays stable if the
 * `.gov` suffix rule is ever tightened).
 *
 * NOTE: thefinancebuff.com is deliberately NOT here. The ACA applicable-%
 * source is third-party debt tracked via KNOWN_NON_GOV_EXCEPTIONS in the
 * provenance test, to be swapped to IRC §36B / IRS Rev. Proc. in a later cycle.
 */
const GOV_HOST_ALLOWLIST = new Set<string>([
  'federalregister.gov',
  'irs.gov',
  'huduser.gov',
  'medicaid.gov',
]);

/**
 * True iff `url` resolves to a government host (`*.gov` hostname suffix, or an
 * exact match in GOV_HOST_ALLOWLIST). Parses the URL properly so `https://`,
 * `www.`, ports, and paths don't affect the verdict. Returns false for
 * unparseable input rather than throwing.
 */
export function isGovSource(url: string): boolean {
  if (!url) return false;
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }
  // Strip a leading www. for the exact-match check (suffix check is unaffected).
  const bare = host.startsWith('www.') ? host.slice(4) : host;
  if (host === 'gov' || host.endsWith('.gov')) return true;
  return GOV_HOST_ALLOWLIST.has(bare);
}

/**
 * Minimal representative source URL per federal program, transcribed from the
 * inline citation comments (lib/engine/federal.ts + index.html). One URL per
 * program — this is the minimal plumbing for the guard, NOT the full
 * Rule<Provenance> wrap (later cycle). State-specific URLs (Medicaid, housing)
 * are read off the state rule comments where available; these federal defaults
 * are the fallback.
 */
export const SOURCE_URLS: Record<string, string> = {
  // Federal Poverty Guidelines — HHS/ASPE, Federal Register 2026-01-15.
  fpl: 'https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines',
  // SNAP — USDA FNS FY2026 (7 CFR §273.9 + COLA notice).
  snap: 'https://www.fns.usda.gov/snap/recipient/eligibility',
  // ACA applicable-percentage table — IRC §36B; CURRENTLY sourced 3P (non-gov).
  // TODO(Cycle B): swap to IRS Rev. Proc. / gov source. Tracked as known debt.
  aca: 'https://thefinancebuff.com/aca-premium-tax-credit-percentages.html',
  // EITC — IRS Rev. Proc. 2024-40 (TY2025 inflation adjustments).
  eitc: 'https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit/eitc-tables',
  // Medicaid — medicaid.gov state overview (federal default; states override below).
  medicaid: 'https://www.medicaid.gov/state-overviews/stateprofile.html',
  // Section 8 / Housing Choice Voucher — HUD FY2026 FMR dataset.
  housing: 'https://www.huduser.gov/portal/datasets/fmr.html',
};

/**
 * Walk a state's rule object and emit one Source per program present. Each
 * Source now carries a representative gov `url` from SOURCE_URLS (degrading to
 * undefined for programs without a machine-readable URL yet, e.g. childcare /
 * state income tax). Returns [] for unsupported states.
 */
export function collectSources(code: StateCode): Source[] {
  if (!isSupportedState(code)) return [];
  const state = getState(code);
  const sources: Source[] = [];

  if (state.snap) {
    sources.push({ program: 'snap', label: 'SNAP (USDA FNS FY2026)', url: SOURCE_URLS.snap });
  }
  if (state.medicaid) {
    sources.push({
      program: 'medicaid',
      label: `Medicaid (${state.medicaid.expanded ? 'expansion' : 'non-expansion'})`,
      url: SOURCE_URLS.medicaid,
    });
  }
  if (state.aca) {
    sources.push({ program: 'aca', label: 'ACA marketplace (SLCSP benchmark)', url: SOURCE_URLS.aca });
  }
  if (state.childcare) {
    // Childcare URL lives only in per-state comments today (no machine-readable
    // federal default). Degrade gracefully — url omitted until the Rule wrap.
    sources.push({ program: 'childcare', label: `Childcare subsidy (${state.childcare.subsidyName})` });
  }
  if (state.housing) {
    sources.push({ program: 'housing', label: 'Section 8 / HCV (HUD FY2026)', url: SOURCE_URLS.housing });
  }
  if (state.incomeTax) {
    // State income tax sources vary per state (and OH currently cites a 3P
    // policy analysis). Left without a machine-readable url this cycle.
    sources.push({ program: 'incomeTax', label: 'State income tax' });
  }

  return sources;
}

/** Public alias used by the methodology page / source chips. */
export function getStateSources(code: StateCode): Source[] {
  return collectSources(code);
}
