---
status: pending
priority: p3
issue_id: "023"
tags: [code-review, pattern-consistency, design-system]
dependencies: []
---

# 023: CTA button and link style inconsistencies across pages

## Problem Statement

Multiple competing patterns for primary CTAs, secondary CTAs, and inline links:

**Primary CTA**: 5 variants (missing `rounded-sm` on hero, `rush-green` on funding, different sizes on mission, different hover on nav).
**Secondary CTA**: Hero outline CTA missing `rounded-sm`, uses different border token.
**Inline links**: 4 different treatments (underline+offset, border-bottom, underline+arrow, monospace border).

Also: `tracking-tighter` used in 4 spots vs `tracking-tight` everywhere else. `py-20` on mission metrics vs `py-24` on home metrics.

## Findings

- **Pattern Recognition**: Detailed table of all competing patterns.

## Proposed Solutions

### Option A: Standardize to one primary, one secondary, one inline link pattern

Document the canonical patterns and update outliers. Consider extracting shared `EditorialLink` utility.

- **Effort**: Medium (30 minutes)

## Acceptance Criteria

- [ ] All primary CTAs use consistent radius, padding, font-weight, and hover
- [ ] Hero outline CTA matches other secondary CTAs
- [ ] Mission CTA section uses left-aligned text (CLAUDE.md anti-pattern: no centered body text)
