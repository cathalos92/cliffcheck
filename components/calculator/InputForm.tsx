"use client";

/**
 * InputForm — the calculator's live, labelled input surface (DESIGN.md Input
 * Field, DESIGN-DIRECTION.md §13). Every control updates the scenario live (no
 * submit button). Labels sit above inputs (never placeholder-only); focus rings
 * are amber (globals.css :focus-visible), never blue. 48px controls, 44px+ tap
 * targets, single column at 375px. Advanced levers (HSA / 401k) live in a clean
 * collapsible so the default view stays calm.
 *
 * Unsupported states degrade gracefully: the selector still works, but a warm
 * message replaces the results (handled by the parent) and a note shows here.
 */
import { useId, useState } from "react";
import { getSupportedStates } from "@/lib/engine";
import type { Profile } from "@/lib/profile-url";

const CHILDCARE_NAMES: Record<string, string> = {
  OH: "PFCC",
  TX: "CCS",
  NC: "subsidised childcare",
  MI: "MI Tri-Share",
};

const fieldCard: React.CSSProperties = {
  backgroundColor: "var(--color-surface-white)",
  border: "1px solid var(--color-border-stone)",
  borderRadius: "var(--radius-lg)",
  padding: "var(--space-lg)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "var(--type-subheading)",
  fontWeight: 600,
  color: "var(--color-text-secondary)",
  marginBottom: "6px",
};

const controlStyle: React.CSSProperties = {
  width: "100%",
  height: 48,
  padding: "0 12px",
  backgroundColor: "var(--color-surface-white)",
  border: "1px solid var(--color-border-stone)",
  borderRadius: "var(--radius-lg)",
  color: "var(--color-text-primary)",
  fontSize: "16px",
  fontFamily: "var(--font-sans)",
};

const helperStyle: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: "var(--type-caption)",
  color: "var(--color-text-muted)",
  lineHeight: 1.5,
};

export function InputForm({
  profile,
  set,
  supported,
}: {
  profile: Profile;
  set: <K extends keyof Profile>(field: K, value: Profile[K]) => void;
  supported: boolean;
}) {
  const [showLevers, setShowLevers] = useState(
    profile.hsaContribution > 0 || profile.pretax401k > 0
  );
  const states = getSupportedStates();
  const kids = Math.max(0, profile.familySize - profile.adultCount);
  const ccName = CHILDCARE_NAMES[profile.state] ?? "a childcare subsidy";

  const stateId = useId();
  const familyId = useId();
  const currentId = useId();
  const offeredId = useId();
  const matchId = useId();
  const hsaId = useId();
  const k401Id = useId();

  return (
    <section style={fieldCard} aria-label="Your situation">
      <h2
        style={{
          margin: "0 0 var(--space-md)",
          fontSize: "var(--type-heading)",
          fontWeight: 700,
          color: "var(--color-text-primary)",
        }}
      >
        Your situation
      </h2>

      {/* State */}
      <div style={{ marginBottom: "var(--space-md)" }}>
        <label htmlFor={stateId} style={labelStyle}>
          State
        </label>
        <select
          id={stateId}
          value={profile.state}
          onChange={(e) => set("state", e.target.value)}
          style={controlStyle}
        >
          {/* If the current (deeplinked) state isn't supported, surface it so the
              selector reflects the URL — but the parent shows a graceful message. */}
          {!supported && (
            <option value={profile.state}>{profile.state} (not yet covered)</option>
          )}
          {states.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
        {!supported && (
          <p style={{ ...helperStyle, color: "var(--color-cta-hover-amber)" }}>
            We don&apos;t cover this state yet. Pick a covered state to see your
            cliff.
          </p>
        )}
      </div>

      {/* Family size */}
      <div style={{ marginBottom: "var(--space-md)" }}>
        <label htmlFor={familyId} style={labelStyle}>
          Family size
        </label>
        <select
          id={familyId}
          value={profile.familySize}
          onChange={(e) => set("familySize", Number(e.target.value))}
          style={controlStyle}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "person" : "people"}
            </option>
          ))}
        </select>
      </div>

      {/* Adults */}
      <div style={{ marginBottom: "var(--space-md)" }}>
        <span style={labelStyle}>Adults in household</span>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          {[1, 2].map((n) => {
            const active = profile.adultCount === n;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={active}
                onClick={() => set("adultCount", n)}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: "var(--radius-lg)",
                  border: active
                    ? "1px solid var(--color-brand-amber)"
                    : "1px solid var(--color-border-stone)",
                  backgroundColor: active
                    ? "var(--color-brand-amber)"
                    : "var(--color-surface-white)",
                  color: active
                    ? "var(--color-text-primary)"
                    : "var(--color-text-secondary)",
                  fontSize: "var(--type-subheading)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {n === 1 ? "1 adult" : "2 adults"}
              </button>
            );
          })}
        </div>
        <p style={helperStyle}>
          Children = family size − adults
          {kids === 0
            ? " (no children)"
            : kids === 1
              ? " (1 child)"
              : ` (${kids} children)`}
        </p>
      </div>

      {/* Current income */}
      <IncomeField
        id={currentId}
        label="Current annual wages"
        value={profile.currentIncome}
        onChange={(v) => set("currentIncome", v)}
      />

      {/* Offered income */}
      <IncomeField
        id={offeredId}
        label="Offered or target annual wages"
        value={profile.offeredIncome}
        onChange={(v) => set("offeredIncome", v)}
      />

      {/* Section 8 voucher */}
      <CheckboxRow
        checked={profile.hasVoucher}
        onChange={(c) => set("hasVoucher", c)}
        label="I have a Section 8 / Housing Choice Voucher"
      />

      {/* Employer health insurance */}
      <CheckboxRow
        checked={profile.employerHealthInsurance}
        onChange={(c) => set("employerHealthInsurance", c)}
        label="I have employer health insurance"
        helper="ACA premium and savings don't apply when you have qualifying employer coverage."
      />

      {/* Childcare enrolled — only when there's at least one child */}
      {kids > 0 && (
        <CheckboxRow
          checked={profile.pfccEnrolled}
          onChange={(c) => set("pfccEnrolled", c)}
          label={`Already enrolled in subsidised childcare (${ccName})`}
        />
      )}

      {/* Employer 401(k) match */}
      <div style={{ marginTop: "var(--space-md)" }}>
        <label htmlFor={matchId} style={labelStyle}>
          Employer 401(k) match (% of salary)
        </label>
        <input
          id={matchId}
          type="number"
          inputMode="decimal"
          min={0}
          max={20}
          step={0.5}
          value={profile.matchRate}
          onChange={(e) =>
            set("matchRate", clamp(Number(e.target.value), 0, 20))
          }
          style={{ ...controlStyle, fontVariantNumeric: "tabular-nums" }}
        />
        <p style={helperStyle}>
          Optional. Enter the rate (e.g. 4 for 4%). Match scales with salary, so a
          higher offer gains more. Default 0 (off).
        </p>
      </div>

      {/* Advanced levers — collapsible */}
      <div
        style={{
          marginTop: "var(--space-md)",
          borderTop: "1px solid var(--color-border-stone)",
          paddingTop: "var(--space-md)",
        }}
      >
        <button
          type="button"
          aria-expanded={showLevers}
          onClick={() => setShowLevers((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-xs)",
            width: "100%",
            minHeight: 44,
            background: "none",
            border: "none",
            padding: 0,
            textAlign: "left",
            cursor: "pointer",
            fontSize: "var(--type-subheading)",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
          }}
        >
          <span
            aria-hidden
            style={{ color: "var(--color-brand-amber)", fontSize: "16px" }}
          >
            {showLevers ? "▾" : "▸"}
          </span>
          <span>Advanced levers</span>
          <span
            style={{
              fontSize: "var(--type-caption)",
              fontWeight: 400,
              color: "var(--color-text-muted)",
            }}
          >
            HSA &amp; pre-tax 401(k)
          </span>
        </button>

        {showLevers && (
          <div
            style={{
              marginTop: "var(--space-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-md)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "var(--type-caption)",
                lineHeight: 1.6,
                color: "var(--color-text-secondary)",
              }}
            >
              HSA and traditional 401(k) contributions lower the income figure used
              for ACA savings and Medicaid — which can restore benefits if
              you&apos;re just over a cliff. SNAP uses gross wages regardless.
            </p>

            <div>
              <label htmlFor={hsaId} style={labelStyle}>
                Annual HSA contribution ($)
              </label>
              <input
                id={hsaId}
                type="number"
                inputMode="numeric"
                min={0}
                max={9000}
                step={100}
                value={profile.hsaContribution}
                onChange={(e) =>
                  set("hsaContribution", clamp(Number(e.target.value), 0, 9000))
                }
                style={{ ...controlStyle, fontVariantNumeric: "tabular-nums" }}
              />
              <p style={helperStyle}>
                2026 limit: $4,300 (self) / $8,550 (family).
              </p>
            </div>

            <div>
              <label htmlFor={k401Id} style={labelStyle}>
                Annual pre-tax 401(k) contribution ($)
              </label>
              <input
                id={k401Id}
                type="number"
                inputMode="numeric"
                min={0}
                max={24000}
                step={500}
                value={profile.pretax401k}
                onChange={(e) =>
                  set("pretax401k", clamp(Number(e.target.value), 0, 24000))
                }
                style={{ ...controlStyle, fontVariantNumeric: "tabular-nums" }}
              />
              <p style={helperStyle}>
                2026 limit: $23,500. Pre-tax, not Roth.
              </p>
            </div>

            {(profile.hsaContribution > 0 || profile.pretax401k > 0) && (
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--type-caption)",
                  lineHeight: 1.6,
                  color: "var(--color-cta-hover-amber)",
                  backgroundColor: "var(--color-chart-transition-fill)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-sm)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                Taxable income reduced by $
                {(profile.hsaContribution + profile.pretax401k).toLocaleString(
                  "en-US"
                )}
                /yr — ACA savings and Medicaid reflect this. SNAP and other
                benefits use gross wages.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Income field: a slider + a live number readout (both edit the same value) ─
function IncomeField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: "var(--space-md)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "6px",
        }}
      >
        <label htmlFor={id} style={{ ...labelStyle, margin: 0 }}>
          {label}
        </label>
        <span
          style={{
            fontSize: "var(--type-heading)",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          ${value.toLocaleString("en-US")}
          <span
            style={{
              fontSize: "var(--type-caption)",
              fontWeight: 400,
              color: "var(--color-text-muted)",
            }}
          >
            /yr
          </span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={120000}
        step={1000}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          height: 44,
          accentColor: "var(--color-brand-amber)",
          cursor: "pointer",
        }}
      />
    </div>
  );
}

// ── Checkbox row ─────────────────────────────────────────────────────────────
function CheckboxRow({
  checked,
  onChange,
  label,
  helper,
}: {
  checked: boolean;
  onChange: (c: boolean) => void;
  label: string;
  helper?: string;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: helper ? "flex-start" : "center",
        gap: "var(--space-sm)",
        cursor: "pointer",
        minHeight: 44,
        marginBottom: "var(--space-xs)",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: 20,
          height: 20,
          marginTop: helper ? 2 : 0,
          accentColor: "var(--color-brand-amber)",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: "var(--type-subheading)",
          color: "var(--color-text-secondary)",
          lineHeight: 1.4,
        }}
      >
        {label}
        {helper && (
          <span
            style={{
              display: "block",
              fontSize: "var(--type-caption)",
              color: "var(--color-text-muted)",
              marginTop: 2,
            }}
          >
            {helper}
          </span>
        )}
      </span>
    </label>
  );
}

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}
