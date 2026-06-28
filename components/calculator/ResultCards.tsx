"use client";

/**
 * ResultCards — the cliff alert + safe exit (DESIGN.md Cliff Alert / Safe Exit
 * cards, DESIGN-DIRECTION.md §13). The loss is the hero: a big negative-delta
 * number, with the itemised monthly benefit losses below. The safe exit names
 * the income where the household clears every cliff, in plain language.
 *
 * NEVER ships empty: when there's no cliff, a calm green card confirms the raise
 * genuinely improves total value (DESIGN.md fallback copy). No motion on numbers.
 */
import type { DerivedResults } from "./derive";
import { fmtDollars, fmtMonthly } from "./derive";

export function ResultCards({ results }: { results: DerivedResults }) {
  const { diff, isWorse, safeExit, breakdown, offered } = results;

  // No cliff: a single reassuring card — never an empty surface.
  if (!isWorse) {
    return (
      <SafeCard>
        <p style={headlineGreen}>This raise leaves you better off</p>
        <p style={bodyText}>
          The offer takes you to{" "}
          <strong style={{ color: "var(--color-positive-delta)" }}>
            {fmtDollars(offered.totalEffective)}/yr
          </strong>{" "}
          in real take-home —{" "}
          {diff > 0 ? (
            <strong style={{ color: "var(--color-positive-delta)" }}>
              {fmtDollars(diff)}/yr more
            </strong>
          ) : (
            "about the same as"
          )}{" "}
          than today. No cliff in your way.
        </p>
      </SafeCard>
    );
  }

  return (
    <>
      {/* Cliff alert — the loss as a big negative-delta number. */}
      <section
        aria-label="Cliff alert"
        style={{
          backgroundColor: "var(--color-cliff-alert-bg)",
          border: "1px solid #FECACA",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-lg)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "var(--type-caption)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "var(--color-negative-delta)",
          }}
        >
          Taking this offer costs you
        </p>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: "clamp(2.25rem, 9vw, 3.25rem)",
            fontWeight: 800,
            lineHeight: 1,
            color: "var(--color-negative-delta)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          −{fmtDollars(Math.abs(diff))}
          <span
            style={{
              fontSize: "var(--type-heading)",
              fontWeight: 600,
              color: "var(--color-negative-delta)",
            }}
          >
            /yr
          </span>
        </p>
        <p
          style={{
            margin: "var(--space-xs) 0 0",
            fontSize: "var(--type-body)",
            color: "var(--color-text-secondary)",
            lineHeight: 1.6,
          }}
        >
          That&apos;s {fmtMonthly(Math.abs(diff))}/mo. Your benefits fall away
          faster than the raise adds.
        </p>

        {breakdown.length > 0 && (
          <ul
            style={{
              margin: "var(--space-md) 0 0",
              padding: "var(--space-md) 0 0",
              borderTop: "1px solid #FECACA",
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {breakdown.map((b) => {
              // A "loss" is a benefit falling (delta<0) or a cost rising (delta>0).
              const isLoss = b.isCost ? b.delta > 0 : b.delta < 0;
              const sign = b.delta < 0 ? "−" : "+";
              return (
                <li
                  key={b.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "var(--type-subheading)",
                    fontWeight: 600,
                    color: isLoss
                      ? "var(--color-negative-delta)"
                      : "var(--color-text-muted)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  <span style={{ fontWeight: 400 }}>{b.label}</span>
                  <span>
                    {sign}${Math.abs(b.delta).toLocaleString("en-US")}/mo
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Safe exit — the way out. */}
      {safeExit !== null ? (
        <SafeCard>
          <p style={subLabelGreen}>Your safe exit</p>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: "clamp(1.75rem, 7vw, 2.5rem)",
              fontWeight: 800,
              lineHeight: 1,
              color: "var(--color-positive-delta)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {fmtDollars(safeExit)}
            <span
              style={{
                fontSize: "var(--type-heading)",
                fontWeight: 600,
              }}
            >
              /yr
            </span>
          </p>
          <p style={bodyText}>
            The first income past every cliff where you stay ahead of today for
            good. Aim past the dip — not just over it.
          </p>
        </SafeCard>
      ) : (
        <SafeCard>
          <p style={headlineGreen}>There&apos;s no clean way over this one yet</p>
          <p style={bodyText}>
            At every income up to $120k, the benefits you&apos;d lose outweigh the
            raise. Holding your current wages keeps more in your pocket — or push
            for an offer well above the cliff.
          </p>
        </SafeCard>
      )}
    </>
  );
}

function SafeCard({ children }: { children: React.ReactNode }) {
  return (
    <section
      aria-label="Safe exit"
      style={{
        backgroundColor: "var(--color-safe-exit-bg)",
        border: "1px solid #BBF7D0",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-lg)",
      }}
    >
      {children}
    </section>
  );
}

const headlineGreen: React.CSSProperties = {
  margin: 0,
  fontSize: "var(--type-heading)",
  fontWeight: 700,
  color: "var(--color-positive-delta)",
};

const subLabelGreen: React.CSSProperties = {
  margin: 0,
  fontSize: "var(--type-caption)",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--color-positive-delta)",
};

const bodyText: React.CSSProperties = {
  margin: "var(--space-xs) 0 0",
  fontSize: "var(--type-body)",
  lineHeight: 1.6,
  color: "var(--color-text-secondary)",
};
