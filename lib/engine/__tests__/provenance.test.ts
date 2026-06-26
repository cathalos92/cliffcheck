/**
 * provenance.test.ts — build-time gov-source provenance guard.
 *
 * The integrity story of CliffCheck is that every number traces to a government
 * source. This suite asserts every source URL the engine exposes is a gov host
 * (see PLAN.md §"Machine-readable provenance"), with ONE tracked exception:
 * the ACA applicable-percentage table, currently sourced to thefinancebuff.com.
 *
 * Strategy (CI hygiene): rather than leaving the suite RED until a later cycle
 * swaps the ACA source, we keep it GREEN via an explicit, loudly-commented
 * KNOWN_NON_GOV_EXCEPTIONS allow-set PLUS an `it.fails` tripwire. The guard is
 * still real — any NEW non-gov source (not in the exception set) fails the build
 * immediately. When the ACA source becomes gov, the tripwire flips RED, forcing
 * cleanup of both the exception and the tripwire.
 */
import { describe, it, expect } from 'vitest';
import {
  isGovSource,
  collectSources,
  getSupportedStates,
  SOURCE_URLS,
} from '@/lib/engine';

// The ACA applicable-% source under audit. Transcribed from the citation comment
// in lib/engine/federal.ts / index.html (IRC §36B applicable-percentage table).
const ACA_URL = SOURCE_URLS.aca;

/**
 * URLs that are knowingly NOT gov sources, tracked as debt. The guard treats
 * these as expected so the suite stays green, but ONLY these — any other non-gov
 * URL fails the build.
 *
 * Currently exactly one entry: the ACA applicable-% table.
 * TODO(Cycle B): swap ACA applicable-% source to IRC §36B / IRS Rev. Proc. and DELETE this exception.
 */
const KNOWN_NON_GOV_EXCEPTIONS = new Set<string>([
  'https://thefinancebuff.com/aca-premium-tax-credit-percentages.html',
]);

/** Every distinct source URL the engine exposes across all supported states. */
function collectAllSourceUrls(): string[] {
  const urls = new Set<string>();
  for (const { code } of getSupportedStates()) {
    for (const src of collectSources(code)) {
      if (src.url) urls.add(src.url);
    }
  }
  return [...urls];
}

describe('gov-source provenance guard', () => {
  it('every exposed source URL is a gov host, except tracked exceptions', () => {
    const urls = collectAllSourceUrls();
    expect(urls.length).toBeGreaterThan(0); // sanity: we actually collected URLs
    for (const url of urls) {
      if (KNOWN_NON_GOV_EXCEPTIONS.has(url)) continue;
      expect(isGovSource(url), `non-gov source not in exception set: ${url}`).toBe(true);
    }
  });

  it('documents the known non-gov debt (ACA applicable-% via thefinancebuff)', () => {
    // Visibility test: the known exception set must currently contain the ACA
    // 3P URL. If someone removes the exception without fixing the source, the
    // active guard above turns red — this keeps the debt explicit.
    expect(KNOWN_NON_GOV_EXCEPTIONS.has(ACA_URL)).toBe(true);
  });

  // TRIPWIRE: today isGovSource(thefinancebuff) === false, so this assertion
  // FAILS, so `it.fails` PASSES (green). When a later cycle swaps the ACA source
  // to a gov host, the assertion PASSES, `it.fails` turns RED — forcing whoever
  // makes the swap to delete BOTH this tripwire and the KNOWN_NON_GOV_EXCEPTIONS
  // entry. Same forcing function as a red guard, without a permanently-broken CI.
  it.fails('TRIPWIRE — once the ACA source is gov, this flips RED: delete it + the exception', () => {
    expect(isGovSource(ACA_URL)).toBe(true);
  });
});

describe('isGovSource', () => {
  it.each([
    'https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit/eitc-tables',
    'https://www.fns.usda.gov/snap/recipient/eligibility',
    'https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines',
    'https://www.huduser.gov/portal/datasets/fmr.html',
    'https://www.medicaid.gov/state-overviews/stateprofile.html',
    'https://medicaid.ncdhhs.gov/', // a state .gov
    'https://www.michigan.gov/mdhhs/assistance-programs/medicaid',
  ])('accepts gov host: %s', (url) => {
    expect(isGovSource(url)).toBe(true);
  });

  it.each([
    'https://thefinancebuff.com/aca-premium-tax-credit-percentages.html',
    'https://example.com',
    'https://www.govtech.com/notgov', // .com that merely contains "gov"
    'not a url',
    '',
  ])('rejects non-gov / invalid: %s', (url) => {
    expect(isGovSource(url)).toBe(false);
  });
});
