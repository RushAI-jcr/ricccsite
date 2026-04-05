---
status: pending
priority: p1
issue_id: "014"
tags: [code-review, visual-bug, pattern-consistency]
dependencies: []
---

# 014: SocialLinks renders white text on light footer background

## Problem Statement

`src/components/layout/social-links.tsx` uses `text-white/70 hover:text-white` for icon colors. The footer background was changed from `bg-rush-green` (dark green) to `bg-rush-surface-container` (light tan) in the Stitch redesign. White text on a light tan background is invisible — the social links in the footer are broken visually.

## Findings

- **Pattern Recognition Specialist**: Flagged as High severity visual bug.

## Proposed Solutions

### Option A: Update to surface-aware colors (Recommended)

Change to `text-rush-on-surface-variant hover:text-rush-dark-green` to match the footer's light background.

- **Effort**: Small (2 minutes)

## Technical Details

- **Affected file**: `src/components/layout/social-links.tsx`, line 41

## Acceptance Criteria

- [ ] Social link icons visible on the light footer background
- [ ] Hover state uses `rush-dark-green` consistent with footer nav links
