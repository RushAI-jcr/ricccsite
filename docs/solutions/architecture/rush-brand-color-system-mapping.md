---
title: "Mapping the Rush Digital Brand Guide to Tailwind CSS v4 + shadcn/ui"
category: architecture
tags:
  - brand-system
  - tailwind-css
  - design-tokens
  - rush-brand
  - color-palette
modules:
  - globals.css
  - tailwind-theme
severity: medium
date: 2026-03-21
status: implemented
---

# Mapping Rush Brand Colors to Tailwind CSS v4 + shadcn/ui

## Problem

The RICCC Lab website needed to use the official Rush institutional brand colors from the "Rush Digital Quick Guide" PDF. The initial implementation used incorrect colors (blues from an older style guide, then guessed greens from the logo). The official guide specifies a precise palette with 3 tiers (Primary, Secondary, Tertiary) and specific button styles.

## Root Cause

The Rush brand guide PDF was referenced in the original PRD but never read during initial implementation. Colors were guessed from the RICCC logo and a Perplexity-generated PRD, resulting in two rounds of incorrect colors before the official guide was consulted.

## Solution

### Official Rush Color Palette (from Rush Digital Quick Guide)

**Primary (use most):**
| Name | Hex | Tailwind Token | Usage |
|------|-----|----------------|-------|
| Growth Green - Digital | `#006332` | `rush-green` | Nav, hero, headings, primary CTAs |
| Legacy Green | `#00A66C` | `rush-teal` | Links, secondary buttons, accents |
| Vitality Green | `#5FEEA2` | `rush-emerald` | Highlights, badges, decorative |
| Black | `#0C0C0C` | `rush-charcoal` | Body text |

**Secondary:**
| Name | Hex | Tailwind Token | Usage |
|------|-----|----------------|-------|
| Green | `#00A66C` | (same as Legacy) | Secondary buttons |
| Wash Green | `#9AEFC2` | `rush-wash-green` | Light backgrounds |
| Raw Umber | `#5F5858` | `rush-umber` | Muted text |
| Wash Gray | `#A59F9F` | `rush-mid-gray` | Secondary text |
| Gray | `#EAEAEA` | `rush-light-gray` | Borders, backgrounds |

**Tertiary (sparingly):**
| Name | Hex | Tailwind Token | Usage |
|------|-----|----------------|-------|
| Sage | `#DFF9EB` | `rush-sage` | Section alternation |
| Ivory | `#FFFBEC` | `rush-ivory` | Page background |
| Cerulean Blue | `#54ADD3` | — | Not used (tertiary) |
| Deep Blue | `#00668E` | — | Not used (tertiary) |
| Indigo | `#1E1869` | — | Not used (tertiary) |

### Mapping to Tailwind v4 `@theme inline`

In `globals.css`, Rush colors are exposed as both:
1. **Direct tokens** (`rush-green`, `rush-teal`, etc.) for explicit brand use
2. **shadcn/ui semantic tokens** (`--primary`, `--accent`, etc.) for component integration

```css
@theme inline {
  --color-rush-green: #006332;    /* Growth Green */
  --color-rush-teal: #00A66C;     /* Legacy Green */
  --color-rush-emerald: #5FEEA2;  /* Vitality Green */
  --color-rush-ivory: #FFFBEC;
  --color-rush-sage: #DFF9EB;
  --color-rush-charcoal: #0C0C0C;
  --color-rush-mid-gray: #A59F9F;
  --color-rush-umber: #5F5858;
  --color-rush-light-gray: #EAEAEA;
}

:root {
  --primary: #006332;     /* Growth Green → CTAs, nav */
  --accent: #00A66C;      /* Legacy Green → links */
  --background: #FFFBEC;  /* Ivory */
  --foreground: #0C0C0C;  /* Black */
}
```

### Usage in Components

```tsx
// Nav and hero backgrounds
<header className="bg-rush-green text-white">

// Primary CTA buttons
<button className="bg-rush-green hover:bg-rush-teal">

// Links and secondary accent
<a className="text-rush-teal hover:underline">

// Section headings
<h2 className="text-rush-green">

// Student avatar circles
<div className="bg-rush-emerald">

// Page background
<body className="bg-rush-ivory text-rush-charcoal">
```

## Key Decisions

1. **Green as primary, not blue.** The Rush guide lists blues (Indigo, Deep Blue, Cerulean) as *tertiary* — they should be used sparingly. Growth Green `#006332` is the primary digital brand color.

2. **Ivory background stays.** `#FFFBEC` is confirmed as an official Rush tertiary color. It gives the site warmth vs pure white.

3. **No gradient buttons.** The Rush guide shows solid-fill primary buttons only. This aligns with our existing anti-pattern rule.

4. **Button hierarchy matches guide.** Primary = filled green, Secondary = text + icon, Outlined = border + icon, Tertiary = minimal.

## Prevention

- **Always read the brand guide PDF** before guessing colors from logos or screenshots
- **Keep the guide in the repo** at `docs/` for reference
- **Use CSS custom properties** so a single file change updates the entire site
- **Name tokens after their Rush brand name** (`rush-green` not `primary-dark`) for traceability

## References

- Rush Digital Quick Guide PDF: provided by user
- brand.rush.edu: official Rush brand standards
- Related solution: `docs/solutions/architecture/git-cms-over-custom-admin-backend.md`
