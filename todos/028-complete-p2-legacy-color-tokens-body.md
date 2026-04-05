---
status: pending
priority: p2
issue_id: "028"
tags: [code-review, design-system, pattern-consistency]
dependencies: []
---

# 028: Legacy color tokens still in use (body text, pub cards, spotlights)

## Problem Statement

Several files use legacy Rush color tokens instead of the Stitch/MD3 surface system tokens used across the rest of the codebase. Most critically, the root `<body>` in `layout.tsx` uses `text-rush-charcoal` instead of `text-rush-on-surface`.

## Findings

- **Pattern Recognition**: High-priority. 6 legacy token instances identified.

| File | Token | Replacement |
|------|-------|-------------|
| `layout.tsx:38` | `text-rush-charcoal` | `text-rush-on-surface` |
| `tools/page.tsx:329` | `text-rush-umber` | `text-rush-on-surface-variant` |
| `pub-card.tsx:53,63,70` | `bg-rush-light-gray` (x3) | `bg-rush-surface-container-high` |
| `research-spotlights.tsx:52` | `bg-rush-light-gray` | `bg-rush-surface-container-high` |
| `pub-card.tsx:23` | `bg-white` | `bg-rush-surface` |
| `research-spotlights.tsx:47` | `bg-white` | `bg-rush-surface` |

Additionally, Pattern Recognition found:
- 3 colored side-borders (`border-l-*`) on cards in `staff-grid.tsx:18`, `tools/page.tsx:102`, `news/page.tsx:21` — violates CLAUDE.md anti-pattern "No colored side-borders on cards"
- 12 mono labels using `tracking-wider`/`tracking-wide` instead of `tracking-widest` (the dominant pattern with 39 occurrences)
- Footer uses `text-rush-on-surface/60` opacity instead of `text-rush-on-surface-variant`
- Publications content area uses `py-12` instead of `py-24` (every other page)
- Team page hero label uses `text-rush-dark-green` instead of `text-rush-teal` for the mono label
- Unused `siteConfig` import in `lab-mission.tsx` (ESLint catches it)

## Proposed Solutions

Find-and-replace the 8 legacy token instances. Address the additional pattern inconsistencies as a batch.

- **Effort**: Small-Medium
- **Risk**: None (visual changes are subtle)

## Acceptance Criteria

- [ ] No `rush-charcoal`, `rush-umber`, `rush-light-gray`, or raw `bg-white` in component files
- [ ] No colored side-borders on cards (per CLAUDE.md anti-pattern)
- [ ] Mono labels consistently use `tracking-widest`
- [ ] Visual appearance consistent with Stitch surface system
