---
status: pending
priority: p2
issue_id: "021"
tags: [code-review, pattern-consistency, design-system]
dependencies: []
---

# 021: Team components use rounded-xl/2xl vs rounded-sm/md elsewhere

## Problem Statement

The Stitch editorial system uses sharp corners (`rounded-sm` / `rounded-md` with --radius: 0.25rem). However, team components break this:

- `compact-member-grid.tsx`: `rounded-xl` on cards and avatars
- `staff-grid.tsx`: `rounded-2xl` on group containers and avatars
- `member-social-links.tsx`: `rounded-lg` on icon buttons

This creates a visible break from the angular editorial look everywhere else.

## Findings

- **Pattern Recognition**: Four competing radius systems across the site.
- **Architecture Strategist**: Team components visibly inconsistent with rest of redesign.

## Proposed Solutions

### Option A: Standardize team components to rounded-sm/md

Match the editorial system. Use `rounded-full` only for circular avatars (which is intentional).

- **Effort**: Small (10 minutes)

## Acceptance Criteria

- [ ] Team card containers use `rounded-sm` or `rounded-md`
- [ ] Social link icon buttons use `rounded-sm`
- [ ] Circular avatars remain `rounded-full` (intentional)
