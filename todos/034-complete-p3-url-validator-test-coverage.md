---
status: complete
priority: p3
issue_id: "034"
tags: [code-review, testing, quality]
dependencies: []
---

# 034: Missing test coverage for isValidDoi / isValidPmid

## Problem Statement

`isValidDoi` and `isValidPmid` in `src/lib/url.ts` are security-adjacent validators (they gate `href` construction for external links) but have no unit tests. The existing `isSafeUrl` and `isLinkedInUrl` functions do have Vitest coverage.

## Findings

- **TypeScript Reviewer**: New validators need edge-case tests (empty string, whitespace, prefix-only `10.`)
- **Security Sentinel**: Validators are used to gate URL construction — test coverage provides regression safety

## Proposed Solutions

Add test cases in `src/lib/__tests__/url.test.ts` alongside existing `isSafeUrl`/`isLinkedInUrl` tests.

Example cases:
- Valid DOI: `10.1001/jama.2024.12345` → true
- Invalid DOI: `11.1001/jama` (wrong prefix), `10.` (incomplete), `""` → false
- Valid PMID: `12345678` → true
- Invalid PMID: `abc`, `123.45`, `""`, `-1` → false

- **Effort**: Small
- **Risk**: None
