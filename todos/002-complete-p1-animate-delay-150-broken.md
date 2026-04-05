---
status: pending
priority: p1
issue_id: "002"
tags: [code-review, css, bug]
dependencies: []
---

# 002: `animate-delay-150` Class Does Not Exist — Staggered Animation Silently Broken

## Problem Statement

In `src/components/layout/page-header.tsx` (line 16), the class `animate-delay-150` is applied to the description paragraph. This class is **not defined anywhere** — not in `globals.css`, not in Tailwind CSS v4 (which does not ship animation-delay utilities by default), and there is no `tailwind.config.ts`. The class is silently ignored, meaning the title and description animate simultaneously instead of with a staggered delay.

## Findings

- **TypeScript Reviewer**: Flagged as CRITICAL — silent CSS bug
- **Architecture Strategist**: Confirmed not defined, recommended fix
- **Simplicity Reviewer**: Confirmed broken class
- **Performance Oracle**: Noted as visual bug

## Proposed Solutions

### Option A: Define the utility in globals.css (Recommended)
Add to `@layer utilities` in `globals.css`:
```css
.animate-delay-150 {
  animation-delay: 150ms;
}
```
Also add `opacity-0` to the element so the delay is visible (otherwise element shows before animation fires).

**Pros:** Clean, reusable, consistent with existing animation utilities
**Cons:** None
**Effort:** Small
**Risk:** Low

### Option B: Use Tailwind v4 arbitrary value
Replace `animate-delay-150` with `[animation-delay:150ms]` in the JSX.

**Pros:** No CSS file change needed
**Cons:** Less readable, harder to find
**Effort:** Small
**Risk:** Low

### Option C: Use inline style
Add `style={{ animationDelay: '150ms' }}` to the element.

**Pros:** Explicit, no utility needed
**Cons:** Mixes styling approaches
**Effort:** Small
**Risk:** Low

## Technical Details

- **Affected files:** `src/components/layout/page-header.tsx`, `src/app/globals.css`

## Acceptance Criteria

- [ ] PageHeader description text animates with a visible delay after the title
- [ ] `animate-delay-150` class is either defined or replaced with a working alternative

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-22 | Created from code review | Flagged by 4 review agents |
