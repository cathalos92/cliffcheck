/**
 * Placeholder home page — chrome/shell proof only (task-116).
 *
 * Intentionally minimal: the real landing (rotating hero + scroll narrative) is
 * task-117, the calculator is task-118. This placeholder renders inside the
 * shared SiteChrome shell (Header + TrustBadge + Footer, wired in app/layout)
 * so the cohesive frame can be reviewed. Styled only via the design tokens in
 * app/globals.css.
 */
export default function Home() {
  return (
    <div
      style={{
        minHeight: "60dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-sm)",
        padding: "var(--space-lg)",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "var(--type-display)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          color: "var(--color-text-primary)",
          margin: 0,
        }}
      >
        Cliff<span style={{ color: "var(--color-brand-amber)" }}>Check</span>
      </h1>
      <p
        style={{
          fontSize: "var(--type-subheading)",
          color: "var(--color-text-secondary)",
          maxWidth: "32ch",
          margin: 0,
        }}
      >
        The hidden math behind benefits cliffs — and the exact income to escape one.
      </p>
    </div>
  );
}
