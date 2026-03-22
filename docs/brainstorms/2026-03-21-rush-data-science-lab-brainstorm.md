# Rush Data Science Lab Website — Brainstorm

**Date:** 2026-03-21
**Status:** Ready for planning

---

## What We're Building

A professional academic lab website for the Rush Data Science Lab, hosted on Vercel, using Rush's institutional brand system. The site showcases research, team, publications, and software — modeled after top academic lab sites (Stanford Parker Lab, UW Churpek Lab, MSSM ICU Data Science Lab).

**Target:** 7-page Next.js 15 site with PubMed and GitHub API integrations, MDX-driven content, and Rush brand compliance.

**Repo:** https://github.com/RushAI-jcr/ricccsite (empty, greenfield)

---

## Why This Approach

The PRD specifies a Vercel-native stack (Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui) which is the dominant production stack in 2026. This gives us:

- **Zero-config Vercel deployment** with hybrid SSG/SSR
- **shadcn/ui** for accessible, customizable components without vendor lock-in
- **MDX** for content that lives in the repo (no external CMS dependency)
- **API integrations** (PubMed, GitHub) for auto-updated publications and tools

---

## Key Decisions

### 1. Font Strategy: General Sans (not Calibre)
Calibre is a paid typeface (Klim Type Foundry). Unless a license is procured, we use **General Sans from Fontshare** (free, visually similar) as the primary web font. Calibre can be swapped in later with a single token change.

### 2. Content Layer: next-mdx-remote (not Contentlayer)
Contentlayer has been unmaintained since 2024. We'll use **next-mdx-remote** for MDX rendering — it's actively maintained, works with Next.js App Router, and has a simpler mental model.

### 3. Phased Build
Not all 7 pages at once. Phase 1 delivers the core experience:

| Phase | Pages | Priority |
|-------|-------|----------|
| **Phase 1** | Home, Team, Publications, Contact | Core site — enough to launch |
| **Phase 2** | Research, Software & Tools | Depth content |
| **Phase 3** | News & Updates | Ongoing content pipeline |

### 4. Placeholder Content First
Scaffold all pages with realistic placeholder content. Real content (bios, publications, research descriptions) can be swapped in via MDX files without code changes.

### 5. Rush Brand Tokens
All 8 Rush colors mapped to Tailwind CSS custom theme:

| Token | Hex | Usage |
|-------|-----|-------|
| Indigo | `#1E1869` | Nav, hero backgrounds |
| Deep Blue | `#00668E` | Primary CTA, links |
| Cerulean Blue | `#54ADD3` | Secondary accent |
| Ivory | `#FFFBEC` | Page background |
| *(+ 4 additional Rush palette colors from style guide)* | | Supporting roles |

Typography: General Sans Semibold (headings), General Sans Regular (body).

### 6. Anti-Patterns (Explicitly Banned)
- No symmetric 3-column icon grids
- No gradient buttons (violates Rush style)
- No centered body text
- No colored side-borders on cards

### 7. Deployment: Vercel
- Connect GitHub repo directly to Vercel
- Vercel Analytics + Speed Insights enabled
- Local-first development, deploy when ready

---

## Tech Stack Summary

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 15 (App Router) | Vercel-native, SSG/SSR hybrid |
| Language | TypeScript | Type safety, DX |
| Styling | Tailwind CSS v4 | Utility-first, Rush token mapping |
| Components | shadcn/ui | Accessible, customizable, no lock-in |
| Content | MDX + next-mdx-remote | Repo-local, maintained, simple |
| Publications | PubMed E-utilities API | Auto-updated pub list |
| Software | GitHub API | Auto-updated repo cards |
| Analytics | Vercel Analytics + Speed Insights | Core Web Vitals monitoring |
| Hosting | Vercel | Zero-config Next.js deploy |
| Font | General Sans (Fontshare) | Free Calibre alternative |

---

## Page Architecture (from PRD)

1. **Home** — Asymmetric research cards, animated metrics bar, featured publication
2. **Research** — "Big Questions" framing (Terrer Lab MIT inspired)
3. **Team** — 3-tier: PI full bio → staff grid → student compact list
4. **Publications** — Filter + PubMed links (ICU Data Science Lab inspired)
5. **Software & Tools** — GitHub repo cards with live stats
6. **News & Updates** — MDX-driven blog/announcements
7. **Contact / Join** — 3 separated audience pathways (Churpek Lab UW inspired)

---

## Resolved Questions

| Question | Decision | Rationale |
|----------|----------|-----------|
| Calibre font licensing? | Use General Sans (free fallback) | No license confirmed; token-swappable later |
| Contentlayer deprecated? | Use next-mdx-remote | Actively maintained, App Router compatible |
| All 7 pages at once? | Phased: 4 → 2 → 1 | Ship core site faster, iterate |
| Real content ready? | Placeholder first | Unblocks development; MDX swap is trivial |
| CMS needed? | No — MDX in repo | Simpler, no external dependency |

---

## Open Questions

*None — all key decisions resolved with sensible defaults. Ready for planning.*

---

## Next Step

Run `/workflows:plan` to generate the implementation plan.
