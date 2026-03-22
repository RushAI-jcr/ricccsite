# Testing Infrastructure for RICCC Lab Website

**Date:** 2026-03-22
**Status:** Ready for planning

## What We're Building

Add Vitest testing to the RICCC Lab website, covering the core library modules (pure functions). Rely on Vercel's built-in CI for build/deploy checks — no separate GitHub Actions pipeline.

## Why This Approach

- **Vitest over Jest**: Faster, native TypeScript/ESM support, less config for Next.js projects
- **Core lib only**: Pure functions (merge, cite, formatAuthorList, isSafeUrl) are high-value, easy to test, no mocking needed
- **Vercel as CI**: Already runs `npm run build` on every push — adding a `test` script to the build pipeline is sufficient
- **No component tests yet**: React component testing adds complexity (jsdom, render utils) for lower ROI on a content site

## Key Decisions

1. **Framework**: Vitest
2. **Scope**: `src/lib/merge-publications.ts`, `src/lib/cite.ts`, `src/lib/types.ts`, `src/lib/url.ts`
3. **CI/CD**: Vercel only — add `npm run test` to build script or Vercel pre-build
4. **No API mocking**: Skip pubmed.ts, semantic-scholar.ts, openalex.ts (would require HTTP mocking)
5. **No component tests**: Skip pub-card, pub-filters, pi-bio (would require jsdom)

## Test Coverage Plan

| Module | Functions to Test | Priority |
|--------|------------------|----------|
| `src/lib/merge-publications.ts` | `mergePublications()` — dedup, enrichment, exclude patterns, sorting | High |
| `src/lib/cite.ts` | `formatAMA()` — full citation, missing fields, edge cases | High |
| `src/lib/types.ts` | `formatAuthorList()` — truncation, empty, single author | Medium |
| `src/lib/url.ts` | `isSafeUrl()` — https, http, javascript:, data:, malformed | Medium |

## Open Questions

None — all decisions resolved.
