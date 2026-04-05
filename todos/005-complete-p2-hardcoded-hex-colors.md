---
status: pending
priority: p2
issue_id: "005"
tags: [code-review, design-system, maintainability]
dependencies: []
---

# 005: Hardcoded Hex Colors Outside Design System

## Problem Statement

Four hex values are used in component JSX but not defined in the Rush brand token system in `globals.css`:

- `#005228` — used in `hero.tsx` and `page-header.tsx` (gradient via-stop)
- `#008f5c` — used in `metrics-bar.tsx` (gradient to-stop)
- `#E8F8F0` — used in `research-spotlights.tsx` (gradient from-stop)
- `#00A66C/0.05` — used in `research-spotlights.tsx` (radial gradient)

If the brand palette changes, these values must be found via find-and-replace across multiple files.

## Proposed Solutions

### Option A: Add to @theme block in globals.css (Recommended)
```css
--color-rush-forest: #005228;
--color-rush-teal-dark: #008f5c;
--color-rush-mint: #E8F8F0;
```
Then use as `via-rush-forest`, `to-rush-teal-dark`, `from-rush-mint`.

**Pros:** Single source of truth, consistent with existing tokens
**Effort:** Small
**Risk:** Low

## Technical Details

- **Affected files:** `src/app/globals.css`, `src/components/home/hero.tsx`, `src/components/layout/page-header.tsx`, `src/components/home/metrics-bar.tsx`, `src/components/home/research-spotlights.tsx`

## Acceptance Criteria

- [ ] All hex values in component JSX reference named design tokens
- [ ] No raw hex values in gradient class strings

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-22 | Created from code review | Flagged by TypeScript Reviewer and Architecture Strategist |
