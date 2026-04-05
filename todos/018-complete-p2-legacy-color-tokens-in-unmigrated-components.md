---
status: pending
priority: p2
issue_id: "018"
tags: [code-review, pattern-consistency, design-system]
dependencies: []
---

# 018: Legacy color tokens in pub-card, pub-filters, not-found, social-links

## Problem Statement

Four components still use pre-Stitch Rush tokens (`rush-charcoal`, `rush-mid-gray`, `rush-green`, `border-gray-300`) while the rest of the site uses the new Stitch surface system (`rush-dark-green`, `rush-on-surface`, `rush-on-surface-variant`, `rush-surface-container-*`). This creates a visible two-tone design where publications and the 404 page look different from every other page.

Additionally, `not-found.tsx` uses the old `max-w-7xl` container and old padding pattern.

## Findings

- **Pattern Recognition**: 4 files with stale tokens — `pub-card.tsx`, `pub-filters.tsx`, `not-found.tsx`, `social-links.tsx`.
- **Architecture Strategist**: `not-found.tsx` entirely un-migrated.

## Proposed Solutions

### Option A: Migrate all four components to Stitch tokens

Map: `rush-charcoal` → `rush-on-surface`, `rush-mid-gray` → `rush-on-surface-variant`, `rush-green` → `rush-dark-green`, `border-gray-300` → `border-rush-outline-variant`. Update `not-found.tsx` layout to `max-w-screen-2xl`.

- **Effort**: Medium (20 minutes)

## Acceptance Criteria

- [ ] No references to `rush-charcoal`, `rush-mid-gray`, or `border-gray-300` in `src/`
- [ ] `not-found.tsx` uses Stitch surface tokens and `max-w-screen-2xl` layout
- [ ] Publications page visually consistent with other pages
