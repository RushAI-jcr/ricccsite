---
status: pending
priority: p2
issue_id: "029"
tags: [code-review, architecture, data-coupling]
dependencies: []
---

# 029: Research page accesses RESEARCH_PILLARS by numeric index

## Problem Statement

The research page at `src/app/research/page.tsx` accesses pillars via `themes[0]`, `themes[1]`, etc. Each index maps to a bespoke layout with hardcoded checklists, trial cards, and discipline tags. If someone reorders the array in `research-pillars.ts`, the research page breaks silently — content appears in the wrong section layout.

## Findings

- **Architecture Strategist**: Positional coupling. Home/mission pages use `.map()` (safe), research page uses index access (fragile).
- **TypeScript Reviewer**: Noted the `Record<string, ...>` pattern could benefit from stable IDs.

## Proposed Solutions

### Option A: Add stable `id` field to ResearchPillar (Recommended)
Add `id: "icu-data-science" | "federated" | "trials" | "interdisciplinary"` to each pillar. Research page looks up by ID instead of index.

- **Pros**: Reorder-safe, self-documenting
- **Cons**: Slightly more code in research page
- **Effort**: Small
- **Risk**: None

## Acceptance Criteria

- [ ] Research page uses pillar IDs, not array indices
- [ ] Reordering `RESEARCH_PILLARS` array does not break any page
