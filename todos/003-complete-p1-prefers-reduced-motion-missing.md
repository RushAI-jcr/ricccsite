---
status: pending
priority: p1
issue_id: "003"
tags: [code-review, accessibility, css, animation]
dependencies: []
---

# 003: CSS Animations Missing `prefers-reduced-motion` Support

## Problem Statement

The CSS animations `animate-float` (hero logo, infinite) and `animate-fade-in-up` (page headers) do not respect `prefers-reduced-motion`. This is an **accessibility requirement**, not a nice-to-have. The JS-based `AnimatedCounter` in metrics-bar.tsx correctly checks `prefers-reduced-motion`, creating an inconsistency.

The `animate-float` animation runs infinitely on the hero logo — on mobile devices with motion sensitivity settings, this is a continuous accessibility violation.

## Findings

- **Performance Oracle**: Flagged as priority #2 — "should be addressed before shipping to production"
- **Architecture Strategist**: Flagged as medium priority accessibility concern

## Proposed Solutions

### Option A: Add media query to globals.css (Recommended)
```css
@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-float-delayed,
  .animate-fade-in-up {
    animation: none;
  }
}
```

**Pros:** 3 lines of CSS, comprehensive fix
**Cons:** None
**Effort:** Small
**Risk:** Low

## Technical Details

- **Affected files:** `src/app/globals.css`

## Acceptance Criteria

- [ ] All CSS animations are disabled when `prefers-reduced-motion: reduce` is set
- [ ] Hero logo, page header titles render correctly without animation in reduced-motion mode

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-22 | Created from code review | Flagged by Performance Oracle and Architecture Strategist |
