---
status: pending
priority: p2
issue_id: "008"
tags: [code-review, css, architecture]
dependencies: []
---

# 008: `glass-nav` Defined in `@layer utilities` Instead of Components Layer

## Problem Statement

In `globals.css`, `.glass-nav` is defined inside `@layer utilities`, but it is semantically a component-level class (it applies a bundle of styles for a specific UI component). In Tailwind CSS v4, utilities are designed to override components — placing a component class in the utilities layer can cause specificity issues if you later try to override its properties with utility classes.

## Proposed Solutions

### Option A: Move to @layer base or remove layer wrapper
Move `.glass-nav` out of `@layer utilities` or into a more appropriate layer.

**Effort:** Small
**Risk:** Low

## Technical Details

- **Affected files:** `src/app/globals.css`

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-22 | Created from code review | Flagged by TypeScript Reviewer |
