/**
 * Footer — shared app chrome (DESIGN-DIRECTION.md §12, DESIGN.md footer spec).
 *
 * Muted and small. Carries the state-coverage note, a quiet "Built with PAPI"
 * (→ getpapi.ai) and a "Source on GitHub" link. CliffCheck's own voice — NO
 * plum, NO PAPI-branded chrome. Warm-light, hairline stone top border, no fill.
 * Links are quiet (muted) and lift to primary on hover (CSS in globals.css).
 */
export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border-stone)",
        backgroundColor: "var(--color-trust-surface)",
        padding: "var(--space-xl) var(--space-md)",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-md)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "var(--type-caption)",
            lineHeight: 1.6,
            color: "var(--color-text-secondary)",
          }}
        >
          Coverage is Ohio today, with more states on the way. Every number comes
          straight from government sources — USDA, IRS, HUD, and Medicaid.
        </p>

        <nav
          aria-label="Footer"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "var(--space-md)",
          }}
        >
          <a
            href="https://github.com/cathalos92/cliffcheck"
            target="_blank"
            rel="noopener noreferrer"
            className="cc-footer-link"
            style={footerLink}
          >
            Source on GitHub
          </a>
          <a
            href="https://getpapi.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="cc-footer-link"
            style={footerLink}
          >
            Built with PAPI
          </a>
        </nav>

        <p
          style={{
            margin: 0,
            fontSize: "var(--type-caption)",
            color: "var(--color-text-muted)",
          }}
        >
          CliffCheck is an information tool, not financial or legal advice.
        </p>
      </div>
    </footer>
  );
}

const footerLink: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  fontSize: "var(--type-caption)",
  fontWeight: 600,
  color: "var(--color-text-muted)",
  textDecoration: "none",
  transition: "color var(--motion-fast) var(--ease-standard)",
};
