---
title: "Stitch Editorial Redesign — Comprehensive Code Review and Fixes (012-024)"
date: 2026-04-04
category: integration-issues
tags:
  - nextjs
  - typescript
  - tailwind-css-v4
  - material-design-3
  - rush-brand
  - stitch-redesign
  - performance
  - security
  - design-system
  - code-review
severity:
  P1_critical: 3
  P2_important: 8
  P3_nice_to_have: 2
  total: 13
status: resolved
affected_modules:
  - src/app/sitemap.ts
  - src/components/home/metrics-bar.tsx
  - src/components/layout/social-links.tsx
  - src/lib/research-pillars.ts
  - src/app/research/page.tsx
  - src/app/mission/page.tsx
  - src/components/home/lab-mission.tsx
  - src/components/home/hero.tsx
  - src/app/contact/page.tsx
  - src/app/tools/page.tsx
  - src/app/news/page.tsx
  - src/app/not-found.tsx
  - src/components/publications/pub-card.tsx
  - src/components/publications/pub-filters.tsx
  - src/components/home/research-spotlights.tsx
  - src/components/team/member-social-links.tsx
  - src/components/contact/inquiry-form.tsx
  - src/components/team/compact-member-grid.tsx
  - src/components/team/staff-grid.tsx
  - src/components/layout/footer.tsx
  - src/components/layout/header.tsx
  - src/components/home/cta-banner.tsx
  - src/app/globals.css
root_cause: >
  Rapid feature development during the Stitch editorial redesign introduced
  technical debt across multiple layers: stale routes after page renames,
  animation lifecycle mismanagement (rAF without cleanup), inverted link
  primitives, hardcoded data duplicated across files, incomplete token
  migration, missing responsive image sizing, inconsistent border-radius and
  CTA patterns, and unvalidated user-supplied identifiers in URLs.
symptoms:
  - Sitemap advertised non-existent /software route and omitted /mission
  - rAF animation IDs accumulated without cancellation on unmount
  - Social-link icons invisible (white text on light background)
  - Research pillars defined in three files, drifting out of sync
  - PI names hardcoded outside the CMS content pipeline
  - External links used Next.js Link; internal routes used bare anchors
  - Legacy color tokens persisted in unmigrated components
  - ORCID/GitHub URLs accepted without format validation
  - Dead CSS keyframes, unused props, no-op filters in bundle
  - Inconsistent border-radius (rounded-xl/2xl vs project-standard rounded-sm)
  - All Image components missing sizes prop, forcing full-width srcsets
  - CTA buttons mixed styles, hover behaviors, and letter-spacing values
---

# Stitch Editorial Redesign — Comprehensive Code Review and Fixes

A multi-agent code review of the RICCC Lab website after the Stitch editorial redesign produced 13 findings across 23 files. All were resolved in a single session: 3 P1 (critical), 8 P2 (important), 2 P3 (nice-to-have).

## Root Cause Analysis

The 13 fixes trace to three systemic root causes:

**1. Rapid feature accretion without a shared contract layer.** The site grew through successive feature commits without establishing shared constants or interfaces. This produced duplicated pillar descriptions across 3 files, hardcoded PI data in 2 places, untyped data arrays, and inconsistent design tokens — each page author picked whatever token name looked right (`rush-charcoal` vs `rush-on-surface`, `rounded-xl` vs `rounded-sm`).

**2. Copy-paste component authoring.** Components were built in isolation, copying patterns without verifying correctness in context. This led to `<Link>` used for external URLs (copied from internal link patterns), `text-white` classes on social links (copied from a dark-background context into a light one), inline SVG checkmarks duplicated instead of using the existing Lucide icon library, and CSS animations defined but never wired to any element.

**3. Missing cleanup pass after renames and refactors.** The `/software` to `/tools` rename updated the page but not `sitemap.ts`. The `FundingLogos` component name survived long after its role changed. The GitHub org URL `RushAI-jcr` persisted after the org was renamed. The `requestAnimationFrame` loop was added without a corresponding cleanup in the useEffect return.

## Solution

### P1 — Critical: Runtime Bugs and SEO Breakage

**Sitemap stale routes (012):** Replaced dead `/software` entry with `/tools`, added missing `/mission` route in `sitemap.ts`.

**rAF animation leak (013):** Merged two separate useEffects into one. Tracked the rAF ID through the animation loop and called `cancelAnimationFrame(rafId)` in cleanup alongside `observer.disconnect()`. Eliminated the unnecessary `prefersReducedMotion` useRef and rAF wrapper in the reduced-motion path.

**White-on-light contrast (014):** Replaced `text-white/70 hover:text-white` with semantic surface tokens (`text-rush-on-surface-variant hover:text-rush-dark-green`) that work on any background.

### P2 — Important: Maintainability and Correctness

**DRY pillars + dynamic PIs (015):** Created `src/lib/research-pillars.ts` with `RESEARCH_PILLARS` array (title, short, full descriptions). All 3 consumers import from it. Hero and mission page load PIs from `getAllTeamMembers()` filtered by `tier === "pi"`, so adding a PI in the CMS automatically updates both pages.

**Typed data arrays (016):** Added `BentoCard` and `TechStackItem` TypeScript interfaces. Replaced fragile `item.bg === "bg-rush-dark-green text-white"` string comparison with typed `variant: "dark" | "light"` discriminant.

**Link vs anchor (017):** Swapped `<Link>` to `<a>` for external CLIF URL in research page, `<a>` to `<Link>` for internal routes in news page.

**Legacy token migration (018):** Migrated 4 component files from old tokens (`rush-charcoal`, `rush-mid-gray`, `rush-green`, `rush-umber`, `border-gray-300`) to Stitch tokens (`rush-on-surface`, `rush-on-surface-variant`, `rush-dark-green`, `border-rush-outline-variant`).

**Security hardening (019):** Added regex validation for ORCID (`/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/`) and GitHub usernames before URL interpolation. Added `maxLength` to inquiry form inputs (name: 200, email: 254, proposal: 2000).

**Dead code cleanup (020):** Removed unused CSS keyframes (`float`, `fade-in-up`), dead `color` prop on CompactMemberGrid, no-op `.filter((r) => r.href)` on footer resources.

**Radius consistency (021):** Standardized 6 component files from mixed `rounded-xl`/`rounded-2xl`/`rounded-lg` to `rounded-sm`.

**Image sizes prop (022):** Added `sizes` to all `<Image>` components: hero (`33vw`), header (`36px`), staff photos (`72px`), spotlights (`288px`), mission PI photos (`112px`).

### P3 — Polish: Visual Consistency and Simplification

**CTA consistency (023):** Unified border-radius, border tokens, hover behavior, and letter-spacing across hero CTAs, nav CTA, and CTA banner. Left-aligned mission CTA text (centered body text is a project anti-pattern).

**Misc simplification (024):** Replaced duplicate inline SVGs with Lucide `Check`. Renamed `FundingLogos` to `CtaBanner`. Removed ~50 LOC of placeholder panels and a decorative half-circle div from the research page. Fixed stale GitHub org URL.

## Code Examples

### rAF Animation Leak Fix (013) — before/after

**Before** (two effects, no rAF cancellation):
```tsx
const prefersReducedMotion = useRef(false);

useEffect(() => {
  prefersReducedMotion.current = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
}, []);

useEffect(() => {
  if (prefersReducedMotion.current) {
    requestAnimationFrame(() => setCount(target)); // unnecessary rAF wrapper
    return;
  }
  // ... animation loop spawns rAF — never cancelled
  return () => observer.disconnect(); // only disconnects observer
}, [target, hasAnimated]);
```

**After** (single effect, rAF tracked and cancelled):
```tsx
useEffect(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setCount(target);
    return;
  }

  let rafId: number;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !hasAnimated) {
      setHasAnimated(true);
      const start = performance.now();
      function animate(now: number) {
        // ... counter logic ...
        if (progress < 1) rafId = requestAnimationFrame(animate);
      }
      rafId = requestAnimationFrame(animate);
    }
  }, { threshold: 0.5 });

  if (ref.current) observer.observe(ref.current);
  return () => {
    observer.disconnect();
    cancelAnimationFrame(rafId);
  };
}, [target, hasAnimated]);
```

### Typed Discriminant Replacing String Comparison (016)

**Before:**
```tsx
const isDark = item.bg === "bg-rush-dark-green text-white"; // breaks silently on class change
```

**After:**
```tsx
interface TechStackItem {
  variant: "dark" | "light";
  bg: string;
  // ...
}
const isDark = item.variant === "dark"; // type-safe, survives class refactors
```

### DRY Pillar Extraction (015)

**Before** (3 copies drifting apart):
```tsx
// research/page.tsx — "themes" array
// mission/page.tsx — "goals" array with different field names
// lab-mission.tsx — "goals" array with shorter descriptions
```

**After** (single source):
```tsx
// src/lib/research-pillars.ts
export const RESEARCH_PILLARS: ResearchPillar[] = [
  { title: "ICU Data Science", short: "...", full: "..." },
  // ...
];

// All 3 consumers:
import { RESEARCH_PILLARS } from "@/lib/research-pillars";
```

## Prevention Strategies

### Token Drift
- Maintain a "Canonical Tokens" section in CLAUDE.md listing allowed color tokens and deprecated aliases.
- Add a grep-based CI check for banned tokens (`rush-charcoal`, `rush-mid-gray`, `rush-green`, `rush-umber`, `border-gray-300`).

### Radius Inconsistency
- CLAUDE.md convention: `rounded-sm` for cards/buttons/surfaces, `rounded-full` for avatars/pills.
- Flag `rounded-xl` and `rounded-2xl` in code review.

### Missing Image `sizes`
- Every `<Image>` MUST include a `sizes` prop. Add to CLAUDE.md and code review checklist.
- Simple CI check: `grep -rn '<Image' src/ | grep -v 'sizes='`

### Data Duplication
- All structured content must live in exactly one place: CMS files under `content/` or a shared module under `src/lib/`.
- Hardcoding display content in component files is banned.

### Link/Anchor Confusion
- Enable `@next/next/no-html-link-for-pages` ESLint rule.
- `<Link>` for internal routes only; `<a>` for external URLs.

### Unvalidated URL Interpolation
- Never interpolate user-sourced identifiers directly into URL strings.
- Use validated format checks (regex) before constructing ORCID, GitHub, or similar URLs.

### Consolidated Code Review Checklist

```
- [ ] All color classes use canonical tokens (no deprecated aliases)
- [ ] Border radius follows tier table (rounded-sm for cards, rounded-full for avatars)
- [ ] Every <Image> has an appropriate sizes prop
- [ ] No display content hardcoded in components
- [ ] No unused imports, props, or CSS artifacts remain
- [ ] <Link> for internal routes only; <a> for external URLs
- [ ] External URLs built with validated format checks
```

## Related Documentation

### Existing Solutions
- `docs/solutions/architecture/rush-brand-color-system-mapping.md` — Authoritative reference for valid vs legacy color tokens
- `docs/solutions/architecture/multi-source-publication-aggregation.md` — Publication pipeline patterns
- `docs/solutions/integration-issues/multi-source-academic-publication-pipeline.md` — API integration patterns

### Resolved Todos
All 13 findings documented in `todos/012-complete-*.md` through `todos/024-complete-*.md`.

### Related Plans
- `docs/plans/2026-04-04-feat-stitch-editorial-redesign-plan.md` — Primary plan that generated this review cycle
- `docs/plans/2026-03-23-feat-hero-refinement-peer-patterns-plan.md` — Hero animation code modified during this work
- `docs/plans/2026-03-23-feat-research-page-content-plan.md` — Research page components affected

### CLAUDE.md Conventions Applied
- **Rush Brand System** — Defined canonical token names for color migration
- **Anti-Patterns** — "No centered body text" informed CTA left-alignment; "No gradient buttons" informed CTA standardization
- **Tech Stack** — Next.js App Router conventions informed Link vs anchor and Image usage
- **Content Management** — CMS directory structure informed DRY data extraction
