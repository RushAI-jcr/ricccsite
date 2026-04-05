---
status: pending
priority: p2
issue_id: "020"
tags: [code-review, dead-code, quality]
dependencies: []
---

# 020: Dead code cleanup — CSS animations, color prop, footer filter

## Problem Statement

Several pieces of dead code accumulated during the redesign:

1. `globals.css` lines 134-152: `@keyframes float`, `.animate-float`, and `animate-fade-in-up` are no longer referenced by any component.
2. `compact-member-grid.tsx`: `color` prop accepted then voided with `void color`. No call sites pass it.
3. `footer.tsx`: `.filter((r) => r.href)` on the resources array is pointless — all entries have static hrefs.

## Findings

- **Architecture Strategist**: Dead CSS animations flagged.
- **TypeScript Reviewer**: Dead `color` prop flagged.
- **Code Simplicity Reviewer**: Footer filter and void color flagged.

## Proposed Solutions

### Option A: Remove all dead code

- **Effort**: Small (5 minutes)

## Acceptance Criteria

- [ ] `@keyframes float` and `.animate-float` removed from globals.css
- [ ] `animate-fade-in-up` removed if unused (verify first)
- [ ] `color` prop removed from `CompactMemberGrid`
- [ ] `.filter((r) => r.href)` removed from footer resources
