---
status: pending
priority: p1
issue_id: "012"
tags: [code-review, architecture, seo]
dependencies: []
---

# 012: Sitemap lists deleted /software, missing /mission and /tools

## Problem Statement

`src/app/sitemap.ts` still references `/software` (deleted, redirects to `/tools`) and does not include the two new routes `/mission` and `/tools`. Search engines will get a 301 for `/software` in the sitemap, and `/mission` + `/tools` are invisible to crawlers.

## Findings

- **Architecture Strategist**: Flagged as must-fix. Sitemap is out of sync with actual routes.

## Proposed Solutions

### Option A: Update sitemap.ts (Recommended)

Replace `/software` with `/tools` and add `/mission` to the routes array.

- **Pros**: 2-line fix, immediate SEO improvement
- **Cons**: None
- **Effort**: Small (2 minutes)
- **Risk**: None

## Technical Details

- **Affected file**: `src/app/sitemap.ts`

## Acceptance Criteria

- [ ] `/software` removed from sitemap
- [ ] `/mission` and `/tools` present in sitemap
- [ ] `npm run build` passes
