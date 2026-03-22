---
title: "Multi-Source Publication Aggregation: PubMed + Semantic Scholar + OpenAlex"
description: "Three-API publication discovery system with DOI-based deduplication, configurable content filtering, citation enrichment, and AMA citation formatting for academic lab websites."
category: architecture
tags:
  - publication-aggregation
  - api-integration
  - deduplication
  - security
  - performance
  - next-js
modules:
  - src/lib/types.ts
  - src/lib/pubmed.ts
  - src/lib/semantic-scholar.ts
  - src/lib/openalex.ts
  - src/lib/merge-publications.ts
  - src/lib/cite.ts
  - src/lib/url.ts
  - src/lib/config.ts
  - src/components/publications/pub-card.tsx
  - src/components/publications/pub-filters.tsx
  - content/site-config.json
  - next.config.ts
date: 2026-03-22
---

# Multi-Source Publication Aggregation System

## Problem

Academic lab websites need to display publications automatically without manual curation. A single API (PubMed) misses preprints and conference papers, lacks citation counts, and returns false matches for common author names. Building a multi-source system introduces deduplication, metadata conflicts, security concerns, and performance challenges.

## Root Cause

Three independent APIs describe the same research output using different identifiers and metadata schemas. Each has different strengths:

| API | Strength | Weakness |
|-----|----------|----------|
| PubMed | Authoritative biomedical metadata, volume/issue/pages | No citation counts, misses preprints |
| Semantic Scholar | Fast citation metrics | Name-based search produces false matches |
| OpenAlex | Broadest coverage, precise author IDs, biblio fields | Less common in medical informatics |

## Solution

### Architecture

```
PubMed (author+affiliation query)  ──┐
Semantic Scholar (per-author name) ──┤── Promise.all() ──→ mergePublications()
OpenAlex (per-author ID)           ──┘        │
                                              ↓
                                    DOI-based dedup (Map)
                                              ↓
                                    Enrich: max citations, backfill biblio
                                              ↓
                                    Filter: configurable exclude patterns
                                              ↓
                                    Sort by year → ISR cache (24h)
                                              ↓
                                    Client: useMemo grouping + citation sort
```

### Key Files

**Shared type system** (`src/lib/types.ts`):
```typescript
export interface Publication {
  pmid: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  doi: string | null;
  volume?: string;
  issue?: string;
  pages?: string;
  citationCount?: number;
  source: "pubmed" | "semantic-scholar" | "openalex" | "both";
}

export function formatAuthorList(names: string[], max = 3): string {
  if (names.length === 0) return "";
  return names.length > max
    ? `${names.slice(0, max).join(", ")}, et al.`
    : names.join(", ");
}
```

**Three-source merge** (`src/lib/merge-publications.ts`):
- PubMed results are the base layer (cloned, never mutated)
- S2 papers enrich with citation counts; new papers added with `source: "semantic-scholar"`
- OpenAlex enriches with citation counts AND backfills volume/issue/pages; new papers added with `source: "openalex"`
- Dedup key: `doi.toLowerCase()` in a `Map<string, Publication>`
- Citation count: `Math.max()` across all sources
- Exclude patterns read from `siteConfig.excludeTitlePatterns` (CMS-editable)

**OpenAlex biblio extraction** (`src/lib/openalex.ts`):
- Author ID validated with regex `^A\d+$` before API call
- `biblio` field requested via `select=...biblio` parameter
- Page range: `firstPage-lastPage` (skipped if equal)
- DOI prefix `https://doi.org/` stripped before storage

### Configurable Content Filtering

Wrong-author papers are filtered via title substring matching. Patterns live in `content/site-config.json` (CMS-editable):

```json
"exclude_title_patterns": [
  "drosophila", "tephritidae", "anastrepha", "diptera",
  "congo", "kinshasa", "apolipoprotein",
  "htlv", "human t-lymphotropic", "antiretroviral", "loiasis",
  "tuberculosis", "pulmonary tb", "tb centre", "tb center",
  "mice model", "mouse model", "rat model", "in vitro", "cell line",
  "career partnerships", "maternal diseases",
  "inflammatory bowel disease"
]
```

### Security Hardening

1. **CSP headers** (`next.config.ts`): `connect-src` whitelists only the 3 API domains
2. **URL validation** (`src/lib/url.ts`): `isSafeUrl()` blocks `javascript:` and `data:` schemes for CMS-supplied links
3. **Author ID validation**: OpenAlex `authorId` must match `^A\d+$`
4. **Sveltia CMS pinned**: `@sveltia/cms@0.40.0` (not `@latest`)
5. **API keys server-only**: `process.env` in server components, no `NEXT_PUBLIC_` prefix

### Performance

1. **Parallel fetches**: `Promise.all()` for all 3 APIs (8-10s timeouts each)
2. **S2 limit=5**: Author search returns 5 candidates (only `data[0]` used)
3. **ISR 24h**: `revalidate: 86400` caches the merged result
4. **useMemo**: Client-side grouping/sorting only recomputes when filter changes
5. **Non-mutating sort**: `[...arr].sort()` prevents React stale-reference bugs

## Prevention Strategies

| Risk | Prevention | Frequency |
|------|-----------|-----------|
| Wrong-author papers | Maintain `exclude_title_patterns` in CMS | Quarterly review |
| API key exposure | Rotate keys, use Vercel env vars, `.gitignore` | 90 days |
| Mutable sort bugs | `[...array].sort()` + `useMemo` with correct deps | Code review |
| Type drift when adding sources | All sources map to shared `Publication` interface | TypeScript compiler |
| Malicious CMS URLs | `isSafeUrl()` validation, CSP headers | Code review |

## When Adding a New Publication Source

1. Create API client in `src/lib/newapi.ts` with timeout + abort controller
2. Map response to `Publication` type using `formatAuthorList()`
3. Add source literal to union: `"pubmed" | "semantic-scholar" | "openalex" | "newapi" | "both"`
4. Add merge pass in `merge-publications.ts` (DOI dedup, max citations, backfill fields)
5. Add API domain to CSP `connect-src` in `next.config.ts`
6. Add parallel fetch in `publications/page.tsx` `Promise.all()`

## Related Documentation

- [Git CMS over Custom Admin Backend](./git-cms-over-custom-admin-backend.md) — why Sveltia CMS was chosen
- [Rush Brand Color System Mapping](./rush-brand-color-system-mapping.md) — brand color governance
