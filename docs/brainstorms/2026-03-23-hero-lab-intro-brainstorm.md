---
topic: Hero Lab Intro & Goals
date: 2026-03-23
status: decided
---

# Hero Lab Intro & Goals

## What We're Building

Expand the homepage hero to serve as the lab's intro page. Replace the current minimal hero (tagline + CLIF link + logo) with a mission statement and 4 research goals. Remove the separate Research Domains section — the hero goals replace it.

**Current hero flow:** Lab name → tagline → CLIF link → logo
**New hero flow:** Lab name → mission statement → 4 research goals → logo (right column)

## Why This Approach

- The hero is the first thing visitors see — it should communicate what the lab does
- A single PI was removed; now the hero should be about the lab's purpose
- The Research Domains section was redundant with hero goals — consolidating simplifies the page
- Keeps the two-column layout with logo, which is visually balanced

## Key Decisions

1. **Placement:** Expand hero content (not a new section or separate page)
2. **Content:** Mission statement (2-3 sentences) + 4 research goals with brief descriptions
3. **Research Goals (replacing 3 domain cards):**
   - ICU Data Science
   - Federated ICU Research
   - Clinical Trials in ICU
   - Multidisciplinary ICU Research
4. **Layout:** Keep two-column (text left, logo right) — same structure, richer content
5. **Remove:** CLIF link from hero, Research Domains section from home page
6. **Keep:** Metrics Bar, Research Spotlights, Funding Logos sections unchanged

## Scope

### In scope
- Rewrite hero.tsx with mission + goals
- Remove CLIF link from hero
- Remove ResearchDomains import from page.tsx
- Write mission statement and goal descriptions

### Out of scope
- Separate /about page
- Team/PI references in hero
- Changes to other home page sections

## Open Questions

_None — all decisions resolved._
