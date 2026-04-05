---
title: Two-pass code review fixes for RICCC Lab website after Stitch editorial redesign
date: 2026-04-05
category: security-issues
tags: [next-js, typescript, tailwind, code-review, security, design-system, architecture, refactoring, url-validation, doi, pmid, vitest]
severity: high
components: [src/lib/url.ts, src/components/publications/pub-card.tsx, src/components/home/research-spotlights.tsx, src/components/team/member-social-links.tsx, src/components/team/staff-grid.tsx, src/app/contact/page.tsx, src/app/tools/page.tsx, src/app/research/page.tsx, src/lib/research-pillars.ts]
root_cause: Post-redesign drift introduced unvalidated external URLs (DOI/PMID href injection via encodeURIComponent), legacy color tokens not migrated to Stitch surface tokens, positional array coupling for research pillars, and YAGNI over-engineering across multiple components
resolution: Applied 35 targeted fixes across security (URL validators + encodeURIComponent removal), design-system (token migration to MD3/Stitch surfaces), architecture (id-based pillar lookup, deduped main landmark), and code simplification (flattened interfaces, shared validation helper); added Vitest coverage for new validators
---

# Two-Pass Code Review: 35 Fixes After Stitch Editorial Redesign

## Problem Statement

After a "Stitch" editorial redesign of the RICCC Lab website (Next.js 15 + TypeScript + Tailwind v4), a two-pass multi-agent code review identified 35 issues across security, design-system consistency, architecture, code simplification, and testing. The highest-severity findings were security gaps in URL construction for external links (DOIs, PMIDs).

## Solution

### 1. DOI / PMID URL Validation

**Never use `encodeURIComponent` on DOIs.** The `/` in DOIs must remain literal for `doi.org` resolution.

```typescript
// src/lib/url.ts
export function isValidDoi(doi: string): boolean {
  return /^10\.\d{4,9}\/[^\s]+$/.test(doi);
}

export function isValidPmid(pmid: string): boolean {
  return /^\d+$/.test(pmid);
}

// Usage in pub-card.tsx / research-spotlights.tsx
const doiUrl = isValidDoi(pub.doi) ? `https://doi.org/${pub.doi}` : null;
const pmidUrl = isValidPmid(pub.pmid) ? `https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}/` : null;
```

`encodeURIComponent(pub.doi)` converts `/` to `%2F`, producing `https://doi.org/10.1001%2Fjama.2024.12345` — a broken URL that doi.org rejects.

### 2. `replace_all` Substring Trap

Before running `replace_all` with `old_string` -> `new_string`, verify that `old_string` does not appear as a substring inside `new_string`. If it does, already-correct instances will be mutated.

```
replace_all: "tracking-wide" -> "tracking-widest"
# File already contains: "tracking-widest"
# Result: "tracking-widestst"  -- double-suffix corruption
```

Prevention: use a more-specific `old_string` with a trailing delimiter (e.g., `tracking-wide"`) or verify file contents after any `replace_all` where the old string is a prefix of the new string.

### 3. Design-System Token Audit

Grep `src/` for raw Tailwind tokens before shipping any redesign pass. Canonical mappings for the Stitch schema:

| Raw / legacy token | Stitch replacement |
|---|---|
| `bg-white` | `bg-rush-surface` |
| `bg-rush-light-gray` | `bg-rush-surface-container-high` |
| `text-rush-umber` | `text-rush-on-surface-variant` |
| `border-rush-on-surface/10` | `border-rush-outline-variant/10` |

Token schema is authoritative at `src/app/globals.css` lines 34-44. Run a grep pass for `bg-white`, `text-white` (where not on a dark background), and any color not prefixed `rush-` before each review pass.

### 4. Stable IDs for Data Arrays

Array-index access (`themes[0]`) breaks silently when items are reordered. Add a stable `id` field and a lookup guard.

```typescript
interface ResearchPillar {
  id: string;
  title: string;
  short: string;
  full: string;
}

function pillar(id: string): ResearchPillar {
  const found = RESEARCH_PILLARS.find((p) => p.id === id);
  if (!found) throw new Error(`ResearchPillar "${id}" not found`);
  return found;
}

// Usage: pillar("icu-data-science").title instead of themes[0].title
```

Never use `!` non-null assertion on `find()` — use an explicit `throw` so mistyped IDs fail at build time.

### 5. Social Links DRY Extraction

Duplicating validation logic between a predicate function and a render component causes silent drift. Extract a shared `getSocialItems` helper.

```typescript
function getSocialItems(member: TeamMember): SocialItem[] {
  const items: SocialItem[] = [];
  if (member.linkedin && isSafeUrl(member.linkedin) && isLinkedInUrl(member.linkedin)) {
    items.push({ key: "linkedin", href: member.linkedin, label: `${member.name} on LinkedIn` });
  }
  // ...other platforms with same pattern
  return items;
}

// Predicate: getSocialItems(member).length > 0
// Renderer: consumes the same list — no divergence possible
```

### 6. YAGNI: Inline Static Content

An interface + data array for 2 static items adds abstraction overhead with no benefit. Delete the interface and array; write the JSX directly. Rule: if the number of items is fixed and small (<=3), inline JSX is simpler than a data-driven abstraction.

### 7. Border Radius Consistency

Standardized 8 instances of `rounded-md` to `rounded-sm` across tools, contact, and mission pages. Kept `rounded-md` in header mobile nav (touch targets). The design system convention: `rounded-sm` for cards/containers, `rounded-full` for avatars/pills.

### 8. CSP `form-action` Directive

Added `mailto:` to CSP `form-action` in `next.config.ts`. The inquiry form uses `window.location.href = mailto:...` (navigation, not form submission), but a future refactor to standard form submission would silently break without this.

## Prevention Strategies

### Automatable

1. **DOI encoding**: Grep CI for `encodeURIComponent.*doi` (case-insensitive) — flag and fail.
2. **Token drift**: Maintain a forbidden-tokens list (`bg-white`, `text-rush-umber`, etc.) and run grep-based CI checks against `src/**/*.tsx` on every PR.
3. **Positional coupling**: Flag numeric literal array access (`pillars[0]`) on content arrays — prefer named-key maps or ID fields.
4. **Missing validator tests**: Configure Vitest coverage thresholds for `src/lib/url.ts` — new exported validators without tests fail CI.

### Requires Human Judgment

- Deciding when an interface has grown too large vs. when future fields are genuinely anticipated.
- Determining which legacy tokens are intentional overrides vs. true drift.
- Reviewing codemod output for correctness after token renames — visual QA is still needed.

## Testing Guidance

Every validator in `src/lib/url.ts` should have four test sections:

1. **Valid canonical forms** — standard inputs that must pass
2. **Invalid / malformed inputs** — empty string, wrong prefix, non-numeric
3. **Encoding / URL interaction** — confirm no double-encoding
4. **Edge cases specific to downstream use** — real-world DOIs from the lab's publications

When a bug is fixed (e.g., the `encodeURIComponent` DOI issue), add a regression test named with the issue pattern.

## Related Documentation

- [`docs/solutions/integration-issues/2026-04-04-stitch-redesign-code-review-13-fixes.md`](../integration-issues/2026-04-04-stitch-redesign-code-review-13-fixes.md) — First-pass code review (findings 001-024)
- [`docs/solutions/architecture/rush-brand-color-system-mapping.md`](../architecture/rush-brand-color-system-mapping.md) — Authoritative Rush brand token reference
- [`docs/solutions/architecture/multi-source-publication-aggregation.md`](../architecture/multi-source-publication-aggregation.md) — URL validation patterns, CSP whitelisting, `isSafeUrl()` usage
- [`docs/solutions/architecture/git-cms-over-custom-admin-backend.md`](../architecture/git-cms-over-custom-admin-backend.md) — YAGNI decision framework, CMS trust boundary

## Cross-References

- Todos 025-035 in `todos/` directory (all complete)
- Plan: `docs/plans/2026-04-04-feat-stitch-editorial-redesign-plan.md`
