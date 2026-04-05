---
status: pending
priority: p3
issue_id: "010"
tags: [code-review, performance, css]
dependencies: []
---

# 010: Replace `transition-all` with Specific Transition Properties

## Problem Statement

Multiple components use `transition-all duration-300` which transitions every CSS property, including layout-triggering ones. More specific transitions prevent accidental layout-triggering animations.

Locations:
- `header.tsx` nav links — only needs `transition-transform`
- `research-domains.tsx` cards — needs `transition-[transform,box-shadow,border-color]`
- `glass-nav` in globals.css — needs `transition-[background-color,box-shadow]`

## Proposed Solutions

Replace `transition-all` with property-specific transitions in each location.

**Effort:** Small | **Risk:** Low

## Technical Details

- **Affected files:** `src/components/layout/header.tsx`, `src/components/home/research-domains.tsx`, `src/app/globals.css`

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-22 | Created from code review | Flagged by Performance Oracle |
