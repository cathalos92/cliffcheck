/**
 * Header — shared app chrome (DESIGN-DIRECTION.md §12, DESIGN.md header spec).
 *
 * Minimal by design: wordmark left, one quiet link to the tool right. No nav
 * clutter, no menu. Warm-light only — trust-surface background, hairline stone
 * bottom border. The amber accent appears only in the wordmark's "Check", never
 * as a fill. 56px tall (DESIGN.md), sticky so the brand + privacy promise stay
 * present as the user scrolls the marketing narrative.
 */
export function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--space-md)",
        backgroundColor: "color-mix(in srgb, var(--color-trust-surface) 92%, transparent)",
        backdropFilter: "saturate(140%) blur(8px)",
        WebkitBackdropFilter: "saturate(140%) blur(8px)",
        borderBottom: "1px solid var(--color-border-stone)",
      }}
    >
      <a
        href="/"
        aria-label="CliffCheck — home"
        style={{
          display: "inline-flex",
          alignItems: "center",
          fontSize: "16px",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: "var(--color-text-primary)",
          textDecoration: "none",
        }}
      >
        Cliff<span style={{ color: "var(--color-brand-amber)" }}>Check</span>
      </a>

      <a
        href="/tool"
        className="cc-header-link"
        style={{
          display: "inline-flex",
          alignItems: "center",
          minHeight: 44,
          padding: "0 var(--space-sm)",
          fontSize: "var(--type-subheading)",
          fontWeight: 600,
          color: "var(--color-text-secondary)",
          textDecoration: "none",
          borderRadius: "var(--radius-md)",
          transition: "color var(--motion-fast) var(--ease-standard)",
        }}
      >
        Check your number →
      </a>
    </header>
  );
}
