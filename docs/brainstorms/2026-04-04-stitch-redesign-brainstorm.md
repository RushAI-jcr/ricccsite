---
title: Apply Google Stitch Design Exports to RICCC Site
type: feat
date: 2026-04-04
status: decided
---

# Stitch Redesign Brainstorm

## What We're Building

A full visual redesign of the RICCC Lab website using Google Stitch HTML exports as the design source of truth. The Stitch exports define an editorial, magazine-like design language that replaces the current component styling while keeping all backend logic, data sources, and content copy intact.

**Scope:** All existing pages + 3 new pages (Mission & Goals, Tools & Infrastructure, Collaborate).

## Why This Approach

The Stitch exports represent a cohesive, custom-designed visual system that moves the site from a generic lab template to a purpose-built editorial aesthetic:

- **Glass nav** replaces solid green header — more refined, lets content breathe
- **Large editorial typography** (text-7xl heroes) with Geist Mono labels
- **Asymmetric layouts** with numbered sections (01, 02, 03, 04) instead of uniform card grids
- **Ivory/sage banding** for section rhythm instead of gradient backgrounds
- **Sharp corners** (0-2px radius) instead of rounded cards

## Key Decisions

### 1. Navigation: Glass nav
- Frosted ivory `rgba(253,249,234,0.8)` with `backdrop-blur(24px)`
- Dark green text (`#004923`), active state with green bottom border
- "Collaborate" CTA button in primary green
- **Nav order:** Home, Research, Team, Publications, Software, Tools, Collaborate, Contact

### 2. Scope: Full Stitch coverage
- Redesign all existing pages (home, research, team, publications, software, news, contact)
- Add new pages: `/mission`, `/tools`, `/collaborate`
- Homepage sections: Hero, Research Pillars, CLIF Feature, CTA
- **New page content:** Adapt copy from `stitch.md` narrative sections (mission narrative, research themes, CLIF description) and Stitch exports. Use existing site-config and team MDX data where applicable. Stitch placeholder metrics and technical jargon (e.g., "LIVE TELEMETRY", "98.4% Data Fidelity") are discarded.

### 3. Images: Keep existing only
- Use current logo (`/images/riccc-logo-final.png`) and team photos
- Where Stitch shows hero/section images, use colored backgrounds or subtle patterns
- No Google-hosted placeholder URLs

### 4. Fonts: Add Geist Mono
- Install `geist` npm package
- Geist Mono for: labels, badges, nav active indicators, metadata, technical tags
- Inter continues as primary body/headline font

### 5. Color system: Map Stitch tokens to Rush brand
The Stitch exports use Material Design 3 color tokens. Mapping:

| Stitch Token | Hex | Rush Equivalent | Usage |
|---|---|---|---|
| `primary` | #004923 | Rush Dark Green (new) | Nav text, heading color |
| `primary-container` | #006332 | Rush Growth Green | CTA buttons, accents |
| `secondary` | #006c45 | Rush Legacy Green variant | Links, secondary actions |
| `secondary-container` | #79fbb8 | Rush Vitality (brighter) | Badges, selection |
| `surface` / `background` | #fdf9ea | Rush Ivory | Page background |
| `surface-container` | #f2eedf | Rush Sage (warmer) | Section banding |
| `surface-container-low` | #f8f4e5 | Rush Ivory variant | Alternate sections |
| `surface-container-high` | #ece8da | Rush Sage (darker) | Hover states, cards |
| `on-surface` | #1c1c13 | Rush Charcoal | Body text |
| `on-surface-variant` | #3f4940 | Rush Umber variant | Secondary text |
| `outline` | #6f7a6f | New muted green | Borders, dividers |
| `outline-variant` | #bfc9bd | New soft green | Subtle borders |

### 6. Design patterns from Stitch to adopt
- **Editorial asymmetric hero**: 60/40 or 8/4 grid split, text left, visual right
- **Numbered sections**: `01.`, `02.`, etc. in Geist Mono for research pillars
- **Monospace labels**: Uppercase, tracked-wide, small (0.65-0.75rem) for categories/tags
- **Sticky sidebar**: Mission text stays visible while scrolling goals
- **Border-left metrics**: Vertical border + label + big number + subtitle
- **Surface banding**: Alternate ivory and sage-variant backgrounds between sections
- **Sharp/minimal radius**: 0-2px default, max 0.5rem for cards
- **Grayscale images**: `grayscale` filter with `hover:grayscale-0` transition

### 7. Content approach
- All body copy for existing pages comes from current site components and `content/site-config.json`
- Stitch placeholder copy (e.g., "Volume 24.01", "LIVE TELEMETRY STREAM") is discarded
- PI bios and team data from `content/team/*.mdx` and `content/site-config.json`
- Research themes/descriptions from current `research/page.tsx` and `lab-mission.tsx`
- New pages (`/mission`, `/tools`, `/collaborate`) use copy from `stitch.md` narrative sections, edited for accuracy against existing site config

## Stitch Export Inventory

| Page | Desktop File | Mobile File | Maps To |
|---|---|---|---|
| Homepage | homepage-desktop.html | homepage-mobile-alt.html | `/` (home) |
| Mission & Goals | mission-goals-final-desktop.html | mission-goals-mobile.html | `/mission` (new) |
| Research Pillars | research-pillars-final-desktop.html | research-pillars-mobile.html | `/research` |
| Team | investigative-team-final-desktop.html | investigative-team-mobile.html | `/team` |
| Tools & Infra | tools-infrastructure-final-desktop.html | tools-infrastructure-mobile.html | `/tools` (new) |
| Collaborate | collaborate-with-riccc-final-desktop.html | collaborate-mobile.html | `/collaborate` (new) |
| Research (alt) | research-desktop.html | research-mobile.html | Reference only |
