---
title: "Multi-Source Academic Publication Pipeline with Author Disambiguation"
category: integration-issues
tags:
  - pubmed-api
  - semantic-scholar
  - openalex
  - publication-dedup
  - author-disambiguation
  - isr-caching
  - academic-websites
modules:
  - pubmed.ts
  - semantic-scholar.ts
  - openalex.ts
  - merge-publications.ts
  - publications/page.tsx
severity: high
date: 2026-03-22
status: implemented
---

# Multi-Source Academic Publication Pipeline

## Problem

An academic lab website needs to display publications from multiple PIs (Juan Rojas and Kevin Buell). Key challenges:

1. **No single API has complete coverage** — PubMed misses preprints and CS conferences; Semantic Scholar rate-limits; Google Scholar has no API
2. **Author name collisions** — "Rojas JC" matches 265 PubMed results including a particle physicist, an entomologist, and a Congo dementia researcher
3. **Duplicate papers** — the same paper appears in multiple databases with slightly different metadata
4. **Non-English and off-topic papers** — basic science, tropical medicine, and insect biology papers from namesakes

## Solution: Three-Source Merge with Disambiguation

### Architecture

```
PubMed (author + affiliation query)  ──┐
Semantic Scholar (author name search) ──┼──→ merge-publications.ts ──→ deduplicated list
OpenAlex (author ID, disambiguated)  ──┘     (DOI-based dedup)        with citation counts
```

### Source Roles

| Source | Strength | Weakness | Our Usage |
|--------|----------|----------|-----------|
| **PubMed** | Gold standard for biomedical | No preprints, no CS papers | Primary metadata source |
| **Semantic Scholar** | Citation counts, CS coverage | Aggressive rate limiting (429s) | Citation enrichment |
| **OpenAlex** | 477M works, author IDs, no rate limits | Newer, less curated | Broadest coverage, gap-filler |

### Author Disambiguation Strategy

**PubMed:** Constrain by affiliation to eliminate namesakes:
```
((Rojas JC[Author] AND (Rush University[Affiliation] OR University of Chicago[Affiliation]))
 OR (Buell Kevin[Author] AND (Rush[Affiliation] OR UChicago[Affiliation] OR Vanderbilt[Affiliation])))
AND English[Language]
```

**Semantic Scholar:** Search by full name (less precise, but provides citation counts). Rate-limited — returns `[]` gracefully on 429.

**OpenAlex:** Use disambiguated author IDs (most reliable):
- Juan Rojas: `A5077904660` (117 works, ORCID `0000-0002-8561-4575`)
- Kevin Buell: `A5054927341` (75 works, ORCID `0000-0001-5718-3328`)

### Merge Logic (`merge-publications.ts`)

1. Start with PubMed results (best metadata)
2. Match Semantic Scholar papers by DOI — enrich with citation counts
3. Match OpenAlex papers by DOI — take higher citation count, backfill volume/issue/pages
4. Papers only in S2 or OpenAlex → add as new entries
5. Filter off-topic papers by title patterns (configurable in `site-config.json`)

### Off-Topic Filtering

Configurable `exclude_title_patterns` in `site-config.json`:
```json
[
  "drosophila", "tephritidae",          // entomologist namesake
  "congo", "kinshasa", "apolipoprotein", // dementia researcher namesake
  "htlv", "antiretroviral", "loiasis",   // infectious disease namesake
  "tuberculosis", "tb centre",           // UK TB researcher namesake
  "mice model", "rat model", "in vitro"  // basic science
]
```

This reduced 174 raw papers → 145 after filtering.

### ISR Caching with Stale Preservation

```typescript
// If all 3 APIs fail, throw so ISR preserves the previous cached page
if (publications.length === 0) {
  throw new Error("No publications returned — preserving stale cache");
}
```

Per Next.js docs: "If an error is thrown while attempting to revalidate, the last successfully generated data will continue to be served from the cache." This prevents a 24-hour window of showing zero publications.

## Key Decisions

1. **OpenAlex author IDs over name search** — IDs are disambiguated by OpenAlex's ML system, much more reliable than searching "Juan Rojas" which returns physicists, engineers, etc.

2. **DOI-based dedup over title matching** — DOIs are unique identifiers. Title matching is fragile (PubMed and OpenAlex sometimes have slightly different title formatting).

3. **Configurable exclude patterns** — stored in `site-config.json` (CMS-editable), not hardcoded. New namesake collisions can be fixed without code changes.

4. **Graceful degradation** — each API client returns `[]` on failure. If S2 is rate-limited (common), PubMed + OpenAlex still provide full coverage. If all fail, ISR serves stale cache.

5. **Citation count: max across sources** — if PubMed shows 0 citations and OpenAlex shows 15, we display 15.

## Prevention

- **Always use author IDs (OpenAlex, ORCID) when available** — name-based search is inherently ambiguous
- **Always constrain PubMed by affiliation** — `Author[Author] AND Institution[Affiliation]` eliminates most namesakes
- **Add new exclude patterns to `site-config.json`** when new namesake collisions appear — no code deployment needed
- **Monitor the publication count** — if it suddenly jumps by 50+, a new namesake may have been indexed

## References

- PubMed E-utilities API: https://www.ncbi.nlm.nih.gov/books/NBK25501/
- Semantic Scholar API: https://api.semanticscholar.org/api-docs/
- OpenAlex API: https://docs.openalex.org/
- Next.js ISR error handling: https://nextjs.org/docs/app/guides/incremental-static-regeneration
- Related: `docs/solutions/architecture/git-cms-over-custom-admin-backend.md`
- Related: `docs/solutions/architecture/rush-brand-color-system-mapping.md`
