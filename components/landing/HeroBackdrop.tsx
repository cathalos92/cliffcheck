"use client";

/**
 * HeroBackdrop — the restrained background motif behind the hero
 * (DESIGN-DIRECTION.md §11.1, §9 parallax). An abstract cliff-curve line drawn
 * in chart-line/amber, subtly parallaxed: it drifts ≤40px slower than scroll for
 * depth. Off under prefers-reduced-motion (no transform). Decorative only —
 * aria-hidden, sits behind content, never an amber wall (low opacity).
 */
import { useEffect, useState } from "react";

export function HeroBackdrop() {
  const [offset, setOffset] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Drift slower than scroll, capped at ~40px.
        setOffset(Math.min(window.scrollY * 0.18, 40));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        transform: reduced ? "none" : `translateY(${offset}px)`,
        transition: reduced ? "none" : "transform 80ms linear",
      }}
    >
      <svg
        viewBox="0 0 1200 600"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, opacity: 0.5 }}
      >
        {/* An abstract cliff curve: rise, then a sharp drop, then recovery. */}
        <path
          d="M -50 470 L 280 470 L 280 300 L 560 300 L 560 470 L 720 470 L 720 360 L 980 360 L 980 250 L 1250 250"
          fill="none"
          stroke="var(--color-border-stone)"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {/* The drop, picked out faintly in amber as the signal. */}
        <path
          d="M 560 300 L 560 470"
          fill="none"
          stroke="var(--color-brand-amber)"
          strokeWidth={3}
          opacity={0.35}
        />
      </svg>
    </div>
  );
}
