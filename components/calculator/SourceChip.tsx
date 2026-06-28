"use client";

/**
 * SourceChips — quiet provenance captions beside the benefit math (DESIGN.md
 * "Source chips", DESIGN-DIRECTION.md §13). Minimal this cycle: each chip names a
 * program + its government source from getStateSources, linking out where a URL
 * exists. The differentiator is calm credibility — "every number comes from a
 * gov source" — so the chips are muted, never loud.
 */
import type { Source } from "@/lib/engine";

export function SourceChips({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;

  return (
    <section
      aria-label="Data sources"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-xs)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "var(--type-caption)",
          fontWeight: 600,
          color: "var(--color-text-muted)",
        }}
      >
        Every number comes from a government source
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {sources.map((s) => (
          <Chip key={s.program} source={s} />
        ))}
      </div>
    </section>
  );
}

function Chip({ source }: { source: Source }) {
  const content = (
    <>
      {source.label}
      {source.url && (
        <span aria-hidden style={{ color: "var(--color-text-muted)" }}>
          {" ↗"}
        </span>
      )}
    </>
  );

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "4px 10px",
    fontSize: "var(--type-caption)",
    color: "var(--color-text-secondary)",
    backgroundColor: "var(--color-trust-surface)",
    border: "1px solid var(--color-border-stone)",
    borderRadius: "999px",
    textDecoration: "none",
  };

  if (source.url) {
    return (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        style={base}
      >
        {content}
      </a>
    );
  }
  return <span style={base}>{content}</span>;
}
