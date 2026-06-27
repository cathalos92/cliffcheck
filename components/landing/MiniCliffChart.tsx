"use client";

/**
 * MiniCliffChart — the compact, engine-fed cliff visual for the "hidden math"
 * section (DESIGN-DIRECTION.md §11.2, §13). Presentational only: the page
 * computes the curve from the engine (getCliffData) and passes points in. This
 * component never computes money — it draws what it's given.
 *
 * Renders a stepAfter line (no bezier smoothing — cliffs are step functions,
 * DESIGN.md) as an SVG, with the cliff drop highlighted in cliff-red and the
 * pre-cliff safe stretch tinted with the safe-zone fill. The drop's size is
 * annotated. The path "draws in" on scroll-reveal via a stroke-dashoffset
 * transition; under reduced-motion the global safety net renders it instantly.
 *
 * No count-up, no decorative motion — the chart reveals, the numbers are static
 * and accurate (the "Oh Shit" payload reads in 5 seconds).
 */
import { useEffect, useRef, useState } from "react";

export interface CliffPoint {
  income: number;
  effective: number;
}

export interface CliffMeta {
  /** Income just before the steepest drop. */
  cliffStartIncome: number;
  /** Income just after the steepest drop. */
  cliffEndIncome: number;
  /** The effective-take-home drop across the cliff (positive number). */
  dropAmount: number;
}

const W = 520;
const H = 320;
const PAD = { top: 24, right: 20, bottom: 36, left: 20 };

export function MiniCliffChart({
  points,
  meta,
}: {
  points: CliffPoint[];
  meta: CliffMeta;
}) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [len, setLen] = useState(0);
  const [draw, setDraw] = useState(false);

  const incomes = points.map((p) => p.income);
  const effs = points.map((p) => p.effective);
  const minX = Math.min(...incomes);
  const maxX = Math.max(...incomes);
  const minY = Math.min(...effs) * 0.96;
  const maxY = Math.max(...effs) * 1.04;

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const sx = (x: number) => PAD.left + ((x - minX) / (maxX - minX)) * plotW;
  const sy = (y: number) => PAD.top + (1 - (y - minY) / (maxY - minY)) * plotH;

  // stepAfter path: hold the value, then drop/rise at the next x.
  let d = "";
  points.forEach((p, i) => {
    const X = sx(p.income);
    const Y = sy(p.effective);
    if (i === 0) {
      d += `M ${X} ${Y}`;
    } else {
      const prevY = sy(points[i - 1].effective);
      d += ` L ${X} ${prevY} L ${X} ${Y}`;
    }
  });

  const cliffX1 = sx(meta.cliffStartIncome);
  const cliffX2 = sx(meta.cliffEndIncome);

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, [d]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDraw(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} style={{ width: "100%" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label={`A cliff chart: effective take-home rises with income, then drops by about $${meta.dropAmount.toLocaleString()} at the cliff before recovering.`}
        style={{ display: "block" }}
      >
        {/* Cliff danger band */}
        <rect
          x={cliffX1}
          y={PAD.top}
          width={Math.max(cliffX2 - cliffX1, 2)}
          height={plotH}
          fill="var(--color-chart-cliff-fill)"
        />
        {/* Safe stretch before the cliff */}
        <rect
          x={PAD.left}
          y={PAD.top}
          width={cliffX1 - PAD.left}
          height={plotH}
          fill="var(--color-chart-safe-fill)"
          opacity={0.5}
        />
        {/* The effective-income line (no smoothing) */}
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="var(--color-chart-line)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          style={{
            strokeDasharray: len || undefined,
            strokeDashoffset: draw ? 0 : len || undefined,
            transition: len
              ? "stroke-dashoffset 1100ms var(--ease-out)"
              : undefined,
          }}
        />
        {/* Drop marker */}
        <line
          x1={cliffX2}
          y1={sy(points.find((p) => p.income >= meta.cliffStartIncome)?.effective ?? minY)}
          x2={cliffX2}
          y2={sy(points.find((p) => p.income >= meta.cliffEndIncome)?.effective ?? minY)}
          stroke="var(--color-cliff-red)"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
        {/* X axis income labels (no rotation) */}
        {[minX, (minX + maxX) / 2, maxX].map((x) => (
          <text
            key={x}
            x={sx(x)}
            y={H - 12}
            textAnchor="middle"
            fontSize={11}
            fill="var(--color-text-muted)"
          >
            ${Math.round(x / 1000)}k
          </text>
        ))}
      </svg>
      <p
        style={{
          margin: "var(--space-xs) 0 0",
          textAlign: "center",
          fontSize: "var(--type-caption)",
          color: "var(--color-text-muted)",
        }}
      >
        Effective take-home as income rises. The{" "}
        <span style={{ color: "var(--color-negative-delta)", fontWeight: 600 }}>
          red band
        </span>{" "}
        is where a raise makes you poorer.
      </p>
    </div>
  );
}
