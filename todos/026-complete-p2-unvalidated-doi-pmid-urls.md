---
status: pending
priority: p2
issue_id: "026"
tags: [code-review, security, validation]
dependencies: []
---

# 026: Unvalidated DOI and PMID values interpolated into URLs

## Problem Statement

DOI and PMID values from API responses and CMS-edited `spotlights.json` are interpolated directly into `<a href>` URLs without validation. A malformed DOI could alter URL semantics via path traversal or query injection.

## Findings

- **Security Sentinel**: Medium severity. DOI spec allows `#`, `?`, `/` characters.
- **TypeScript Reviewer**: Noted the CMS trust boundary — `spotlights.json` is editable by anyone with GitHub write access.

Files:
- `src/components/publications/pub-card.tsx` lines 50, 60
- `src/components/home/research-spotlights.tsx` lines 32-35

## Proposed Solutions

### Option A: Regex validation + encodeURIComponent (Recommended)
Validate PMIDs with `/^\d+$/`, DOIs with `/^10\.\d{4,}\/\S+$/`. Apply `encodeURIComponent()` when constructing URLs.

- **Pros**: Defense in depth, handles both API and CMS sources
- **Cons**: Regex could reject unusual but valid DOIs
- **Effort**: Small
- **Risk**: Low

## Acceptance Criteria

- [ ] PMIDs validated as numeric-only before URL interpolation
- [ ] DOIs validated against standard format before URL interpolation
- [ ] Invalid values fall back gracefully (no link rendered)
