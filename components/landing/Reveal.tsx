"use client";

/**
 * Reveal — scroll-reveal wrapper (DESIGN-DIRECTION.md §9 marketing motion).
 *
 * Elements enter with opacity 0→1 + translateY 20px→0 over --motion-base,
 * --ease-out, via IntersectionObserver. Reveal-once: once shown, it stays (no
 * re-animate on scroll-up). `delay` staggers siblings (60–80ms steps).
 *
 * Reduced-motion: under prefers-reduced-motion we render visible immediately
 * with no transform and no transition (the global safety net in globals.css
 * also neutralises any transition that slips through).
 */
import { useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  style,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  // Progressive enhancement: render VISIBLE by default so content is never
  // blank without JS (crawlers, JS failure, slow hydration). Only below-fold
  // elements get "armed" to opacity:0 after mount — they're off-screen, so no
  // visible flash — then revealed on scroll. Above-fold content stays visible
  // (the hero has its own motion). Reduced-motion: never arm.
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) return; // already visible at load — leave it, no flash

    setArmed(true);
    setShown(false);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(20px)",
        transition: armed
          ? `opacity var(--motion-base) var(--ease-out) ${delay}ms, transform var(--motion-base) var(--ease-out) ${delay}ms`
          : "none",
        ...style,
      }}
    >
      {children}
    </Component>
  );
}
