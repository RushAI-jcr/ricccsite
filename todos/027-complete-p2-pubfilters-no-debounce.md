---
status: pending
priority: p2
issue_id: "027"
tags: [code-review, performance, react]
dependencies: []
---

# 027: PubFilters search rerenders on every keystroke with no debounce

## Problem Statement

The `filtered` array in PubFilters is recomputed on every character typed. With 300-500 publications, each keystroke triggers a full `.filter()` scan and re-renders the grouped/sorted list. The filtering also happens outside `useMemo`, creating a new array reference every render.

## Findings

- **Performance Oracle**: Critical. Noticeable input lag projected at 500+ publications.
- File: `src/components/publications/pub-filters.tsx` lines 16-22

## Proposed Solutions

### Option A: useDeferredValue (Recommended)
Use React 19's `useDeferredValue` for the search term. Move filtering into `useMemo`.

```tsx
const deferredSearch = useDeferredValue(search);
const filtered = useMemo(() => publications.filter(...), [publications, deferredSearch, yearFilter]);
```

- **Pros**: Idiomatic React 19, keeps input responsive, minimal code change
- **Cons**: None
- **Effort**: Small
- **Risk**: None

## Acceptance Criteria

- [ ] Search input remains responsive with 500+ publications
- [ ] Filtering logic is inside `useMemo` with correct dependencies
- [ ] No regression in filter accuracy
