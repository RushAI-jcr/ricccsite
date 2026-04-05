---
status: pending
priority: p1
issue_id: "025"
tags: [code-review, accessibility, html-spec, architecture]
dependencies: []
---

# 025: Double `<main>` landmark nesting violates HTML spec

## Problem Statement

The root layout at `src/app/layout.tsx:40` wraps all children in `<main className="flex-1">`. Every individual page component also renders its own `<main>` element. This produces nested `<main>` elements in the DOM, violating the HTML spec (one `<main>` per page). Screen readers use `<main>` as a landmark; nesting degrades accessibility.

## Findings

- **Architecture Strategist**: Identified as most clear-cut structural defect.
- **Pattern Recognition**: Confirmed — all 8 page components return `<main>`.
- Pages affected: page.tsx, mission, research, team, publications, tools, contact, news, not-found.

## Proposed Solutions

### Option A: Change layout wrapper to `<div>` (Recommended)
Replace `<main className="flex-1">` in `layout.tsx` with `<div className="flex-1">`. Every page already has its own `<main>` with page-specific styling.

- **Pros**: Minimal change (1 line), preserves per-page semantic structure
- **Cons**: None
- **Effort**: Small
- **Risk**: None

### Option B: Remove `<main>` from every page
Keep the layout `<main>`, remove from all 9 page components.

- **Pros**: Single landmark definition
- **Cons**: Touches 9 files, loses per-page bg/styling on the `<main>` element
- **Effort**: Medium
- **Risk**: Low

## Recommended Action

Option A — change `layout.tsx` line 40 from `<main>` to `<div>`.

## Technical Details

- **File**: `src/app/layout.tsx` line 40
- **Affected pages**: All 9 page components

## Acceptance Criteria

- [ ] Only one `<main>` element in DOM at any time
- [ ] axe/Lighthouse accessibility audit passes with no landmark warnings
- [ ] Visual appearance unchanged
