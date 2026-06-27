"use client";

/**
 * CtaButton — the amber primary CTA (DESIGN.md primary button, DESIGN-DIRECTION.md
 * §9/§12). Amber bg, ink text, weight 700, 48px, generous tap target. Hover lifts
 * (translateY −2px) + shadow deepen; press scales 0.98 over --motion-fast. All
 * transforms are neutralised under prefers-reduced-motion by globals.css.
 *
 * Renders as a link (the CTA navigates to the tool). Amber is the signal — used
 * sparingly, never a large wall (DESIGN.md). `size="lg"` for the hero/final CTA.
 */
import { useState } from "react";

export function CtaButton({
  href,
  children,
  size = "md",
}: {
  href: string;
  children: React.ReactNode;
  size?: "md" | "lg";
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);

  const lg = size === "lg";

  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPress(false);
      }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: lg ? 56 : 48,
        padding: lg ? "0 32px" : "0 24px",
        fontSize: lg ? "17px" : "15px",
        fontWeight: 700,
        color: "var(--color-text-primary)",
        backgroundColor: hover
          ? "var(--color-cta-hover-amber)"
          : "var(--color-brand-amber)",
        borderRadius: "var(--radius-lg)",
        textDecoration: "none",
        boxShadow: hover ? "var(--elevation-float)" : "var(--elevation-card)",
        transform: press
          ? "scale(0.98)"
          : hover
            ? "translateY(-2px)"
            : "translateY(0)",
        transition:
          "transform var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard), background-color var(--motion-fast) var(--ease-standard)",
      }}
    >
      {children}
    </a>
  );
}
