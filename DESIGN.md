---
name: YOOX Grupo Financiero
description: Premium dark fintech system for agent-led loan and collections management — Banker's Cobalt on Midnight Ledger navy.
colors:
  primary: "#2563eb"
  primary-dark: "#1e40af"
  accent: "#3b82f6"
  accent-glow: "rgba(59, 130, 246, 0.35)"
  bg: "#0b1120"
  bg-elevated: "#111827"
  bg-deep: "#020617"
  surface: "#1e293b"
  surface-hover: "#243449"
  text: "#f8fafc"
  text-muted: "#94a3b8"
  border: "rgba(148, 163, 184, 0.18)"
  shadow-header: "rgba(0, 0, 0, 0.25)"
  shadow-deep: "rgba(0, 0, 0, 0.35)"
  star-gold: "#fbbf24"
  ops-surface: "#ffffff"
  ops-bg: "#f8f9fa"
  ops-border: "#dee2e6"
  ops-text: "#495057"
  ops-text-muted: "#6c757d"
  status-success: "#4caf50"
  status-warning: "#ff9800"
  status-info: "#2196f3"
  status-danger: "#f44336"
typography:
  display:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  display-sm:
    fontFamily: "Poppins, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Poppins, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title-lg:
    fontFamily: "Poppins, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
  title:
    fontFamily: "Poppins, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
  title-sm:
    fontFamily: "Poppins, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
  subtitle:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  body-lg:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label-lg:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
  label-sm:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
  icon:
    fontSize: "1.5rem"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  lg2: "16px"
  xl: "20px"
  xxl: "24px"
  pill: "9999px"
  circle: "50%"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.xl}"
    padding: "32px"
  card-elevated:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.xxl}"
    padding: "32px"
  chip:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.lg}"
    padding: "10px 8px"
  chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
  tag:
    rounded: "{rounded.sm}"
    padding: "4px 8px"
---

# Design System: YOOX Grupo Financiero

## Overview

**Creative North Star: "The Private Bank Desk"**

The system is the calm, polished workspace of a private banker: deep navy surfaces, everything within reach, quiet confidence in every number. It is premium, sophisticated, and exclusive — confidence, seriousness, calm control — while staying institutionally warm, formal but not cold (es-MX). Nothing shouts; the one bright element on a dark screen is the action the user came to take.

Two worlds coexist by design. The **public world** (landing, request-status) is the full expression of the North Star: Midnight Ledger navy, Banker's Cobalt actions, Poppins headlines, tactile glowing CTAs. The **internal ops world** (dashboard, loan-request, pagos, cobro-agenda) runs on PrimeNG `lara-light-blue` light defaults — white cards, gray table chrome — because agent efficiency outranks expression there. The confirmed direction (PRODUCT.md): the cobalt identity is the committed palette, a light counterpart to the dark theme will be added, and the legacy purple gradient is retired.

**Key Characteristics:**
- Dark-first public surfaces; light, table-dense internal ops surfaces.
- One cobalt voice for actions; everything else stays neutral navy until touched.
- Tactile and confident components: every control answers hover with lift, glow, or border.
- Flat at rest — depth appears only as CTA glow, one floating card, and hover feedback.
- Poppins for headings and numbers, Inter for everything the reader parses.

## Colors

A two-blue system over a five-step navy ramp: cobalt acts, signal blue highlights, navy carries.

### Primary
- **Banker's Cobalt** (#2563eb): the only fill for primary buttons, active chips, and active tab indicators. Reserved for actions and selected states.
- **Deep Cobalt** (#1e40af): the dark end of the 135° primary-button gradient; hover deepening for cobalt fills.

### Secondary
- **Signal Blue** (#3b82f6): highlights, focus rings, active text, hairline dividers, and the glow behind the primary CTA. Never a large-area fill, never body text.
- **Signal Glow** (rgba(59, 130, 246, 0.35)): reserved for ambient radial washes at 12–18% opacity on the hero. Never a box-shadow — cast depth is always neutral (see The Flat-At-Rest Rule).

### Tertiary
- **Star Gold** (#fbbf24): testimonial star ratings only — a conventional trust symbol, never an action or status color.

### Neutral
- **Midnight Ledger** (#0b1120): page background of the public world.
- **Elevated Ink** (#111827): raised regions — alternating sections, chip rests.
- **Ledger Abyss** (#020617): the darkest step; footer only.
- **Ledger Slate** (#1e293b): card and container surfaces.
- **Slate Hover** (#243449): surface state on hover; nothing else uses it.
- **Paper White** (#f8fafc): primary text on dark.
- **Fog Slate** (#94a3b8): muted text, subtitles, inactive tabs and chips.
- **Hairline Slate** (rgba(148, 163, 184, 0.18)): the single border color of the dark world.

### Ops palette (internal, light)
White (#ffffff) cards on Cool Gray (#f8f9fa) backgrounds, Cool Border (#dee2e6) dividers, Slate Ink (#495057) table headings, Muted Gray (#6c757d) secondary text. Governed by PrimeNG `lara-light-blue`; keep it out of the dark public world.

### Status (ops)
- **Success Green** (#4caf50), **Warning Amber** (#ff9800), **Info Blue** (#2196f3), **Danger Red** (#f44336): semantic statuses in tables, tags, and agenda indicators. This set is fixed; no new status hues.

### Named Rules
**The One Voice Rule.** Banker's Cobalt is the only action fill on any screen, used on ≤10% of the surface. Its rarity is the point — if everything is cobalt, nothing is actionable.

**The Signal Discipline Rule.** Signal Blue directs attention: focus rings, active labels, glows, hairlines. It never fills areas and never sets paragraphs.

## Typography

**Display Font:** Poppins (with system sans-serif fallback)
**Body Font:** Inter (with -apple-system, BlinkMacSystemFont, Segoe UI, Roboto fallback)
**Label/Mono Font:** none — Inter serves all labels

**Character:** Poppins carries the institutional voice — geometric, assured, set tight and heavy. Inter does the reading work — quiet, highly legible, never decorative. The pairing feels like a bank statement designed by people who respect the reader.

### Hierarchy
- **Display** (800, clamp(2.25rem, 5vw, 3.5rem), line-height 1.1, -0.03em): hero titles only; one per screen. Mobile floor is the 2rem step under 768px.
- **Headline** (800, clamp(1.875rem, 4vw, 2.75rem), line-height 1.15, -0.02em): section titles.
- **Title large** (700–800, 1.75rem): product titles, hero stat numbers.
- **Title** (700, 1.375rem): calculator title, product-detail titles.
- **Title small** (700, 1.25rem): card titles, header wordmark, calculator loan value.
- **Subtitle** (400, 1.125rem, line-height 1.6–1.7): section subtitles, calculator result values, feature h4s, footer wordmark.
- **Body large** (400–600, 1.05rem): large buttons, testimonial quotes; mobile hero subtitle.
- **Body** (400, 1rem, line-height 1.6–1.7): paragraphs, FAQ content.
- **Label large** (600, 0.9375rem): tab buttons, footer contact lines.
- **Label** (600, 0.875rem): form labels, stat labels, chips.
- **Fine print** (400, 0.75rem): range labels, calculator note; ops tags tighten to this step at 600 weight.
- **Icon glyphs** size at 1.375–1.5rem via font-size inside medallions.

### Named Rules
**The Two Voices Rule.** Poppins (700–800) speaks for headings, numerals, and the wordmark; Inter (400–600) speaks for everything the reader parses. Never set paragraphs in Poppins or headlines in Inter.

**The Tight Headline Rule.** Negative tracking (-0.02em to -0.03em) belongs only to 800-weight Poppins at display/headline sizes. Buttons, labels, and body stay at normal spacing.

## Layout

The public world centers on a 1200px container with 1.5rem side padding. Sections breathe at 6rem vertical padding (hero opens at 10rem top / 8rem bottom) and alternate Midnight Ledger / Elevated Ink backgrounds, separated by a 1px Signal Blue gradient hairline at 35% opacity. Section headers center within 680px with 3.5rem bottom margin; the FAQ narrows to 800px.

The hero is a two-column grid (1fr 1fr, 4rem gap): narrative left, the floating Loan Calculator Card (max-width 420px) right. Benefit cards auto-fit at minmax(260px, 1fr) with 1.5rem gaps. At 768px the hero stacks, stats go vertical, and secondary header actions drop; 480px handles small phones. Ops screens are fluid PrimeFlex layouts: full-width tables with 0.75–1rem cell padding, cards at 2rem padding, horizontal scroll under 768px.

## Elevation & Depth

Ambient, never decorative. Surfaces are flat at rest; depth is spent only where it directs attention or confirms interaction. The dark world layers tonally (Midnight Ledger → Elevated Ink → Ledger Slate) before it ever reaches for a shadow.

### Shadow Vocabulary
- **CTA Rest** (`0 1px 2px rgba(2, 6, 23, 0.6), 0 6px 16px rgba(2, 6, 23, 0.45)`): resting state of the primary button — neutral ambient depth keyed to Ledger Abyss, never a colored glow.
- **CTA Rest Hover** (`0 2px 4px rgba(2, 6, 23, 0.6), 0 12px 28px rgba(2, 6, 23, 0.5)`): same neutral shadow, expanded on hover, paired with the -2px lift; on active both collapse to `0 1px 2px rgba(2, 6, 23, 0.6)`.
- **Float Deep** (`0 24px 60px rgba(0, 0, 0, 0.35)`): reserved for the one floating element per screen (the calculator card).
- **Header Scroll** (`0 8px 30px rgba(0, 0, 0, 0.25)`): appears only when the fixed header meets scrolled content.
- **Ops Card** (`0 2px 4px rgba(0, 0, 0, 0.1)`): the single, subtle shadow of the light internal world.
- **Focus Ring** (`0 0 0 4px rgba(59, 130, 246, 0.2)` on ops controls; 2px Signal Blue outline with 3px offset on public controls).

### Named Rules
**The Flat-At-Rest Rule.** No surface carries a shadow by default. Depth appears only as: the primary button's neutral ambient shadow, one floating card per screen, and hover-lift feedback. If everything floats, nothing does. Colored glow shadows are an anti-pattern — depth is keyed to Ledger Abyss, never to Signal Blue.

## Shapes

Radius scales with containment — the more an element holds, the rounder it gets. Actions are fully round: buttons are pills (9999px). Containers are generously curved: cards at 20px (benefit) to 24px (calculator). Inset blocks and icon medallions sit at 16px (calculator result, FAQ items, benefit icons). Choice elements sit at 12px (term chips). The ops world runs tighter: 8px cards, 4px tags. Circles (50%) are reserved for icon medallion fills and avatars. Borders are hairlines — 1px Hairline Slate, 1.5px on outline buttons, 3px only for the active tab indicator.

**The Radius Hierarchy Rule.** Pill for actions, 20–24px for containers, 16px for inset blocks and medallions, 12px for choices, 4–8px for data. Never mix steps within one element family.

## Components

### Buttons
Tactile and confident: fully round, visibly physical, always answering the pointer.
- **Shape:** pill (9999px), semibold (600), padding 0.875rem 1.75rem (large: 1rem 2rem at 1.05rem).
- **Primary:** 135° gradient from Banker's Cobalt to Deep Cobalt, white text, resting CTA Rest shadow; hover lifts -2px and expands the shadow; active presses flat.
- **Outline:** transparent, 1.5px Hairline Slate border, Paper White text; hover fills Ledger Slate and shifts the border to Signal Blue.
- **Focus:** 2px Signal Blue outline, 3px offset. All state changes transition at 0.2s ease.

### Chips (term options)
- **Style:** Elevated Ink fill, Fog Slate text, 1px hairline, 12px radius, compact padding (0.625rem 0.5rem), semibold 0.875rem.
- **State:** hover gains Signal Blue border and Paper White text; active flips to a solid Banker's Cobalt fill with white text.

### Cards / Containers
- **Corner Style:** 20px standard, 24px when floating.
- **Background:** Ledger Slate with a 1px Hairline Slate border.
- **Shadow Strategy:** flat at rest (see The Flat-At-Rest Rule); the floating variant carries Float Deep.
- **Hover:** benefit cards lift -6px and gain a Signal Blue border.
- **Internal Padding:** 2rem (1.5rem on mobile).

### Inputs / Fields
- **Public:** the range slider is the signature input — custom Signal Blue thumb that grows a deeper glow on hover, paired with a Poppins 700 loan value. PrimeNG fields keep `lara-light-blue` geometry on ops screens.
- **Focus:** 2px Signal Blue outline (public) or the 4px blue ring (ops PrimeNG).
- **Error / Disabled:** PrimeNG theme behavior; no custom treatment documented yet.

### Navigation
- **Public header:** fixed, 85% Midnight Ledger with 12px backdrop blur; on scroll it deepens to 96% opacity, gains the hairline border and Header Scroll shadow. Wordmark is Poppins 600 with an 800 Signal Blue `strong`; actions are pill buttons (the outline one hides under 768px).
- **Tab bar (products):** text tabs on a 3px bottom indicator; inactive tabs are Fog Slate, hover lifts to Paper White over Slate Hover, active is Signal Blue on a subtle tinted rest.

### Tags & Tables (ops)
- **Tags:** 4px radius, 0.75rem semibold, tight padding (0.25rem 0.5rem), colored by the fixed status set.
- **Tables:** Cool Gray (#f8f9fa) header row with Slate Ink 600 labels and a 2px bottom border; 1px row dividers; row hover tints Cool Gray. Paginator is white with a top hairline.

### Loan Calculator Card (signature)
The hero's floating instrument: Ledger Slate, 24px radius, Float Deep shadow, 2rem padding. A labeled amount row pairs the range slider with a right-aligned Poppins 700 MXN value; term chips sit in a grid; the result block lists label/value rows in Inter with 700 values. It is the only element on the page allowed to cast a deep shadow — the desk's one object under a lamp.

## Do's and Don'ts

### Do:
- **Do** reserve Banker's Cobalt for primary actions and active states (The One Voice Rule); let everything else stay navy-neutral until touched.
- **Do** give every interactive element a visible hover — lift, border shift, or glow — on a 0.2s ease transition.
- **Do** use pill radius on actions, 20–24px on cards, 12px on choice chips (The Radius Hierarchy Rule).
- **Do** keep the two worlds separate: dark navy for public surfaces, PrimeNG light for internal ops, until the committed light-mode counterpart is designed as a system.
- **Do** format money as MXN via `Intl.NumberFormat('es-MX')` and dates in es-MX — financial data must read identically on every screen.

### Don't:
- **Don't** reintroduce the legacy purple gradient (#667eea → #764ba2). It survives only on the 404 page and is superseded by the cobalt pair; migrate it when that page is next touched.
- **Don't** fill large areas with Signal Blue or set body text in it (The Signal Discipline Rule).
- **Don't** add shadows to resting surfaces or float more than one element per screen (The Flat-At-Rest Rule).
- **Don't** introduce new status hues; the ops set (green/amber/blue/red) is fixed.
- **Don't** set body copy in Poppins, headlines in Inter, or revive the leftover Roboto / Segoe UI stacks still referenced by `mat-typography` and old components.
