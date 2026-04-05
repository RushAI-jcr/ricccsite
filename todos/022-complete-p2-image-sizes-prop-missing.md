---
status: pending
priority: p2
issue_id: "022"
tags: [code-review, performance, images]
dependencies: []
---

# 022: Missing `sizes` prop on Image components wastes bandwidth

## Problem Statement

Only one `<Image>` in the codebase has a `sizes` prop (`pi-bio.tsx`). Without `sizes`, Next.js defaults to `100vw` srcset, generating images up to the full source width for every breakpoint — even for a 36x36 nav logo or 72x72 staff photo.

Affected images:
- `hero.tsx`: Logo in 4-col container (33% viewport on desktop) — generates up to 2048w srcset
- `research-spotlights.tsx`: Images in `md:w-72` container (288px)
- `staff-grid.tsx`: 72x72 member photos
- `header.tsx`: 36x36 nav logo

## Findings

- **Performance Oracle**: Flagged as Critical. Wastes 200-500 KB on mobile.

## Proposed Solutions

### Option A: Add explicit sizes to all Image components

- Header logo: `sizes="36px"`
- Staff photos: `sizes="72px"`
- Hero logo: `sizes="(max-width: 1024px) 100vw, 33vw"`
- Spotlight images: `sizes="(max-width: 768px) 100vw, 288px"`

- **Effort**: Small (10 minutes)

## Acceptance Criteria

- [ ] All `<Image>` components have explicit `sizes` prop
- [ ] Fixed-dimension images use pixel-based sizes
