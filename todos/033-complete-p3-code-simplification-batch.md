---
status: complete
priority: p3
issue_id: "033"
tags: [code-review, simplification, quality]
dependencies: []
---

# 033: Code simplification opportunities (~20 LOC)

## Problem Statement

Several small over-engineering patterns identified across the codebase.

## Findings

- **Code Simplicity Reviewer**:
  1. `staff-grid.tsx`: `metaClass()` conditional column spans — hardcode instead (~15 LOC saved)
  2. `staff-grid.tsx:197`: `space-y-0` is a no-op — remove
  3. `pi-bio.tsx`: `getLeadParagraph()` over-defensive scanning — simplify to `blocks[1] ?? blocks[0]`
  4. `contact/inquiry-form.tsx`: `handleChange` uses generic `string` key into `FormState` — type hole (non-blocking)
  5. `contact/page.tsx`: `BentoCard` interface with 11 fields for 2 static cards — inline the JSX instead (YAGNI)
- **TypeScript Reviewer**: Confirmed handleChange type concern

## Proposed Solutions

Address individually. Priorities: remove `space-y-0` (trivial), simplify `metaClass` (easy), simplify `getLeadParagraph` (easy).

- **Effort**: Small per item
- **Risk**: Low
