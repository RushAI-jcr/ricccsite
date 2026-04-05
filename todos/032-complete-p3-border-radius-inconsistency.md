---
status: complete
priority: p3
issue_id: "032"
tags: [code-review, design-system, pattern-consistency]
dependencies: []
---

# 032: Mixed rounded-md and rounded-sm across cards and containers

## Problem Statement

The established pattern for cards/containers is `rounded-sm`. Twelve instances across tools, contact, mission, and header use `rounded-md` instead.

## Findings

- **Pattern Recognition**: 12 instances identified in tools/page.tsx (6), contact/page.tsx (2), mission/page.tsx (1), header.tsx (3).

## Proposed Solutions

Replace `rounded-md` with `rounded-sm` in the 12 identified instances. Header mobile nav items may intentionally differ — verify visually.

- **Effort**: Small
- **Risk**: Low (subtle visual change)
