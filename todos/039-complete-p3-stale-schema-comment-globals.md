---
status: pending
priority: p3
issue_id: "039"
tags: [code-review, css, documentation, design-system]
dependencies: []
---

# 039: Stale Section Alternation Schema Comment in `globals.css`

## Problem Statement

The canonical schema comment in `globals.css` (lines 34–41) documents the page surface system but is now outdated after the color audit introduced `rush-sage` as a section band background. The comment describes `surface-container-low | -container | -container-high` as the alternation vocabulary, but two sections (`LabMission` on home and the contact footer strip) now use `rush-sage` (#DFF9EB) as their band background instead.

If a developer reads the comment and tries to add a new alternating section, they will use `rush-surface-container-low` — the documented pattern — when `rush-sage` is the actual pattern for brand-accent sections. This creates undocumented divergence.

## Findings

**Architecture agent:**

> "The documented canonical schema in globals.css describes `surface/surface-container-low/surface-container/surface-container-high` as the alternation vocabulary. `rush-sage` and `rush-mint` are warm/cool accents, not elevation steps. Using them as section backgrounds creates a semantic discontinuity."

> "The problem is not visual inconsistency per se, but that the documented schema and the actual usage have diverged. The schema comment should either be updated to include `rush-sage` as an approved accent band, or the two `rush-sage` uses should be migrated back to `rush-surface-container-low`."

**Simplicity reviewer:**

> "The comment at lines 34–41 is now stale. The code and the comment diverge silently."

**Current comment (outdated):**
```
— Page canvas: bg-rush-surface. Alternate bands: bg-rush-surface-container-low | -container | -container-high.
```

**Proposed updated comment:**
```
— Page canvas: bg-rush-surface.
— Neutral alternating bands: bg-rush-surface-container-low (most common) | -container | -container-high.
— Brand-accent bands: bg-rush-sage (for mission/CTA sections that should pop with Rush green).
— Text: text-rush-on-surface (body), text-rush-on-surface-variant (secondary), text-rush-dark-green (headings).
```

## Proposed Solutions

### Option A: Update the comment to document both patterns (Recommended)
Add a note that `rush-sage` is the approved token for brand-accent section bands (mission, primary CTAs).
- **Pros:** Comment matches reality, developers know when to reach for `rush-sage` vs `surface-container-low`
- **Cons:** None
- **Effort:** Tiny (2 min)
- **Risk:** Zero

### Option B: Revert the two `rush-sage` uses back to `rush-surface-container-low`
If the intent was for `rush-sage` to NOT be part of the section alternation system, revert the audit changes.
- **Pros:** Single documented pattern for section backgrounds
- **Cons:** Loses the visual differentiation that `rush-sage` provides for key sections
- **Effort:** Small
- **Risk:** None (visual change only)

## Recommended Action

_(Leave blank — fill during triage)_

## Technical Details

- **File:** `src/app/globals.css` — lines 34–41 (schema comment block)
- **Secondary:** Consider also documenting `bg-rush-mint/25` used in `src/app/team/page.tsx` (team cohort band) — this is a third unofficial background variant not in the schema
- **No code changes** required if Option A is chosen — comment only

## Acceptance Criteria

- [ ] Schema comment in `globals.css` accurately reflects all section background patterns in use
- [ ] `rush-sage` usage is either documented as intentional or removed for consistency
- [ ] `rush-mint/25` usage is either documented or removed
- [ ] Future developer can read the comment and know which token to use for a new section

## Work Log

- 2026-04-05: Found by architecture-strategist and simplicity-reviewer during color audit code review.

## Resources

- `src/components/home/lab-mission.tsx` — `bg-rush-sage` usage
- `src/app/contact/page.tsx:131` — `bg-rush-sage` usage
- `src/app/team/page.tsx` — `bg-rush-mint/25` usage
