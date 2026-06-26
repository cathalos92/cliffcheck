---
name: CliffCheck
description: Phone-first benefits cliff navigator that shows working-class Americans the hidden math trapping them below the poverty line — and the exact income target to escape it.
colors:
  warm-white: "#FAFAF9"
  surface-white: "#FFFFFF"
  surface-cream: "#FFF7ED"
  border-stone: "#E7E5E4"
  trust-surface: "#F5F5F4"
  brand-amber: "#F59E0B"
  cta-hover-amber: "#D97706"
  text-primary: "#1C1917"
  text-secondary: "#57534E"
  text-muted: "#A8A29E"
  safe-green: "#16A34A"
  cliff-red: "#DC2626"
  transition-amber: "#D97706"
  current-income-blue: "#2563EB"
  offered-income-violet: "#7C3AED"
  positive-delta: "#15803D"
  negative-delta: "#B91C1C"
  chart-safe-fill: "#DCFCE7"
  chart-cliff-fill: "#FEF2F2"
  chart-transition-fill: "#FFFBEB"
  chart-line: "#44403C"
  cliff-alert-bg: "#FEF2F2"
  safe-exit-bg: "#F0FDF4"
typography:
  display:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0"
  subheading:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0"
  body:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  caption:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.brand-amber}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "0 24px"
    height: "48px"
  input-field:
    backgroundColor: "{colors.warm-white}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    height: "48px"
    padding: "0 12px"
  cliff-alert-card:
    backgroundColor: "{colors.cliff-alert-bg}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "20px"
  safe-exit-card:
    backgroundColor: "{colors.safe-exit-bg}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "20px"
  manager-brief-card:
    backgroundColor: "{colors.surface-cream}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.lg}"
    padding: "24px"
  trust-badge:
    backgroundColor: "{colors.trust-surface}"
    textColor: "{colors.text-muted}"
    height: "56px"
---

## Overview

CliffCheck is a phone-first single-column tool. The layout is a vertical scroll: input form → cliff chart → result cards → manager brief. There is no sidebar, no navigation bar, no multi-column layout. The primary viewport is 375px (iPhone SE / budget Android). Max content width is 540px, centered on larger screens.

**Spacing** uses a 4px base grid. Key gaps: within form fields 8–12px; between form fields 16px; form-to-chart 32px (the chart is the hero, not an extension of the form); chart-to-result-cards 24px; card internal padding 20px; between result cards 16px; between major sections 40px.

**Motion** is intentionally minimal — this is a financial tool for stressed people. Sanctioned motion only: chart redraws on income change (200ms max, no easing beyond linear), live summary strip updates on keypress. No skeleton loaders (data is computed locally, instant). No number ticker animations on results — financial numbers must be read accurately, not watched count up. No entrance animations on cards. Hover states only on interactive elements — never on static text or chart areas. Respect `prefers-reduced-motion`.

**Screen structure (top to bottom):**
1. Header bar (56px, `{colors.trust-surface}`) — app name + trust signal
2. Input form — full-width inputs, no submit button, live update
3. Live summary strip — single-line rolling result, `{colors.trust-surface}` bg
4. Cliff chart — hero, full width, 2:1 aspect, Chart.js canvas
5. Cliff alert + safe exit cards — stacked on mobile, side-by-side on wide screens
6. Manager brief card — cream bg, copy-to-clipboard
7. Footer — muted, small, state coverage notice

## Colors

### Primary
- **Brand Amber** (#F59E0B): primary buttons, active states, focus rings on inputs — the brand's signal color
- **CTA Hover Amber** (#D97706): button hover state; also used for transition/phase-out zones on the cliff chart
- **Warm White** (#FAFAF9): page background — warm, not cold, not clinical
- **Surface Cream** (#FFF7ED): result cards, manager brief background — warm cream for positive/neutral surfaces

### Secondary
- **Safe Green** (#16A34A): safe income zones on chart strokes and safe exit card borders; positive delta values
- **Cliff Red** (#DC2626): cliff drop zones on chart strokes and cliff alert card borders; negative delta values
- **Current Income Blue** (#2563EB): "You are here" vertical marker on chart — ONLY use here
- **Offered Income Violet** (#7C3AED): "Offer" vertical marker on chart — ONLY use here
- **Positive Delta** (#15803D): "+$X" values in text (darker green for text contrast)
- **Negative Delta** (#B91C1C): "−$X" values in text (darker red for text contrast)

### Tertiary
- **Chart Safe Fill** (#DCFCE7): background fill for safe growth zones on cliff chart
- **Chart Cliff Fill** (#FEF2F2): background fill for cliff drop zones; also cliff alert card background
- **Chart Transition Fill** (#FFFBEB): background fill for phase-out slope zones
- **Chart Line** (#44403C): primary effective-income line on cliff chart, 2.5px, no smoothing
- **Cliff Alert Background** (#FEF2F2): cliff alert card background
- **Safe Exit Background** (#F0FDF4): safe exit card background

### Neutral
- **Surface White** (#FFFFFF): cards, input backgrounds
- **Trust Surface** (#F5F5F4): header bar, trust badge, live summary strip
- **Border Stone** (#E7E5E4): card edges, dividers, input borders
- **Text Primary** (#1C1917): headlines, labels, result values — never pure black
- **Text Secondary** (#57534E): descriptions, metadata, manager brief prose
- **Text Muted** (#A8A29E): helper text, trust signals, captions, axis labels

## Typography

System stack only (`system-ui, -apple-system, sans-serif`). No custom font loading — target users are on cheap Android phones with variable font rendering. Fast and readable is the priority.

**Scale:**
- **Display** (clamp 2.5–3.5rem, weight 800, line-height 1.1): effective take-home totals, cliff delta hero number. Must be the only element visible when you blur your eyes — squint test.
- **Heading** (18–22px, weight 700, line-height 1.3): card titles, form section labels
- **Subheading** (14–16px, weight 600, line-height 1.4): field labels, chart annotations, nav items
- **Body** (14–15px, weight 400, line-height 1.6): descriptions, manager brief prose — generous line-height for financial information
- **Caption** (12–13px, weight 400, line-height 1.5): helper text, trust signals, axis labels

**Rules:**
- `font-variant-numeric: tabular-nums` on all dollar values — columns must align
- Numbers representing money: minimum `font-weight: 600`
- Every metric uses a two-layer pattern: Caption/muted label above, Display/bold/colored value below — the number is ALWAYS larger and bolder than its label
- No monospace on labels, descriptions, or result values
- Minimum readable size: 12px. Touch targets: 44px minimum.

## Elevation

CliffCheck uses a flat surface hierarchy with one level of card elevation.

- **Page background** (`{colors.warm-white}`): base layer
- **Cards and inputs** (`{colors.surface-white}`): one step up, 1px `{colors.border-stone}` border, `{rounded.lg}`. No drop shadows — warmth comes from color, not shadow.
- **Manager brief** (`{colors.surface-cream}`): same level as cards but uses cream to signal it's an artifact, not just a section
- **Trust badge / header / summary strip** (`{colors.trust-surface}`): persistent chrome, stone-100

Do NOT nest cards inside cards. Maximum two surface levels visible at any time.

## Components

### Input Field
Full width on mobile. 48px tall. `{colors.surface-white}` background, `{colors.border-stone}` border, `{rounded.lg}`. Label (14px, `{colors.text-secondary}`, weight 600) sits above the input — never placeholder-only. Helper text (12px, `{colors.text-muted}`) below. Focus ring: 2px solid `{colors.brand-amber}` — never blue focus rings. Currency inputs: format with commas on blur, strip commas on focus.

### Primary Button
`{colors.brand-amber}` background, `{colors.text-primary}` text (weight 700), 48px tall, `{rounded.lg}`, full-width on mobile. Hover: `{colors.cta-hover-amber}`. No cold blue buttons anywhere.

### Cliff Alert Card
`{colors.cliff-alert-bg}` background, 1px red-200 border, `{rounded.lg}`, 20px padding. Icon: warning symbol in `{colors.cliff-red}`. Headline (16px, `{colors.text-primary}`, weight 700): "Taking this raise costs you −$8,400/yr". Supporting line (14px, `{colors.text-secondary}`): itemized benefit losses.

### Safe Exit Card
`{colors.safe-exit-bg}` background, 1px green-200 border, `{rounded.lg}`, 20px padding. Icon: arrow in `{colors.safe-green}`. Headline (16px, `{colors.text-primary}`, weight 700): "Safe exit: $82,000/yr". Supporting line (14px, `{colors.text-secondary}`): plain-English target statement.

### Manager Brief Card
`{colors.surface-cream}` background, 1px `{colors.border-stone}` border, `{rounded.lg}`, 24px padding. Body: 14–15px, `{colors.text-secondary}`, line-height 1.6. CTA: "Copy brief" button — amber-500 bg, stone-900 text, full-width on mobile. Never ship an empty brief — if no cliff exists, output "No cliff detected. This raise improves your total value."

### Trust Badge
`{colors.trust-surface}` background, 1px `{colors.border-stone}` border-bottom, 56px tall. Caption text (12px, `{colors.text-muted}`, centered): "Your data stays on this device — nothing is sent anywhere." Always visible at top of page, above all content.

### Cliff Chart
Full screen width on mobile, 2:1 aspect ratio, legible at 375px. Chart.js canvas. X-axis: $0–$120k labeled every $20k (11px, `{colors.text-muted}`, no rotation). Y-axis: effective take-home in dollars. Primary line: `{colors.chart-line}` at 2.5px, no smoothing — benefit cliffs are step functions, not curves. Background zone fills behind the line using chart fill colors. Markers: current income (vertical dashed `{colors.current-income-blue}`, labeled "You now: $X"), offered income (vertical dashed `{colors.offered-income-violet}`, labeled "Offer: $X"), safe exit (vertical dashed `{colors.safe-green}`, labeled "Safe exit: $X" — only shown when cliff exists). No legend inside the chart — use annotated line labels instead.

## Do's and Don'ts

### Do's
- **Show the number first, explain second.** The cliff delta and safe exit are the heroes — every other element exists to support them.
- **Update results live as the user types.** No submit button, no loading state on input change. Data is computed locally; answers are instant.
- **Show the trust badge at all times.** "Your data stays on this device" must be visible above the fold, always.
- **Use concrete dollars over percentages.** "$4,200 in lost SNAP" is always more powerful than "34% benefit reduction."
- **Keep cliff lines sharp.** Benefit cliffs are step functions — draw them accurately with no bezier smoothing.
- **Name the system.** Copy says "this raise triggers a cliff" not "you earn too much."
- **Show monthly figures in parentheses** when displaying annual amounts for context.
- **Use `font-variant-numeric: tabular-nums`** on all dollar values.
- **Bold all money amounts** (minimum weight 600).
- **Include the cliff alert and safe exit cards** below every chart — a chart without context has failed.

### Don'ts
- **Never use cold blue** (`#3B82F6`, `#2563EB`) anywhere except the "current income" chart marker. Blue is reserved.
- **Never use a submit/calculate button.** The form updates live.
- **Never show a percentage when a dollar amount is available.**
- **Never smooth the cliff chart** with bezier curves.
- **Never use amber as a solid large-area fill.** Amber is for buttons and thin UI accents only. Use cream (`{colors.surface-cream}`) for card fills.
- **Never nest cards inside cards.** Two surface levels maximum.
- **Never build multi-column layout at 375px.** Single column, full-width.
- **Never place the trust signal below the fold.** It must be visible on first paint.
- **Never ship a chart without the cliff alert and safe exit cards below it.**
- **Never use `font-mono` on labels, descriptions, or result values.**
- **Never use green or red for decorative purposes.** Both colors carry specific financial meaning.
- **Never omit the `/yr` label** on annual dollar amounts.
- **Never use pure black (`#000`).** `{colors.text-primary}` (#1C1917) is the maximum.
- **Never build a screen that requires explanation before it's understood.**
- **Never add user accounts, login prompts, or email capture** — ever.
- **Never use placeholder-only inputs** for financial data fields.
