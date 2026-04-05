---
status: pending
priority: p2
issue_id: "004"
tags: [code-review, architecture, quality]
dependencies: []
---

# 004: Hand-Rolled Markdown Parser in pi-bio.tsx is Fragile

## Problem Statement

`src/components/team/pi-bio.tsx` (lines 61-84) contains an inline markdown-like parser that handles `**headings**`, `\n- bullet lists`, and plain paragraphs. The parser has multiple edge cases that will break:

1. Bold heading detection fails if heading has trailing whitespace
2. Bullet list detection matches paragraphs containing `- ` mid-sentence
3. First item in split includes pre-bullet text, rendered as a `<li>` incorrectly
4. Bare URLs in content (e.g., `https://clif-icu.com/` in Kevin Buell's bio) are not linkified
5. Parsing logic is inlined inside JSX rather than extracted

The project uses MDX files but never installed `next-mdx-remote` — content is consumed via `gray-matter` as raw strings.

## Findings

- **TypeScript Reviewer**: Flagged as HIGH — should be extracted to separate component
- **Architecture Strategist**: Confirmed fragility, recommended hardening or using `micromark`/`marked`
- **Simplicity Reviewer**: Assessed as proportional to the problem but noted the bullet-list edge case

## Proposed Solutions

### Option A: Extract and harden (Recommended)
Extract to `src/components/team/bio-content.tsx` with:
- `.trim()` before heading checks
- Proper bullet list parsing (split on `\n`, filter lines starting with `- `)
- Comment documenting supported subset

**Pros:** Minimal change, testable, fixes edge cases
**Cons:** Still hand-rolled
**Effort:** Small
**Risk:** Low

### Option B: Use `marked` or `micromark`
Install lightweight markdown library (~6KB gzipped) for correct rendering.

**Pros:** Handles all markdown patterns correctly, including inline links
**Cons:** New dependency
**Effort:** Small
**Risk:** Low

### Option C: Install `next-mdx-remote` (long-term)
As originally planned in the project docs. Full MDX support.

**Pros:** Comprehensive, aligns with original architecture plan
**Cons:** Heavier dependency for current needs
**Effort:** Medium
**Risk:** Low

## Technical Details

- **Affected files:** `src/components/team/pi-bio.tsx`

## Acceptance Criteria

- [ ] Bio rendering handles headings with trailing whitespace
- [ ] Bullet lists render correctly even when first item has no preceding `\n`
- [ ] Parser is extracted to a testable component or utility

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-22 | Created from code review | Flagged by 3 review agents |
