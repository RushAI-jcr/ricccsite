---
title: "Add Vitest Tests for Core Library Modules"
type: feat
date: 2026-03-22
---

# Add Vitest Tests for Core Library Modules

## Overview

Set up Vitest and write unit tests for the 4 core lib modules: `merge-publications`, `cite`, `types`, and `url`. These are pure functions with no API or DOM dependencies — high-value, easy to test.

## Acceptance Criteria

- [x] Vitest installed and configured with path aliases
- [x] `npm run test` script works
- [x] Tests pass for `mergePublications()` — dedup, enrichment, filtering, sorting
- [x] Tests pass for `formatAMA()` — full/partial citations, edge cases
- [x] Tests pass for `formatAuthorList()` — truncation, empty, boundary
- [x] Tests pass for `isSafeUrl()` — protocols, malformed, attack vectors
- [x] `npm run build` still passes (no interference)

## Implementation Steps

### Phase 1: Setup (5 min)

Install Vitest and configure:

```bash
npm install -D vitest
```

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Add scripts to `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

### Phase 2: Test Files (20 min)

Create 4 test files in `src/lib/__tests__/`:

#### `url.test.ts` — `isSafeUrl()`

| Test Case | Input | Expected |
|-----------|-------|----------|
| HTTPS URL | `https://example.com` | `true` |
| HTTP URL | `http://example.com` | `true` |
| javascript: | `javascript:alert(1)` | `false` |
| data: | `data:text/html,...` | `false` |
| file: | `file:///etc/passwd` | `false` |
| ftp: | `ftp://example.com` | `false` |
| Empty string | `""` | `false` |
| Malformed | `not a url` | `false` |
| URL with path/query | `https://example.com/path?q=1` | `true` |

#### `types.test.ts` — `formatAuthorList()`

| Test Case | Input | Expected |
|-----------|-------|----------|
| Empty array | `[]` | `""` |
| Single name | `["Smith"]` | `"Smith"` |
| Exactly 3 (default max) | `["A", "B", "C"]` | `"A, B, C"` |
| 4 names (truncated) | `["A", "B", "C", "D"]` | `"A, B, C, et al."` |
| Custom max=1 | `["A", "B"], 1` | `"A, et al."` |

#### `cite.test.ts` — `formatAMA()`

| Test Case | Key Fields | Expected Pattern |
|-----------|-----------|-----------------|
| Full citation | all fields | `Authors. Title. Journal. 2024;12(3):45-50. doi:10.1/x` |
| No volume/issue/pages | journal+year only | `Authors. Title. Journal. 2024.` |
| No journal | year only | `Authors. Title. 2024.` |
| No year | journal only | `Authors. Title. Journal.` |
| No journal or year | title+authors only | `Authors. Title.` |
| Title with period | `"Title."` | No double period |
| With DOI | doi present | Ends with `doi:10.1/x` |
| No DOI | doi null | No doi suffix |

#### `merge-publications.test.ts` — `mergePublications()`

| Test Case | Scenario |
|-----------|----------|
| Empty inputs | All three arrays empty → `[]` |
| PubMed only | No S2/OA → returns PubMed pubs sorted by year |
| DOI dedup | Same DOI in PubMed+S2 → single pub with `source: "both"` |
| Citation max | PubMed=5, S2=10 → result has `citationCount: 10` |
| OA backfill | PubMed missing volume, OA has it → volume filled |
| OA-only paper | DOI not in PubMed/S2 → added with `source: "openalex"` |
| Exclude filter | Title contains "drosophila" → filtered out |
| Year sorting | 2024, 2022, 2023 → sorted as 2024, 2023, 2022 |
| No DOI papers | S2 paper without DOI → not added (current behavior) |

**Config mocking:** Use `vi.mock("./config")` to control `excludeTitlePatterns` in tests.

### Phase 3: Verify (2 min)

```bash
npm run test        # all tests pass
npm run build       # build still works
npm run lint        # no lint errors
```

## Technical Details

**Files to create:**
- `vitest.config.ts`
- `src/lib/__tests__/url.test.ts`
- `src/lib/__tests__/types.test.ts`
- `src/lib/__tests__/cite.test.ts`
- `src/lib/__tests__/merge-publications.test.ts`

**Files to modify:**
- `package.json` — add vitest devDep + test scripts

**No changes to:**
- `tsconfig.json` (Vitest reads it automatically)
- Any source files
- Build or deploy config

## References

- Brainstorm: `docs/brainstorms/2026-03-22-testing-infrastructure-brainstorm.md`
- Solution doc: `docs/solutions/architecture/multi-source-publication-aggregation.md`
