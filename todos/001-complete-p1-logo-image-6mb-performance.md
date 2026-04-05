---
status: pending
priority: p1
issue_id: "001"
tags: [code-review, performance, images, lcp]
dependencies: []
---

# 001: Logo Image 5.7MB Degrades LCP and Bloats Repository

## Problem Statement

`public/images/riccc-logo-v15.png` is a 2048x2048 RGBA PNG at **5.7 MB**. It is used in two places:
- `src/components/home/hero.tsx` — rendered at 400x400 with `priority` (preloaded, LCP candidate)
- `src/components/layout/header.tsx` — rendered at 40x40 on **every page**

While Next.js Image will serve optimized WebP/AVIF on Vercel, the massive source file causes:
1. **Cold-start LCP penalty** (1-3 seconds) — the image optimizer must decode 16MB uncompressed RGBA on first request
2. **Repository bloat** — 5.7MB binary in a git-backed CMS repo increases clone time for every deploy
3. **Header logo on every page** — the optimizer works from a 2048x2048 source even for a 40x40 output

## Findings

- **Performance Oracle**: Flagged as Critical. First visitor after each Vercel deploy faces the image optimizer cold start.
- **Architecture Strategist**: Confirmed the file is 5.7MB and properly referenced.

## Proposed Solutions

### Option A: Pre-optimize to WebP (Recommended)
Create two optimized files:
- `riccc-logo-800.webp` (800x800 for hero at 2x retina) — expect ~30-60 KB
- `riccc-logo-96.webp` (96x96 for header at 2x retina) — expect ~3-5 KB

Replace the single 5.7MB file with these two. **98.5% size reduction.**

**Pros:** Eliminates cold-start LCP penalty, dramatically reduces repo size
**Cons:** Two files to manage instead of one
**Effort:** Small
**Risk:** Low

### Option B: Single 800x800 source
Replace with a single 800x800 WebP (~40-80 KB). Let Next.js generate the 40px header variant.

**Pros:** Single source of truth
**Cons:** Still relies on optimizer for header size
**Effort:** Small
**Risk:** Low

## Recommended Action

_To be filled during triage_

## Technical Details

- **Affected files:** `src/components/home/hero.tsx`, `src/components/layout/header.tsx`, `public/images/riccc-logo-v15.png`
- **Components:** Hero, Header

## Acceptance Criteria

- [ ] Logo source image is under 100 KB
- [ ] Hero LCP score is under 2.5 seconds on mobile (Lighthouse)
- [ ] Header renders correctly at 40x40
- [ ] Hero renders correctly at 400x400 on retina displays

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-22 | Created from code review | Flagged by Performance Oracle as Critical |

## Resources

- [Next.js Image Optimization docs](https://nextjs.org/docs/app/building-your-application/optimizing/images)
