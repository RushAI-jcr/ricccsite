---
status: pending
priority: p3
issue_id: "038"
tags: [code-review, css, tailwind, simplification, yagni]
dependencies: [036]
---

# 038: Shadow Token Consolidation — `shadow-card-md` and `shadow-green` Are Single-Use

## Problem Statement

Two of the four shadow tokens added in the color audit have only one consumer each, making them candidates for YAGNI simplification:

1. **`shadow-card-md`** — used only in `staff-grid.tsx` analytics panel. The visual difference from `shadow-card` is imperceptible (blur radius 32 vs 40, opacity 0.06 vs 0.05). The `sm`/`md` naming implies an elevation scale, but there's no `lg` and the ordering is not consistent with that reading (`card` has *higher* opacity than `card-md`).

2. **`shadow-green`** — used only in `staff-grid.tsx` assistants panel (dark green background). A `rgba(0,73,35,0.15)` shadow on a `#004923` background produces near-zero visible contrast — the tint is almost identical to the background itself. This shadow adds no perceptible depth.

## Findings

**Simplicity reviewer** identified both:

> "`shadow-card-md` is applied in exactly one place: the `analytics` group card in `staff-grid.tsx`. The naming implies a scale but there is no `card-lg`, and neither token is used in a way that reflects a size progression."

> "`shadow-green` is used in exactly one place: `GROUP_STYLE.assistants`. The token exists purely to name what was already a one-off design decision: the dark green assistants panel has a green-tinted shadow. Since this isn't a reusable pattern, inlining it as an arbitrary value (or dropping the shadow on the dark panel entirely, since dark shadows on dark backgrounds produce near-zero visual effect at 0.15 opacity) would be simpler."

## Proposed Solutions

### Option A: Collapse `shadow-card-md` into `shadow-card` + drop `shadow-green` (Recommended)

In `globals.css`, remove:
```css
--shadow-card-md: 0 12px 40px rgba(12,12,12,0.05);
--shadow-green: 0 12px 40px rgba(0,73,35,0.15);
```

In `staff-grid.tsx`, change `GROUP_STYLE`:
```tsx
// Before
analytics: "bg-rush-surface-container-high shadow-card-md",
assistants: "bg-rush-dark-green text-white shadow-green",

// After
analytics: "bg-rush-surface-container-high shadow-card",
assistants: "bg-rush-dark-green text-white",  // drop imperceptible shadow
```

- **Pros:** 2 fewer tokens, token file stays honest (tokens = things that recur), imperceptible visual change
- **Cons:** Loses the green-tinted shadow entirely on the assistants panel
- **Effort:** Small (10 min)
- **Risk:** Zero visual change on `shadow-card-md` substitution; `shadow-green` removal is imperceptible

### Option B: Collapse `shadow-card-md` only, keep `shadow-green` inlined
Remove `shadow-card-md` token, keep `shadow-green` as an arbitrary value on the one panel that uses it.

```tsx
assistants: "bg-rush-dark-green text-white shadow-[0_12px_40px_rgba(0,73,35,0.15)]",
```

- **Pros:** Preserves the shadow intent, fewer named tokens
- **Cons:** One hardcoded arbitrary value remains
- **Effort:** Small
- **Risk:** Zero

### Option C: Keep all 4 tokens as-is
Defer simplification; the token count is low and the names are readable.
- **Pros:** No churn
- **Cons:** Misleading naming scale (`sm`/`md` without `lg`), one near-invisible shadow token
- **Effort:** Zero

## Recommended Action

_(Leave blank — fill during triage)_

## Technical Details

- **Files:** `src/app/globals.css`, `src/components/team/staff-grid.tsx`
- **`shadow-card-md`:** Defined in globals.css, used only at `staff-grid.tsx:12`
- **`shadow-green`:** Defined in globals.css, used only at `staff-grid.tsx:16`
- **Consumer count at time of review:** `shadow-card-md` × 1, `shadow-green` × 1

## Acceptance Criteria

- [ ] `shadow-card-md` either removed and replaced with `shadow-card`, or given a second consumer that justifies its existence
- [ ] `shadow-green` either removed (preferred), inlined as arbitrary value, or given a second consumer
- [ ] `npm run build` passes
- [ ] Staff grid visual appearance verified in browser

## Work Log

- 2026-04-05: Found by code-simplicity-reviewer during color audit code review. Low urgency — aesthetic only.

## Resources

- Related: 036 (`@theme` block placement — fix that first before consolidating)
- `src/components/team/staff-grid.tsx` — the only consumer of both tokens
