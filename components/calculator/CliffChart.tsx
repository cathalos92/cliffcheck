"use client";

/**
 * CliffChart — the "Oh Shit" payload (DESIGN.md Cliff Chart, DESIGN-DIRECTION.md
 * §13). A stranger must understand "this raise makes them $X poorer" in 5 seconds.
 *
 * Recharts, `type="stepAfter"` — NO bezier smoothing (cliffs are step functions).
 * Zone fills (safe-green / cliff-red / transition-amber) chapter the income axis;
 * a quiet dashed wages-only reference line shows the benefit gap; three dashed
 * markers — You now (blue) / Offer (violet) / Safe exit (green) — carry inline
 * labels (no internal legend). The steepest drop is annotated in place.
 *
 * Calm motion only (DESIGN.md): a quick ≤200ms linear draw on change; under
 * prefers-reduced-motion the draw is off entirely. NEVER a number ticker — the
 * money values here are static and instant.
 */
import { useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Label,
} from "recharts";
import type { DerivedResults } from "./derive";

const C = {
  line: "var(--color-chart-line)",
  safeFill: "#DCFCE7",
  cliffFill: "#FEF2F2",
  transFill: "#FFFBEB",
  blue: "#2563EB",
  violet: "#7C3AED",
  green: "#16A34A",
  muted: "#A8A29E",
  secondary: "#57534E",
  wagesRef: "#D6D3D1",
  grid: "rgba(231,229,228,0.7)",
} as const;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function CliffChart({
  results,
  currentIncome,
  offeredIncome,
  stateLabel,
  familySize,
}: {
  results: DerivedResults;
  currentIncome: number;
  offeredIncome: number;
  stateLabel: string;
  familySize: number;
}) {
  const reduced = usePrefersReducedMotion();
  const { points, yMin, cliffAnnotation, safeExit } = results;

  // Recharts rows: effective take-home + the straight wages-only reference.
  const data = points.map((p) => ({
    income: p.income,
    effective: p.totalEffective,
    wages: p.income,
  }));

  // Zone boundaries from the steepest drop: safe stretch (pre-cliff), the cliff
  // band itself, and the transition/recovery stretch after. Falls back to a
  // single neutral field when there's no cliff (monotonic curve).
  const cliffStart = cliffAnnotation
    ? cliffAnnotation.midIncome - 500
    : null;
  const cliffEnd = cliffAnnotation ? cliffAnnotation.midIncome + 500 : null;

  return (
    <section
      id="cliff-chart"
      aria-label={`Benefits cliff chart for ${stateLabel}, household of ${familySize}`}
      style={{
        backgroundColor: "var(--color-surface-white)",
        border: "1px solid var(--color-border-stone)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-md)",
      }}
    >
      <h2
        style={{
          margin: "0 0 var(--space-xs)",
          fontSize: "var(--type-heading)",
          fontWeight: 700,
          color: "var(--color-text-primary)",
        }}
      >
        Your benefits cliff
      </h2>
      <p
        style={{
          margin: "0 0 var(--space-sm)",
          fontSize: "var(--type-caption)",
          color: "var(--color-text-muted)",
        }}
      >
        {stateLabel} · household of {familySize}. The line is your real take-home —
        wages plus benefits — as your wages rise.
      </p>

      <div style={{ width: "100%", aspectRatio: "16 / 11" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 16, right: 12, bottom: 24, left: 4 }}
          >
            <CartesianGrid stroke={C.grid} vertical={false} />

            {/* Zone fills — chapter the income axis (safe → cliff → recovery). */}
            {cliffStart !== null && cliffEnd !== null ? (
              <>
                <ReferenceArea
                  x1={0}
                  x2={cliffStart}
                  fill={C.safeFill}
                  fillOpacity={0.45}
                  ifOverflow="extendDomain"
                />
                <ReferenceArea
                  x1={cliffStart}
                  x2={cliffEnd}
                  fill={C.cliffFill}
                  fillOpacity={0.9}
                  ifOverflow="extendDomain"
                />
                <ReferenceArea
                  x1={cliffEnd}
                  x2={120000}
                  fill={C.transFill}
                  fillOpacity={0.5}
                  ifOverflow="extendDomain"
                />
              </>
            ) : (
              <ReferenceArea
                x1={0}
                x2={120000}
                fill={C.safeFill}
                fillOpacity={0.35}
              />
            )}

            <XAxis
              type="number"
              dataKey="income"
              domain={[0, 120000]}
              ticks={[0, 20000, 40000, 60000, 80000, 100000, 120000]}
              tickFormatter={(v: number) => `$${v / 1000}k`}
              tick={{ fontSize: 11, fill: C.muted, fontFamily: "system-ui" }}
              tickLine={false}
              axisLine={{ stroke: C.grid }}
            >
              <Label
                value="Gross wages"
                position="bottom"
                offset={8}
                style={{ fontSize: 11, fill: C.secondary, fontWeight: 600 }}
              />
            </XAxis>
            <YAxis
              type="number"
              domain={[yMin, "auto"]}
              tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
              tick={{ fontSize: 11, fill: C.muted, fontFamily: "system-ui" }}
              tickLine={false}
              axisLine={false}
              width={44}
            />

            {/* Wages-only reference — quiet dashed diagonal. The gap between this
                and the take-home line IS the benefit value. */}
            <Line
              type="linear"
              dataKey="wages"
              stroke={C.wagesRef}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
              legendType="none"
            />

            {/* The take-home cliff line — STEP function, no smoothing. */}
            <Line
              type="stepAfter"
              dataKey="effective"
              stroke={C.line}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: C.line }}
              isAnimationActive={!reduced}
              animationDuration={reduced ? 0 : 200}
              animationEasing="linear"
            />

            {/* Steepest-drop annotation, placed at the cliff. */}
            {cliffAnnotation && (
              <ReferenceLine
                x={cliffAnnotation.midIncome}
                stroke="transparent"
              >
                <Label
                  value={`−$${cliffAnnotation.dropAmount.toLocaleString("en-US")}${
                    cliffAnnotation.cause ? ` · ${cliffAnnotation.cause}` : ""
                  }`}
                  position="insideTopRight"
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    fill: "var(--color-negative-delta)",
                  }}
                />
              </ReferenceLine>
            )}

            {/* Markers — dashed verticals with inline labels (no internal legend). */}
            <ReferenceLine
              x={currentIncome}
              stroke={C.blue}
              strokeWidth={1.5}
              strokeDasharray="6 4"
            >
              <Label
                value={`You now · $${currentIncome.toLocaleString("en-US")}`}
                position="insideBottomLeft"
                angle={-90}
                style={{ fontSize: 11, fontWeight: 600, fill: C.blue }}
              />
            </ReferenceLine>
            <ReferenceLine
              x={offeredIncome}
              stroke={C.violet}
              strokeWidth={1.5}
              strokeDasharray="6 4"
            >
              <Label
                value={`Offer · $${offeredIncome.toLocaleString("en-US")}`}
                position="insideTopLeft"
                angle={-90}
                style={{ fontSize: 11, fontWeight: 600, fill: C.violet }}
              />
            </ReferenceLine>
            {safeExit !== null && (
              <ReferenceLine
                x={safeExit}
                stroke={C.green}
                strokeWidth={1.5}
                strokeDasharray="4 3"
              >
                <Label
                  value={`Safe exit · $${safeExit.toLocaleString("en-US")}`}
                  position="insideTopRight"
                  angle={-90}
                  style={{ fontSize: 11, fontWeight: 600, fill: C.green }}
                />
              </ReferenceLine>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Inline marker key (caption row, not an in-chart legend). */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-md)",
          marginTop: "var(--space-sm)",
        }}
      >
        <MarkerKey color={C.blue} label="You now" />
        <MarkerKey color={C.violet} label="Offer" />
        {safeExit !== null && <MarkerKey color={C.green} label="Safe exit" />}
        <MarkerKey color={C.wagesRef} label="Wages only" dashed />
      </div>
    </section>
  );
}

function MarkerKey({
  color,
  label,
  dashed,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "var(--type-caption)",
        color: "var(--color-text-secondary)",
      }}
    >
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: 14,
          height: 0,
          borderTop: dashed
            ? `1.5px dashed ${color}`
            : `2px solid ${color}`,
        }}
      />
      {label}
    </span>
  );
}
