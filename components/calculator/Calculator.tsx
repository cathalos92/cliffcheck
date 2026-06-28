"use client";

/**
 * Calculator — the root client island for the CliffCheck tool (task-118).
 *
 * Owns the scenario profile via useReducer, syncs it to/from the URL hash
 * (debounced) so a scenario is shareable by link, and computes results from the
 * engine on EVERY change — live, no submit button (DESIGN.md). Financial inputs
 * never leave the device: there is no fetch, no server action, no API. The URL
 * hash carries only non-identifying scenario shape (state, incomes, family size,
 * flags) — share-a-scenario, not data egress.
 *
 * Layout follows DESIGN.md exactly: single column, ≤540px centred,
 * form → live summary → chart → result cards → manager brief → sources. Calm
 * motion only — results are instant and never animate (no count-up tickers).
 */
import { useEffect, useMemo, useReducer, useRef } from "react";
import {
  isSupportedState,
  getStateSources,
  type Source,
} from "@/lib/engine";
import {
  type Profile,
  DEFAULT_PROFILE,
  parseProfileHash,
  encodeProfileHash,
} from "@/lib/profile-url";
import { deriveResults, type ScenarioOpts } from "./derive";
import { InputForm } from "./InputForm";
import { LiveSummaryStrip } from "./LiveSummaryStrip";
import { CliffChart } from "./CliffChart";
import { ResultCards } from "./ResultCards";
import { ManagerBrief } from "./ManagerBrief";
import { SourceChips } from "./SourceChip";

// ── Reducer ────────────────────────────────────────────────────────────────
type Action =
  | { type: "set"; field: keyof Profile; value: Profile[keyof Profile] }
  | { type: "replace"; profile: Profile };

function reducer(state: Profile, action: Action): Profile {
  switch (action.type) {
    case "set": {
      const next = { ...state, [action.field]: action.value } as Profile;
      // Coherence: adults can never exceed family size.
      if (next.adultCount > next.familySize) {
        next.adultCount = Math.min(2, next.familySize);
      }
      // Childcare flag is meaningless with no children — clear it.
      if (next.familySize - next.adultCount <= 0) {
        next.pfccEnrolled = false;
      }
      return next;
    }
    case "replace":
      return action.profile;
    default:
      return state;
  }
}

export function Calculator() {
  // Initialise from defaults on the server; hydrate from the URL hash on mount
  // (the hash is only available client-side — keeps server/client markup stable).
  const [profile, dispatch] = useReducer(reducer, DEFAULT_PROFILE);
  const hydrated = useRef(false);

  // Hydrate from the URL hash once, on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const parsed = parseProfileHash(window.location.hash);
    dispatch({ type: "replace", profile: parsed });
    hydrated.current = true;
  }, []);

  // Sync profile → URL hash, debounced (250ms). replaceState avoids polluting
  // history on every keypress. Skipped until after first hydration so we never
  // clobber an inbound shared link.
  useEffect(() => {
    if (typeof window === "undefined" || !hydrated.current) return;
    const id = window.setTimeout(() => {
      const hash = encodeProfileHash(profile);
      const url = `${window.location.pathname}${window.location.search}#${hash}`;
      window.history.replaceState(null, "", url);
    }, 250);
    return () => window.clearTimeout(id);
  }, [profile]);

  const supported = isSupportedState(profile.state);

  // Engine options derived from the profile (income axis handled per-call).
  const opts: ScenarioOpts = useMemo(
    () => ({
      state: profile.state,
      familySize: profile.familySize,
      adultCount: profile.adultCount,
      hasVoucher: profile.hasVoucher,
      pfccEnrolled: profile.pfccEnrolled,
      employerHealthInsurance: profile.employerHealthInsurance,
      matchRate: profile.matchRate,
      hsaContribution: profile.hsaContribution,
      pretax401k: profile.pretax401k,
    }),
    [profile]
  );

  // Live results — recomputed on every profile change (the whole point: instant).
  const results = useMemo(
    () =>
      supported
        ? deriveResults(opts, profile.currentIncome, profile.offeredIncome)
        : null,
    [opts, profile.currentIncome, profile.offeredIncome, supported]
  );

  const sources: Source[] = useMemo(
    () => (supported ? getStateSources(profile.state) : []),
    [profile.state, supported]
  );

  const set = <K extends keyof Profile>(field: K, value: Profile[K]) =>
    dispatch({ type: "set", field, value });

  return (
    <div
      style={{
        maxWidth: 540,
        margin: "0 auto",
        padding: "var(--space-lg) var(--space-md) var(--space-xxl)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-md)",
      }}
    >
      <header style={{ marginBottom: "var(--space-xs)" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "var(--type-heading)",
            fontWeight: 800,
            letterSpacing: "-0.01em",
            color: "var(--color-text-primary)",
          }}
        >
          Check your number
        </h1>
        <p
          style={{
            margin: "var(--space-xs) 0 0",
            fontSize: "var(--type-body)",
            lineHeight: 1.6,
            color: "var(--color-text-secondary)",
          }}
        >
          Enter your situation. We&apos;ll show what a raise really leaves you
          with — and the income where you clear every cliff. Updates as you type.
        </p>
      </header>

      <InputForm profile={profile} set={set} supported={supported} />

      {supported && results ? (
        <>
          <LiveSummaryStrip results={results} />
          <CliffChart
            results={results}
            currentIncome={profile.currentIncome}
            offeredIncome={profile.offeredIncome}
            stateLabel={stateLabel(profile.state)}
            familySize={profile.familySize}
          />
          <ResultCards results={results} />
          <SourceChips sources={sources} />
          <ManagerBrief profile={profile} results={results} />
        </>
      ) : null}
    </div>
  );
}

// Resolve the supported-state label for chart/header copy without leaking the
// engine's internal map here — getStateSources already gates on support.
function stateLabel(code: string): string {
  // The supported states' labels are stable; fall back to the code.
  const labels: Record<string, string> = {
    OH: "Ohio",
    TX: "Texas",
    NC: "North Carolina",
    MI: "Michigan",
  };
  return labels[code] ?? code;
}
