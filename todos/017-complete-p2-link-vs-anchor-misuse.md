---
status: pending
priority: p2
issue_id: "017"
tags: [code-review, nextjs, quality]
dependencies: []
---

# 017: Next.js Link used for external URL, plain <a> for internal routes

## Problem Statement

Two link misuses:

1. `src/app/research/page.tsx` (line 149): Uses `<Link>` with `target="_blank"` for the external CLIF URL. This triggers unnecessary Next.js prefetching for a URL that will never use client navigation.

2. `src/app/news/page.tsx` (lines ~41-53): Uses plain `<a>` tags for internal routes (`/publications`, `/contact`). These should use `<Link>` for client-side navigation and prefetching.

## Findings

- **TypeScript Reviewer**: Flagged both as Medium severity.

## Proposed Solutions

### Option A: Swap Link/a tags (Recommended)

Use `<a>` for external URLs, `<Link>` for internal routes.

- **Effort**: Small (5 minutes)

## Acceptance Criteria

- [ ] External URLs use `<a>` with `target="_blank" rel="noopener noreferrer"`
- [ ] Internal routes use `next/link` `<Link>` component
