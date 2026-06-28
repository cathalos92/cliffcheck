"use client";

/**
 * LiveSummaryStrip — the single rolling line comparing current vs offered
 * effective take-home (DESIGN.md "Live summary strip", DESIGN-DIRECTION.md §13).
 * Trust-surface background. Two-layer money pattern (muted label above, big bold
 * value below). The number is static and instant — NEVER a count-up ticker.
 *
 * The delta is the headline: −$X in negative-delta red when the offer leaves the
 * household worse, +$X in positive-delta green when it helps.
 */
import type { DerivedResults } from "./derive";
import { fmtDollars } from "./derive";

export function LiveSummaryStrip({ results }: { results: DerivedResults }) {
  const { current, offered, diff, isWorse, isBetter } = results;
  const deltaColor = isWorse
    ? "var(--color-negative-delta)"
    : isBetter
      ? "var(--color-positive-delta)"
      : "var(--color-text-secondary)";
  const sign = diff < 0 ? "−" : "+";

  return (
    <section
      aria-label="Current versus offered take-home"
      style={{
        backgroundColor: "var(--color-trust-surface)",
        border: "1px solid var(--color-border-stone)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-md)",
        display: "flex",
        alignItems: "flex-end",
        gap: "var(--space-md)",
      }}
    >
      <Metric label="Take-home today" value={current.totalEffective} />
      <div
        aria-hidden
        style={{
          fontSize: "var(--type-heading)",
          fontWeight: 700,
          color: deltaColor,
          paddingBottom: 4,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {sign}
        {fmtDollars(Math.abs(diff))}
      </div>
      <Metric
        label="After the offer"
        value={offered.totalEffective}
        valueColor={deltaColor}
        align="right"
      />
    </section>
  );
}

function Metric({
  label,
  value,
  valueColor = "var(--color-text-primary)",
  align = "left",
}: {
  label: string;
  value: number;
  valueColor?: string;
  align?: "left" | "right";
}) {
  return (
    <div style={{ flex: 1, minWidth: 0, textAlign: align }}>
      <p
        style={{
          margin: 0,
          fontSize: "var(--type-caption)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "var(--color-text-muted)",
          lineHeight: 1,
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: "8px 0 0",
          fontSize: "clamp(1.6rem, 6vw, 2.25rem)",
          fontWeight: 800,
          lineHeight: 1,
          color: valueColor,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {fmtDollars(value)}
      </p>
      <p
        style={{
          margin: "6px 0 0",
          fontSize: "var(--type-caption)",
          color: "var(--color-text-muted)",
        }}
      >
        /yr incl. benefits
      </p>
    </div>
  );
}
