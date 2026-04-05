---
status: pending
priority: p3
issue_id: "011"
tags: [code-review, performance, images]
dependencies: []
---

# 011: Add `sizes` Attribute to Team Photo Image Components

## Problem Statement

Team photos in `pi-bio.tsx` use `next/image` at 200x200 without a `sizes` attribute. Without it, the browser may download a larger srcset variant than needed.

## Proposed Solutions

Add `sizes="200px"` to the Image component in `pi-bio.tsx`.

**Effort:** Small | **Risk:** Low

## Technical Details

- **Affected files:** `src/components/team/pi-bio.tsx`

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-22 | Created from code review | Flagged by Performance Oracle |
