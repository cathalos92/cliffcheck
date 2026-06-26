/**
 * Placeholder home page — scaffold proof only (task-105).
 *
 * Intentionally ZERO real UI: no calculator, hero, chart, or landing sections.
 * This exists solely to prove the CliffCheck design tokens render. Real UI lands
 * in later re-platform cycles (calculator island, rotating hero, landing shell).
 * Styled only via the design tokens defined in app/globals.css.
 */
export default function Home() {
  return (
    <main
      style={{
        minHeight: "100dvh",
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
    </main>
  );
}
