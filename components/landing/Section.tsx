/**
 * Section — a full-bleed marketing section (DESIGN-DIRECTION.md §5, §10).
 *
 * Full-bleed background colour (warm-white / cream / trust-surface to chapter the
 * narrative) with a centred content column. `width="prose"` caps at 720px for
 * headlines/prose; `width="wide"` allows ~1100px for asymmetric feature/proof
 * blocks. Section padding is the larger marketing rhythm (64–96px desktop,
 * 48–64px mobile via clamp). Server component — no client JS.
 */
export function Section({
  children,
  bg = "warm-white",
  width = "prose",
  id,
}: {
  children: React.ReactNode;
  bg?: "warm-white" | "cream" | "trust" | "deep";
  width?: "prose" | "wide";
  id?: string;
}) {
  const bgColor =
    bg === "cream"
      ? "var(--color-surface-cream)"
      : bg === "trust"
        ? "var(--color-trust-surface)"
        : bg === "deep"
          ? "#FBEFD9" // a deeper warm than cream — weightier, still warm (§7)
          : "var(--color-warm-white)";

  return (
    <section
      id={id}
      style={{
        backgroundColor: bgColor,
        padding: "clamp(48px, 9vw, 96px) var(--space-md)",
      }}
    >
      <div
        style={{
          maxWidth: width === "wide" ? 1100 : 720,
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </section>
  );
}
