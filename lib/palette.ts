/**
 * lib/palette.ts — THE single source of truth for every CliffCheck colour value.
 *
 * Change a value in `CANON` below, run `npm run gen:palette`, and the token
 * surface in app/globals.css regenerates in lock-step. The generated block is
 * delimited by `/* @palette:<id> start *​/ … /* @palette:<id> end *​/` markers;
 * only the lines between markers are rewritten. Everything else in the file
 * (base styles, @theme, media queries) is hand-authored and untouched.
 *
 * CANON is CliffCheck's own token canon — the warm stone/amber + chart-zone
 * palette defined in DESIGN.md frontmatter. This is build-time generation only;
 * do NOT add a runtime theming system here. (Pattern ported from PapiUI; values
 * are CliffCheck's own — no PAPI plum.)
 *
 * CI guard: `npm run palette:check` regenerates and `git diff --exit-code`s the
 * target, so the tokens can never silently drift from this source.
 */

/**
 * The CliffCheck canon — warm stone/amber base plus the chart-zone semantics.
 * ONE definition, referenced by the token block below. This is the map you edit
 * to recolour CliffCheck. Values verified against DESIGN.md frontmatter.
 */
export const CANON = {
  // Surfaces — warm, not clinical
  warmWhite: '#FAFAF9', // page background
  surfaceWhite: '#FFFFFF', // cards, inputs
  surfaceCream: '#FFF7ED', // result cards, manager brief
  trustSurface: '#F5F5F4', // header, trust badge, summary strip
  borderStone: '#E7E5E4', // card edges, dividers, input borders

  // Brand — the signal colour
  brandAmber: '#F59E0B', // primary buttons, active states, focus rings
  ctaHoverAmber: '#D97706', // button hover; chart transition/phase-out zones

  // Text — never pure black
  textPrimary: '#1C1917', // headlines, labels, result values
  textSecondary: '#57534E', // descriptions, metadata, brief prose
  textMuted: '#A8A29E', // helper text, trust signals, captions, axis labels

  // Financial semantics — green safe, red cliff (never decorative)
  safeGreen: '#16A34A', // safe zones on chart strokes, safe exit borders
  cliffRed: '#DC2626', // cliff drop zones on chart strokes, cliff alert borders
  positiveDelta: '#15803D', // "+$X" values in text (darker green for contrast)
  negativeDelta: '#B91C1C', // "−$X" values in text (darker red for contrast)

  // Chart markers — reserved, single-use
  currentIncomeBlue: '#2563EB', // "You are here" marker — ONLY here
  offeredIncomeViolet: '#7C3AED', // "Offer" marker — ONLY here

  // Chart zone fills + line
  chartSafeFill: '#DCFCE7', // safe growth zones
  chartCliffFill: '#FEF2F2', // cliff drop zones (also cliff alert bg)
  chartTransitionFill: '#FFFBEB', // phase-out slope zones
  chartLine: '#44403C', // primary effective-income line, no smoothing

  // Card backgrounds
  cliffAlertBg: '#FEF2F2', // cliff alert card background
  safeExitBg: '#F0FDF4', // safe exit card background
} as const;

/**
 * One token line. `c` = a comment-only line (section header). A `[name, value]`
 * tuple emits `--name: value;`, with an optional third element as an inline
 * `/* comment *​/`.
 */
type Tok = { c: string } | [name: string, value: string] | [name: string, value: string, comment: string];

function renderBlock(tokens: Tok[], indent: string): string {
  const lines = tokens.map((t) => {
    if ('c' in t) return `${indent}/* ${t.c} */`;
    const [name, value, comment] = t;
    return `${indent}--${name}: ${value};${comment ? `  /* ${comment} */` : ''}`;
  });
  // Body sits between the start- and end-marker lines: each line carries its
  // own indent and a trailing newline lands us at the end-marker's indent.
  return `${lines.join('\n')}\n`;
}

// ── app/globals.css :root token block ────────────────────────────────────────

const globalsRoot: Tok[] = [
  { c: 'CliffCheck canon — warm stone/amber + chart-zone semantics (DESIGN.md)' },
  { c: 'Surfaces' },
  ['color-warm-white', CANON.warmWhite, 'page background'],
  ['color-surface-white', CANON.surfaceWhite, 'cards, inputs'],
  ['color-surface-cream', CANON.surfaceCream, 'result cards, manager brief'],
  ['color-trust-surface', CANON.trustSurface, 'header, trust badge, summary strip'],
  ['color-border-stone', CANON.borderStone, 'card edges, dividers, input borders'],
  { c: 'Brand — the signal colour' },
  ['color-brand-amber', CANON.brandAmber, 'primary buttons, active states, focus rings'],
  ['color-cta-hover-amber', CANON.ctaHoverAmber, 'button hover; chart transition zones'],
  { c: 'Text — never pure black' },
  ['color-text-primary', CANON.textPrimary],
  ['color-text-secondary', CANON.textSecondary],
  ['color-text-muted', CANON.textMuted],
  { c: 'Financial semantics — green safe, red cliff (never decorative)' },
  ['color-safe-green', CANON.safeGreen],
  ['color-cliff-red', CANON.cliffRed],
  ['color-positive-delta', CANON.positiveDelta, '"+$X" text — darker green for contrast'],
  ['color-negative-delta', CANON.negativeDelta, '"−$X" text — darker red for contrast'],
  { c: 'Chart markers — reserved, single-use' },
  ['color-current-income-blue', CANON.currentIncomeBlue, '"You are here" marker ONLY'],
  ['color-offered-income-violet', CANON.offeredIncomeViolet, '"Offer" marker ONLY'],
  { c: 'Chart zone fills + line' },
  ['color-chart-safe-fill', CANON.chartSafeFill],
  ['color-chart-cliff-fill', CANON.chartCliffFill],
  ['color-chart-transition-fill', CANON.chartTransitionFill],
  ['color-chart-line', CANON.chartLine, 'primary effective-income line, no smoothing'],
  { c: 'Card backgrounds' },
  ['color-cliff-alert-bg', CANON.cliffAlertBg],
  ['color-safe-exit-bg', CANON.safeExitBg],
];

/**
 * Every generated region, keyed by `file → markerId → renderer`. The generator
 * (scripts/gen-palette.ts) walks this map, splices each region between its
 * markers, and writes the file back. Indent matches each file's nesting.
 */
export const REGIONS: Record<string, Record<string, () => string>> = {
  'app/globals.css': {
    root: () => renderBlock(globalsRoot, '  '),
  },
};
