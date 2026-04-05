---
status: pending
priority: p2
issue_id: "016"
tags: [code-review, typescript, quality]
dependencies: []
---

# 016: Untyped inline data arrays need explicit TypeScript interfaces

## Problem Statement

Several page files define large inline data arrays (`bentoCards`, `techStack`, `goals`, `trustSignals`) without explicit TypeScript interfaces. TypeScript infers union types from the array contents, making optional properties (like `badge`, `checklist`) fragile. The `isDark` check in tools/page.tsx compares raw Tailwind class strings (`item.bg === "bg-rush-dark-green text-white"`) which breaks silently on any class change.

## Findings

- **TypeScript Reviewer**: `bentoCards` has inconsistent shape (badge only on last item), `techStack` uses string-typed CSS classes with boolean derivation, form `handleChange` uses unsafe computed key.

## Proposed Solutions

### Option A: Add explicit interfaces to each data array

Define `BentoCard`, `TechStackItem`, etc. interfaces. Add a `variant: "dark" | "light"` field to tech stack items instead of comparing CSS class strings.

- **Effort**: Small (15 minutes)

## Technical Details

- **Affected files**: `src/app/contact/page.tsx`, `src/app/tools/page.tsx`, `src/app/mission/page.tsx`

## Acceptance Criteria

- [ ] `bentoCards` typed with explicit `BentoCard` interface
- [ ] `techStack` uses `variant` field instead of string comparison for `isDark`
- [ ] All inline data arrays have explicit type annotations
