/**
 * TrustBadge — the always-visible privacy promise (DESIGN.md "Trust Badge",
 * DESIGN-DIRECTION.md §12). Privacy is a feature, not fine print: this strip
 * sits directly under the header, above all content, on first paint.
 *
 * Spec (DESIGN.md): trust-surface background, 1px stone bottom border, 56px
 * tall, muted caption text, centred. Copy is exact and must not change — it is
 * the trust contract.
 */
export function TrustBadge() {
  return (
    <div
      role="note"
      style={{
        minHeight: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-xs) var(--space-md)",
        backgroundColor: "var(--color-trust-surface)",
        borderBottom: "1px solid var(--color-border-stone)",
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "var(--type-caption)",
          lineHeight: 1.5,
          color: "var(--color-text-muted)",
        }}
      >
        Your data stays on this device — nothing is sent anywhere.
      </p>
    </div>
  );
}
