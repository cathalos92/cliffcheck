"use client";

/**
 * RotatingHero — the gut-punch hero (DESIGN-DIRECTION.md §11.1, §9 rotating hero).
 *
 * Renders the big engine-driven stat line ("A $26,000 raise at $44,000 in Ohio
 * would leave you $9,754 poorer.") with the loss number huge in negative-delta
 * red, rotating through curated scenarios. The server page computes scenarios
 * via getHeroScenarios and passes them in — this component never computes money.
 *
 * Motion (§9): crossfade opacity + slight translateY over --motion-slow, holding
 * each ~3.5s; pauses on hover/focus. Under prefers-reduced-motion the swap is
 * instant (no transform) and rotation pauses entirely — read accurately, never
 * watched. No count-up: the number reveals via opacity, never ticks up.
 */
import { useEffect, useRef, useState } from "react";
import type { HeroScenario } from "@/lib/engine/scenarios";

const HOLD_MS = 3500;
const FADE_MS = 480; // mirrors --motion-slow

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function RotatingHero({ scenarios }: { scenarios: HeroScenario[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const timers = useRef<number[]>([]);

  const multi = scenarios.length > 1;

  useEffect(() => {
    if (!multi || paused) return;

    // Reduced motion: instant swap, no fade choreography.
    if (reduced) {
      const id = window.setInterval(() => {
        setIndex((i) => (i + 1) % scenarios.length);
      }, HOLD_MS);
      return () => window.clearInterval(id);
    }

    // Standard: hold, fade out, swap, fade in.
    const clearAll = () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
    const cycle = () => {
      const hold = window.setTimeout(() => {
        setVisible(false);
        const swap = window.setTimeout(() => {
          setIndex((i) => (i + 1) % scenarios.length);
          setVisible(true);
          cycle();
        }, FADE_MS);
        timers.current.push(swap);
      }, HOLD_MS);
      timers.current.push(hold);
    };
    cycle();
    return clearAll;
  }, [multi, paused, reduced, scenarios.length]);

  const s = scenarios[index];
  if (!s) return null;

  // The loss number is the largest, red element. "poorer" sits below it so the
  // number gets the full width and never overflows 375px even at $XX,XXX.
  const lossNumber = `$${s.cost.toLocaleString()}`;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      tabIndex={multi ? 0 : -1}
      aria-live="polite"
      aria-label={`${s.headline} ${
        multi ? "Rotating through real scenarios — focus to pause." : ""
      }`}
      style={{ outline: "none" }}
    >
      <div
        style={{
          opacity: reduced ? 1 : visible ? 1 : 0,
          transform: reduced || visible ? "translateY(0)" : "translateY(8px)",
          transition: reduced
            ? "none"
            : `opacity var(--motion-slow) var(--ease-out), transform var(--motion-slow) var(--ease-out)`,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "clamp(2rem, 5.5vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.06,
            letterSpacing: "-0.03em",
            color: "var(--color-text-primary)",
            maxWidth: "16ch",
          }}
        >
          A{" "}
          <span className="tabular-nums">${s.raise.toLocaleString()}</span> raise
          at{" "}
          <span className="tabular-nums">${s.atIncome.toLocaleString()}</span> in{" "}
          {s.stateLabel} would leave you
        </p>
        <p
          className="tabular-nums"
          style={{
            margin: "var(--space-sm) 0 0",
            // Scales to the viewport so even $XX,XXX fits at 375px without
            // overflow, while staying the largest thing on the page on desktop.
            fontSize: "clamp(2.75rem, 15vw, 6rem)",
            fontWeight: 800,
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
            color: "var(--color-negative-delta)",
            whiteSpace: "nowrap",
          }}
        >
          −{lossNumber}
        </p>
        <p
          style={{
            margin: "2px 0 0",
            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "var(--color-negative-delta)",
          }}
        >
          poorer.
        </p>
      </div>
    </div>
  );
}
