/**
 * Landing page (task-117) — the premium, motion-first marketing surface.
 *
 * Server component. Computes ALL numbers from the engine at build time (hero
 * scenarios + the hidden-math cliff curve) and passes them to client components
 * — zero hand-typed cliff/stat numbers anywhere on the page. Renders the full
 * scroll narrative from DESIGN-DIRECTION.md §11 in order:
 *   1 Hero · 2 Hidden math · 3 Why it happens · 4 The injustice ·
 *   5 Proof · 6 Methodology teaser · 7 Final CTA.
 *
 * Chrome (header/trust badge/footer) is inherited from app/layout via SiteChrome
 * and is NOT re-implemented here. Warm-light, amber-as-accent, reserved colours
 * for financial meaning only.
 */
import { getHeroScenarios } from "@/lib/engine/scenarios";
import { getCliffData } from "@/lib/engine/takeHome";
import { RotatingHero } from "@/components/hero/RotatingHero";
import { HeroBackdrop } from "@/components/landing/HeroBackdrop";
import { Section } from "@/components/landing/Section";
import { Reveal } from "@/components/landing/Reveal";
import { CtaButton } from "@/components/landing/CtaButton";
import {
  MiniCliffChart,
  type CliffPoint,
  type CliffMeta,
} from "@/components/landing/MiniCliffChart";

/**
 * Build the hidden-math cliff visual data from the engine. Uses the canonical
 * Ohio family-of-4 curve, narrowed to the band around the cliff, and derives the
 * drop annotation from the steepest single-step fall — never hand-typed.
 */
function buildHiddenMath(): {
  points: CliffPoint[];
  meta: CliffMeta;
  raiseSize: number;
} {
  const raw = getCliffData({ familySize: 4, state: "OH", adultCount: 2 });
  // Narrow to a readable band around the cliff (30k–90k).
  const band = raw.filter((p) => p.income >= 30000 && p.income <= 90000);
  const points: CliffPoint[] = band.map((p) => ({
    income: p.income,
    effective: p.totalEffective,
  }));

  // Steepest single $1k step = the cliff edge. Derived, not typed.
  let cliffStartIncome = points[0].income;
  let cliffEndIncome = points[1].income;
  let dropAmount = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const step = points[i + 1].effective - points[i].effective;
    if (step < dropAmount) {
      dropAmount = step;
      cliffStartIncome = points[i].income;
      cliffEndIncome = points[i + 1].income;
    }
  }

  // The "earn $X more, lose $Y" framing: drop across a small raise straddling
  // the cliff. Window = $4k. Both numbers engine-derived.
  const startIdx = points.findIndex((p) => p.income === cliffStartIncome);
  const windowEndIdx = Math.min(startIdx + 4, points.length - 1);
  const raiseSize = points[windowEndIdx].income - points[startIdx].income;
  const windowDrop =
    points[startIdx].effective - points[windowEndIdx].effective;

  return {
    points,
    meta: {
      cliffStartIncome,
      cliffEndIncome,
      dropAmount: Math.abs(windowDrop),
    },
    raiseSize,
  };
}

export default function Home() {
  const scenarios = getHeroScenarios();
  const { points, meta, raiseSize } = buildHiddenMath();

  return (
    <>
      {/* ───────── 1 · HERO — the gut punch ───────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "var(--color-warm-white)",
          padding: "clamp(56px, 11vw, 120px) var(--space-md) clamp(48px, 9vw, 96px)",
        }}
      >
        <HeroBackdrop />
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
          <Reveal as="p" delay={0} style={leadKicker}>
            A raise should never make you poorer.
          </Reveal>

          <Reveal delay={80} style={{ marginTop: "var(--space-md)" }}>
            <RotatingHero scenarios={scenarios} />
          </Reveal>

          <Reveal as="p" delay={160} style={{ ...lead, marginTop: "var(--space-lg)" }}>
            Benefits cliffs are hidden income traps — points where earning a
            little more leaves you with a lot less. Most people never see them
            coming.
          </Reveal>

          <Reveal
            delay={240}
            style={{
              marginTop: "var(--space-xl)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "var(--space-md)",
            }}
          >
            <CtaButton href="/tool" size="lg">
              Check your own number →
            </CtaButton>
            <span style={reassure}>
              Free · 60 seconds · your data never leaves your phone.
            </span>
          </Reveal>
        </div>
      </section>

      {/* ───────── 2 · THE HIDDEN MATH — show the cliff ───────── */}
      <Section bg="trust" width="wide">
        <div className="cc-two-col">
          <div style={{ minWidth: 0 }}>
            <Reveal as="h2" style={sectionHeading}>
              It&rsquo;s not a glitch. It&rsquo;s the math.
            </Reveal>
            <Reveal as="p" delay={80} style={{ ...body, marginTop: "var(--space-md)" }}>
              Earn{" "}
              <strong className="tabular-nums" style={{ fontWeight: 700 }}>
                ${raiseSize.toLocaleString()}
              </strong>{" "}
              more, and your real take-home can fall by{" "}
              <strong
                className="tabular-nums"
                style={{ fontWeight: 700, color: "var(--color-negative-delta)" }}
              >
                ${meta.dropAmount.toLocaleString()}
              </strong>
              . Several benefits drop away at once, all in the same narrow band of
              income — so a small raise can wipe out far more than it adds.
            </Reveal>
            <Reveal as="p" delay={160} style={{ ...bodyMuted, marginTop: "var(--space-md)" }}>
              The math is real, and it&rsquo;s deliberately hard to find. CliffCheck
              drags it into the light.
            </Reveal>
          </div>
          <Reveal delay={120} style={chartCard}>
            <MiniCliffChart points={points} meta={meta} />
          </Reveal>
        </div>
      </Section>

      {/* ───────── 3 · WHY THIS HAPPENS — the mechanism ───────── */}
      <Section bg="cream">
        <Reveal as="h2" style={sectionHeading}>
          Why a raise can cost you
        </Reveal>
        <Reveal as="p" delay={80} style={{ ...lead, marginTop: "var(--space-md)" }}>
          You don&rsquo;t lose one benefit. You lose several at the same time.
        </Reveal>
        <Reveal as="p" delay={160} style={{ ...body, marginTop: "var(--space-md)" }}>
          Food help, health coverage, child care, rent support, the tax credits
          for working families — each one fades out as your income climbs. The
          problem is that they fade on overlapping schedules, stacked into the
          same few thousand dollars. Cross that band and the supports collapse
          together, faster than your paycheck grows. The system was never built to
          let you climb out smoothly.
        </Reveal>
      </Section>

      {/* ───────── 4 · THE INJUSTICE — the inequality framing ───────── */}
      <Section bg="deep">
        <Reveal as="h2" style={{ ...sectionHeadingLg, maxWidth: "16ch" }}>
          The trap is by design — not by you.
        </Reveal>
        <Reveal as="p" delay={100} style={{ ...lead, marginTop: "var(--space-lg)" }}>
          A working family can be held in place by a few thousand dollars of
          support, terrified that a promotion will make things worse. Meanwhile,
          at the very top, wealth compounds untouched — no cliff, no penalty for
          earning more, only acceleration.
        </Reveal>
        <Reveal as="p" delay={180} style={{ ...body, marginTop: "var(--space-md)" }}>
          That isn&rsquo;t a personal failing. It&rsquo;s a structure that rewards
          the people who already have the most and quietly punishes the people
          trying to climb. You deserve to see the whole board before you make your
          move.
        </Reveal>
      </Section>

      {/* ───────── 5 · PROOF — it's real and people care ───────── */}
      <Section bg="warm-white">
        <Reveal as="h2" style={sectionHeading}>
          People felt this in their gut
        </Reveal>
        <Reveal delay={100} style={{ ...proofCard, marginTop: "var(--space-lg)" }}>
          <p style={proofStat}>
            Front page of{" "}
            <span style={{ color: "var(--color-text-primary)", fontWeight: 700 }}>
              r/ohio
            </span>
          </p>
          <p style={{ ...body, margin: "var(--space-sm) 0 0" }}>
            One post showing the cliff math climbed to the top of the subreddit
            and was shared{" "}
            <strong className="tabular-nums" style={{ fontWeight: 700 }}>
              300+
            </strong>{" "}
            times — from people who recognised their own paycheck in the numbers.
          </p>
        </Reveal>
      </Section>

      {/* ───────── 6 · THE DATA IS REAL — methodology teaser ───────── */}
      <Section bg="trust">
        <Reveal as="h2" style={sectionHeading}>
          Every number comes from the source
        </Reveal>
        <Reveal as="p" delay={80} style={{ ...body, marginTop: "var(--space-md)" }}>
          The figures here aren&rsquo;t third-party guesses. They come straight
          from government sources — USDA for food help, IRS for tax credits, HUD
          for rent support, and Medicaid for health coverage. We show our work.
        </Reveal>
        <Reveal delay={140} style={{ marginTop: "var(--space-lg)" }}>
          <a href="#methodology" style={quietLink}>
            See the methodology →
          </a>
        </Reveal>
      </Section>

      {/* ───────── 7 · ACT — final CTA ───────── */}
      <Section bg="cream">
        <Reveal as="h2" style={sectionHeadingLg}>
          Find your safe number.
        </Reveal>
        <Reveal as="p" delay={100} style={{ ...lead, marginTop: "var(--space-md)" }}>
          See your own cliff in 60 seconds — free, private, and your data never
          leaves your phone. Walk away with a number you can take to your manager.
        </Reveal>
        <Reveal delay={180} style={{ marginTop: "var(--space-xl)" }}>
          <CtaButton href="/tool" size="lg">
            Check your own number →
          </CtaButton>
        </Reveal>
      </Section>
    </>
  );
}

// ── Shared inline style objects (system fonts, tokens only) ─────────────────

const leadKicker: React.CSSProperties = {
  margin: 0,
  fontSize: "var(--type-subheading)",
  fontWeight: 600,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
  color: "var(--color-cta-hover-amber)",
};

const lead: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(1.05rem, 2.4vw, 1.25rem)",
  fontWeight: 400,
  lineHeight: 1.6,
  color: "var(--color-text-secondary)",
  maxWidth: "42ch",
};

const body: React.CSSProperties = {
  margin: 0,
  fontSize: "var(--type-body)",
  lineHeight: 1.7,
  color: "var(--color-text-secondary)",
  maxWidth: "60ch",
};

const bodyMuted: React.CSSProperties = {
  ...body,
  color: "var(--color-text-muted)",
};

const sectionHeading: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
  fontWeight: 700,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
  color: "var(--color-text-primary)",
};

const sectionHeadingLg: React.CSSProperties = {
  ...sectionHeading,
  fontSize: "clamp(2rem, 4.2vw, 3.25rem)",
  fontWeight: 800,
  letterSpacing: "-0.03em",
};

const reassure: React.CSSProperties = {
  fontSize: "var(--type-caption)",
  color: "var(--color-text-muted)",
  lineHeight: 1.5,
};

const chartCard: React.CSSProperties = {
  backgroundColor: "var(--color-surface-white)",
  border: "1px solid var(--color-border-stone)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--elevation-float)",
  padding: "var(--space-lg)",
};

const proofCard: React.CSSProperties = {
  backgroundColor: "var(--color-surface-cream)",
  border: "1px solid var(--color-border-stone)",
  borderRadius: "var(--radius-lg)",
  padding: "var(--space-lg)",
  maxWidth: 560,
};

const proofStat: React.CSSProperties = {
  margin: 0,
  fontSize: "var(--type-heading)",
  fontWeight: 600,
  color: "var(--color-text-secondary)",
};

const quietLink: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
  fontSize: "var(--type-subheading)",
  fontWeight: 600,
  color: "var(--color-cta-hover-amber)",
  textDecoration: "none",
};
