---
status: pending
priority: p2
issue_id: "036"
tags: [code-review, css, tailwind, design-system, architecture]
dependencies: []
---

# 036: Shadow Tokens Placed in `@theme inline` Instead of Plain `@theme`

## Problem Statement

The four shadow tokens added during the color audit (`--shadow-card`, `--shadow-card-sm`, `--shadow-card-md`, `--shadow-green`) are defined inside the `@theme inline` block in `globals.css`. In Tailwind v4, `@theme inline` has a specific semantic meaning: it tells Tailwind to emit design tokens as *literal values* rather than as CSS custom properties, and it's intended for **variable-bridge tokens** (the `--color-primary: var(--primary)` shadcn/ui pattern). Shadow values are self-contained strings that don't reference other CSS variables, so placing them in `@theme inline` is semantically incorrect.

The practical risk: if a future developer adds a shadcn token that conflicts with a shadow name, or if Tailwind changes how `inline` works, these tokens could behave unexpectedly. Currently the build succeeds, but the semantic contract of the `inline` block is violated.

## Findings

**Architecture agent** identified this as a medium-risk architectural issue. From the report:

> "Placing them in `@theme inline` works mechanically, but it is semantically misaligned. The `inline` block should be reserved for the variable-bridging tokens. Shadow tokens belong in a plain `@theme` block."

**Current globals.css structure (incorrect):**
```css
@theme inline {
  /* ... shadcn/ui bridge tokens (correct) ... */
  --color-rush-green: #006332;          /* correct — Rush primitives */
  --shadow-card: 0 12px 32px rgba(28,28,19,0.06);   /* WRONG — should not be inline */
  --shadow-card-sm: 0 8px 32px rgba(12,12,12,0.04);
  --shadow-card-md: 0 12px 40px rgba(12,12,12,0.05);
  --shadow-green: 0 12px 40px rgba(0,73,35,0.15);
}
```

**Correct pattern:**
```css
@theme inline {
  /* color/font bridge tokens only */
}

@theme {
  --shadow-card: 0 12px 32px rgba(28,28,19,0.06);
  --shadow-card-sm: 0 8px 32px rgba(12,12,12,0.04);
  --shadow-card-md: 0 12px 40px rgba(12,12,12,0.05);
  --shadow-green: 0 12px 40px rgba(0,73,35,0.15);
}
```

## Proposed Solutions

### Option A: Move to a separate `@theme` block (Recommended)
Cut the 4 `--shadow-*` lines from `@theme inline` and place them in a new `@theme { }` block below.
- **Pros:** Correct Tailwind v4 semantics, clean separation of concerns
- **Cons:** None
- **Effort:** Small (5 min)
- **Risk:** Zero — build behavior is identical

### Option B: Move to `:root` as plain CSS variables and reference via arbitrary values
Keep them as `:root` CSS variables but use `shadow-[var(--shadow-card)]` in components.
- **Pros:** Doesn't require knowing Tailwind v4 `@theme` internals
- **Cons:** Loses Tailwind utility class generation, more verbose in components
- **Effort:** Small
- **Risk:** Low

## Recommended Action

_(Leave blank — fill during triage)_

## Technical Details

- **File:** `src/app/globals.css`
- **Lines:** The `@theme inline` block (~lines 6–91)
- **Shadow tokens to move:** `--shadow-card`, `--shadow-card-sm`, `--shadow-card-md`, `--shadow-green`
- **No component changes required** — utility class names (`shadow-card`, etc.) are generated identically by `@theme` and `@theme inline`

## Acceptance Criteria

- [ ] Shadow tokens are defined in a plain `@theme` block, not `@theme inline`
- [ ] `npm run build` passes with zero errors
- [ ] Shadow utilities (`shadow-card`, `shadow-card-sm`, etc.) still work in all components
- [ ] The `@theme inline` block contains only variable-bridge tokens

## Work Log

- 2026-04-05: Found by architecture-strategist during color audit code review. No functional regression — purely a semantic/architectural correctness fix.

## Resources

- Tailwind v4 `@theme` docs: distinguish `@theme` vs `@theme inline`
- Related: `src/app/globals.css` color audit changes (session 2026-04-05)
