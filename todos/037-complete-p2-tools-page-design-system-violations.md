---
status: pending
priority: p2
issue_id: "037"
tags: [code-review, design-system, css, tailwind, consistency]
dependencies: []
---

# 037: `tools/page.tsx` Has Design System Violations — Hardcoded Hex + Built-in Shadows

## Problem Statement

`src/app/tools/page.tsx` has two categories of design system violations that were uncovered during the color audit:

1. **Hardcoded hex value** `bg-[#f2eedf]` (line 227) — this is the raw hex for `rush-surface-container` but is hardcoded instead of using the token. If `rush-surface-container` changes in `globals.css`, this value silently diverges.

2. **Tailwind built-in shadow utilities** (`shadow-sm` at line 128, `shadow-xl` at line 214) — while the rest of the site uses custom semantic shadow tokens (`shadow-card`, `shadow-card-sm`, `shadow-card-md`), the tools page still uses Tailwind built-ins. This creates two parallel shadow vocabularies across the codebase.

## Findings

**Architecture agent** identified both issues:

> "`bg-[#f2eedf]` in `/src/app/tools/page.tsx` line 227 — this is the raw value of `rush-surface-container`. This is the one remaining design system leak; it should be `bg-rush-surface-container`."

> "The tools page uses `shadow-sm` and `shadow-xl` at lines 128 and 214, which are Tailwind built-ins. These are not violations, but they represent a design system inconsistency: most components use your custom semantic tokens, but `tools/page.tsx` still reaches for Tailwind built-ins. Over time this creates two shadow vocabularies."

## Proposed Solutions

### Option A: Direct token substitution (Recommended)
Replace hardcoded values with the appropriate design system tokens.

**Line 227:**
```tsx
// Before
bg-[#f2eedf]
// After
bg-rush-surface-container
```

**Lines 128, 214:**
```tsx
// Line 128 — shadow-sm → shadow-card-sm (closest equivalent: 0 8px 32px rgba(12,12,12,0.04))
shadow-sm → shadow-card-sm

// Line 214 — shadow-xl is a large dramatic shadow; closest intent is shadow-card or shadow-card-md
shadow-xl → shadow-card-md
```

- **Pros:** Closes design system leak, consistent vocabulary, single source of truth
- **Cons:** `shadow-card-md` is softer than `shadow-xl` — may need visual verification
- **Effort:** Small (15 min)
- **Risk:** Low — visual change on tools page shadows; verify against design intent

### Option B: Keep `shadow-xl` as-is if intentional
If the tools page intentionally uses a more dramatic shadow for UI contrast, document it as an exception rather than trying to shoehorn it into the semantic token system.
- **Pros:** Preserves any intentional visual design
- **Cons:** Mixed shadow vocabulary persists
- **Effort:** Minimal (just fix the hardcoded hex)
- **Risk:** None

## Recommended Action

_(Leave blank — fill during triage)_

## Technical Details

- **File:** `src/app/tools/page.tsx`
- **Line 227:** `bg-[#f2eedf]` → `bg-rush-surface-container`
- **Line 128:** `shadow-sm` → `shadow-card-sm` (or keep if intentional)
- **Line 214:** `shadow-xl` → `shadow-card-md` (or keep if intentional)
- **No other files need changing**

## Acceptance Criteria

- [ ] `bg-[#f2eedf]` replaced with `bg-rush-surface-container` on line 227
- [ ] Tools page visual appearance is verified against design intent
- [ ] Shadow vocabulary is consistent (no Tailwind built-ins alongside custom tokens), OR exception is documented
- [ ] `npm run build` passes

## Work Log

- 2026-04-05: Found by architecture-strategist during color audit code review. The hex hardcode is a definite fix; the shadow built-ins are a judgment call on severity.

## Resources

- Related: 036 (shadow token `@theme` placement)
- `rush-surface-container` = `#f2eedf` confirmed in `src/app/globals.css`
