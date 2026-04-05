---
title: "feat: Apply Stitch editorial redesign to full site"
type: feat
date: 2026-04-04
---

# feat: Apply Stitch Editorial Redesign to Full Site

## Overview

Full visual redesign of the RICCC Lab website using Google Stitch HTML exports (`stitch-exports/`) as design source of truth. The editorial design language — glass nav, Geist Mono labels, asymmetric layouts, ivory/sage banding, sharp corners — replaces the current component styling while keeping all backend logic, data sources, and CMS integration intact.

## Problem Statement

The current site uses a generic lab template aesthetic (solid green nav, rounded cards, gradient hero, symmetric grids). The Stitch exports define a custom-designed editorial look that feels purpose-built for an academic research lab — more distinctive, better typography hierarchy, and stronger visual identity.

## Proposed Solution

Apply the Stitch design language across all pages in 4 phases: foundation (fonts, tokens, nav, footer), homepage, existing pages, and new pages.

### Information Architecture (Final)

**Pages (8 total):**
| Route | Status | Source Design |
|---|---|---|
| `/` | Redesign | homepage-desktop.html + mission-goals-final-desktop.html |
| `/mission` | **New** | mission-goals-final-desktop.html |
| `/research` | Redesign | research-pillars-final-desktop.html |
| `/team` | Redesign | investigative-team-final-desktop.html |
| `/publications` | Restyle | (keep current layout, apply new tokens) |
| `/tools` | **New** (replaces /software) | tools-infrastructure-final-desktop.html |
| `/news` | Restyle | (placeholder, apply new tokens) |
| `/contact` | Redesign + absorb /collaborate | collaborate-with-riccc-final-desktop.html |

**Nav items (8):** Home, Mission, Research, Team, Publications, Tools, News, Contact

**Redirects:** `/software` -> `/tools`

---

## Implementation Phases

### Phase 1: Foundation (fonts, tokens, layout, nav, footer)

#### 1.1 Install and load Geist Mono font
**File:** `src/app/layout.tsx`
- Import `GeistMono` from `geist/font/mono` (package already installed v1.7.0)
- Add `${GeistMono.variable}` to html className
- This activates the existing `--font-geist-mono` CSS variable already referenced in globals.css

```tsx
// src/app/layout.tsx
import { GeistMono } from "geist/font/mono";

// In html tag:
<html lang="en" className={`${font.variable} ${GeistMono.variable} h-full antialiased`}>
```

#### 1.2 Extend globals.css with Stitch surface tokens
**File:** `src/app/globals.css`

Add new color tokens inside the existing `@theme inline` block (after line 32):

```css
/* Stitch editorial surface system (Material Design 3 mapped to Rush) */
--color-rush-dark-green: #004923;
--color-rush-surface: #fdf9ea;          /* same as ivory */
--color-rush-surface-container: #f2eedf;
--color-rush-surface-container-low: #f8f4e5;
--color-rush-surface-container-high: #ece8da;
--color-rush-on-surface: #1c1c13;
--color-rush-on-surface-variant: #3f4940;
--color-rush-outline: #6f7a6f;
--color-rush-outline-variant: #bfc9bd;
--color-rush-secondary-container: #79fbb8;
```

#### 1.3 Redesign header — glass nav
**File:** `src/components/layout/header.tsx`

Replace solid green `bg-rush-green` header with:
- `bg-rush-ivory/80 backdrop-blur-xl shadow-[0_12px_32px_rgba(28,28,19,0.06)]`
- Text: `text-rush-dark-green` (dark green, not white)
- Active link: `font-semibold border-b-2 border-rush-teal`
- Inactive link: `text-rush-on-surface-variant hover:text-rush-dark-green`
- CTA button: `bg-rush-dark-green text-white px-6 py-2 rounded-md`
- Mobile sheet: update to match glass aesthetic (ivory bg, dark green text)
- **Update nav items** to 8: Home, Mission, Research, Team, Publications, Tools, News, Contact
- **Preserve** `/admin` path exclusion (line 27)

#### 1.4 Redesign footer — editorial mono style
**File:** `src/components/layout/footer.tsx`

Replace green `bg-rush-green` footer with:
- `bg-rush-surface-container` background
- `text-rush-dark-green` for headings, `text-rush-on-surface/60` for body
- Navigation labels: `font-mono uppercase text-xs tracking-widest`
- Two column groups: Navigation + Resources
- Address block: institution, department, city
- Copyright: `font-mono uppercase text-[0.7rem] tracking-widest opacity-40`
- Keep SocialLinks component, restyle to match

#### 1.5 Redesign page-header — editorial style
**File:** `src/components/layout/page-header.tsx`

Replace green gradient banner with:
- Ivory background matching page canvas
- `font-mono text-xs uppercase tracking-widest text-rush-teal` label above title
- `text-5xl md:text-7xl font-bold tracking-tight text-rush-dark-green` title
- `text-xl text-rush-on-surface-variant max-w-2xl` description
- Left-aligned, asymmetric gutter (`max-w-screen-2xl mx-auto px-8`)

---

### Phase 2: Homepage Redesign

#### 2.1 Redesign hero — editorial asymmetric layout
**File:** `src/components/home/hero.tsx`

Replace green gradient hero with ivory editorial hero:
- Ivory background (`bg-rush-ivory`)
- `grid grid-cols-1 lg:grid-cols-12 gap-12` — 8 cols text, 4 cols visual
- Monospace label: `font-mono text-xs uppercase tracking-widest text-rush-teal`
- Title: `text-5xl md:text-7xl font-bold tracking-tight text-rush-dark-green`
- Tagline from `siteConfig.tagline`
- Two CTA buttons: "Explore Our Mission" (primary solid) + "View Publications" (outline)
- Right side: logo image with subtle green overlay, `grayscale mix-blend-multiply`
- PI names and affiliation below tagline: `siteConfig` data
- **Keep** all data from `siteConfig` (fullName, tagline, etc.)

#### 2.2 Redesign lab-mission — numbered editorial goals
**File:** `src/components/home/lab-mission.tsx`

Replace flat 12-col grid with:
- `grid grid-cols-1 lg:grid-cols-12 gap-16` — 4 cols sticky sidebar, 8 cols goals
- Sidebar: section title "Our Mission" + divider bar + mission paragraph (sticky `top-32`)
- Goals: numbered `01.` `02.` `03.` `04.` with Geist Mono, each with title + description
- **Keep** same 4 goals array and CLIF consortium link
- Surface-container-low background for section banding

#### 2.3 Redesign metrics-bar — border-left style
**File:** `src/components/home/metrics-bar.tsx`

Replace teal gradient bar with:
- `bg-rush-surface-container py-24`
- 4-column grid, each metric: `border-l border-rush-dark-green/10 pl-6`
- Mono label: `font-mono text-rush-teal`
- Big number: `text-4xl font-bold text-rush-dark-green`
- Subtitle: `text-sm text-rush-on-surface-variant`
- **Keep** AnimatedCounter logic and prefers-reduced-motion handling

#### 2.4 Update research-spotlights — editorial styling
**File:** `src/components/home/research-spotlights.tsx`

Replace gradient sage background with:
- Ivory background, clean editorial cards
- Keep spotlight data from `content/spotlights.json`
- Journal badge: `bg-rush-dark-green text-white font-mono text-xs uppercase`
- Title: `text-xl font-bold text-rush-on-surface`
- Restyle card: `bg-white shadow-[0_12px_32px_rgba(28,28,19,0.06)]` with sharp corners

#### 2.5 Redesign CTA section (replaces FundingLogos)
**File:** `src/components/home/funding-logos.tsx` (rename or replace)

Replace minimal "Supported by" with sage-background CTA:
- `bg-rush-sage py-32 px-8 md:px-24`
- Large headline: "Join the Interdisciplinary Search for Better Outcomes."
- Two buttons: "Collaborate with the Lab" (link to /contact) + "View Publications"
- Keep institution credit as subtitle

#### 2.6 Update homepage composition
**File:** `src/app/page.tsx`

Reorder: Hero -> MetricsBar -> LabMission -> ResearchSpotlights -> CTA section

---

### Phase 3: Existing Page Redesigns

#### 3.1 Research page — pillar editorial layout
**File:** `src/app/research/page.tsx`

Replace icon-card layout with numbered pillar sections:
- Header: editorial page header with "Our Research Pillars" italic span
- Pillar 01 (ICU Data Science): text left + colored bg right, `surface-container-low`
- Pillar 02 (Federated / CLIF): image-left + text-right, link to CLIF
- Pillar 03 (Clinical Trials): full-width dark green section (`bg-rush-dark-green text-white`)
- Pillar 04 (Multidisciplinary): text-right + tags/chips, ivory bg
- CTA block at bottom
- **Keep** same 4 themes array with descriptions from current page
- Remove Lucide icon imports (Activity, Network, FlaskConical, Users)

#### 3.2 Team page — PI spotlight + bento grid
**File:** `src/app/team/page.tsx`

Adapt investigative-team Stitch layout:
- Editorial header: "The Investigative Multidisciplinary Team."
- PI spotlights: full-width alternating left/right sections with photo + bio
  - PI 1 (Rojas): text-left on surface-container-low, photo-right
  - PI 2 (Buell): text-right on sage, photo-left
  - Use actual team photos from `/images/team/`
  - Data from `getTeamMembersByTier()` — **keep** all MDX parsing
- Staff grid: bento-style layout with tier groupings
- Recruitment CTA card at bottom
- **Keep** PiBio, StaffGrid, CompactMemberGrid components (restyle them)

#### 3.3 Publications page — token refresh
**File:** `src/app/publications/page.tsx`

Keep current layout structure, apply new design tokens:
- Swap PageHeader to new editorial style
- Restyle PubCard and PubFilters backgrounds/borders
- **Keep** all async data fetching (PubMed + S2 + OpenAlex with ISR)

#### 3.4 Contact page — absorb collaborate design
**File:** `src/app/contact/page.tsx`

Replace 3-column icon grid (anti-pattern!) with:
- Editorial header: "Advancing Medicine Through Collective Intelligence."
- Partnership pathway bento cards (asymmetric, not 3-col):
  - Academic Partnerships (2-col span)
  - Trainee Fellowships (1-col)
  - Industry Innovation (1-col)
  - Clinical Collaboration (2-col span)
- Inquiry section: form-styled interface that generates mailto: link on submit
  - Fields: name, email, partnership track (select), proposal overview (textarea)
  - Submit opens `mailto:` with pre-filled subject/body from `siteConfig.pi.email`
- **Keep** existing pathways content, merge with Stitch card text

#### 3.5 News page — placeholder restyle
**File:** `src/app/news/page.tsx`

Keep "Coming Soon" but apply editorial page header style.

---

### Phase 4: New Pages

#### 4.1 Mission & Goals page
**File:** `src/app/mission/page.tsx` (new)

Based on mission-goals-final-desktop.html:
- Metadata export: title "Mission & Goals"
- Hero: large editorial title "Advancing Critical Care Through Data Science"
- Metrics section (reuse MetricsBar component)
- Mission editorial content: sticky sidebar + numbered goals (01-04)
  - Content derived from `stitch.md` mission narrative + `lab-mission.tsx` goals
- Faculty Leadership section: PI cards (reuse data from `getTeamMembersByTier()`)
- CTA: "Join the Frontier of Clinical Intelligence"

#### 4.2 Tools & Infrastructure page
**File:** `src/app/tools/page.tsx` (new, replaces /software)

Based on tools-infrastructure-final-desktop.html:
- Metadata export: title "Tools & Infrastructure"
- Hero: "The Infrastructure of Clinical Intelligence"
- Technical Stack bento grid:
  - Frontend (Next.js + Tailwind)
  - Data standards (CLIF/OMOP)
  - Cloud infrastructure
  - Visualization tools
- Open Standards section: CLIF schema description + code snippet display
- Reliability callout block
- Content from `stitch.md` tech stack section + CLIF consortium description

#### 4.3 Redirect /software -> /tools
**File:** `next.config.ts`

Add redirect:
```ts
async redirects() {
  return [{ source: '/software', destination: '/tools', permanent: true }];
}
```

#### 4.4 Delete old software page
**File:** `src/app/software/page.tsx` — delete

---

## Acceptance Criteria

### Functional Requirements
- [ ] Glass nav renders correctly on all pages with backdrop-blur
- [ ] Glass nav hides on `/admin` paths
- [ ] Mobile hamburger menu works with 8 nav items
- [ ] All 8 nav items link to correct routes
- [ ] Homepage renders: Hero, MetricsBar, LabMission, ResearchSpotlights, CTA
- [ ] Research page shows 4 numbered pillars with alternating layouts
- [ ] Team page shows PI spotlights with actual photos + staff grid
- [ ] Publications page renders with new tokens (no data changes)
- [ ] Contact page has partnership cards + mailto form
- [ ] /mission page renders with editorial content
- [ ] /tools page renders with bento grid
- [ ] /software redirects to /tools (301)
- [ ] All existing links (Scholar, GitHub, CLIF, DOIs) still work
- [ ] Footer shows updated navigation with all 8 pages

### Non-Functional Requirements
- [ ] No TypeScript errors (`npm run build` passes)
- [ ] No CLAUDE.md anti-patterns (no 3-col icon grids, no gradient buttons, no centered body)
- [ ] Geist Mono renders for labels/badges (not browser fallback)
- [ ] MetricsBar animation respects `prefers-reduced-motion`
- [ ] All text passes WCAG AA contrast (especially glass nav text on ivory)
- [ ] Logo uses existing `/images/riccc-logo-final.png`

---

## Files to Modify

| File | Action | Phase |
|---|---|---|
| `src/app/layout.tsx` | Edit: add GeistMono import | 1.1 |
| `src/app/globals.css` | Edit: add surface tokens | 1.2 |
| `src/components/layout/header.tsx` | Rewrite: glass nav | 1.3 |
| `src/components/layout/footer.tsx` | Rewrite: editorial mono | 1.4 |
| `src/components/layout/page-header.tsx` | Rewrite: editorial style | 1.5 |
| `src/components/home/hero.tsx` | Rewrite: ivory editorial hero | 2.1 |
| `src/components/home/lab-mission.tsx` | Rewrite: numbered goals | 2.2 |
| `src/components/home/metrics-bar.tsx` | Restyle: border-left metrics | 2.3 |
| `src/components/home/research-spotlights.tsx` | Restyle: editorial cards | 2.4 |
| `src/components/home/funding-logos.tsx` | Rewrite: CTA section | 2.5 |
| `src/app/page.tsx` | Edit: reorder sections | 2.6 |
| `src/app/research/page.tsx` | Rewrite: pillar editorial | 3.1 |
| `src/app/team/page.tsx` | Rewrite: PI spotlight + bento | 3.2 |
| `src/app/publications/page.tsx` | Restyle: token refresh | 3.3 |
| `src/app/contact/page.tsx` | Rewrite: partnership + form | 3.4 |
| `src/app/news/page.tsx` | Restyle: editorial header | 3.5 |
| `src/app/mission/page.tsx` | **New** | 4.1 |
| `src/app/tools/page.tsx` | **New** (replaces /software) | 4.2 |
| `next.config.ts` | Edit: add /software redirect | 4.3 |
| `src/app/software/page.tsx` | **Delete** | 4.4 |

## Existing code to reuse

- `siteConfig` from `src/lib/config.ts` — all page data, metrics, PI info, links
- `getTeamMembersByTier()` from `src/lib/team.ts` — team page data
- `AnimatedCounter` from `src/components/home/metrics-bar.tsx` — keep counter logic
- `SocialLinks` from `src/components/layout/social-links.tsx` — keep in footer
- `PubFilters` + `PubCard` from `src/components/publications/` — keep publication system
- `Sheet` from `src/components/ui/sheet.tsx` — keep for mobile nav
- Content files: `content/site-config.json`, `content/spotlights.json`, `content/team/*.mdx`

## Verification

1. `npm run build` — must pass with zero TypeScript errors
2. `npm run dev` — visually verify each page:
   - Glass nav renders with blur on scroll
   - Hero shows ivory bg with dark green text
   - Research pillars numbered 01-04 with alternating layouts
   - Team PI photos display correctly
   - /tools page renders bento grid
   - /software redirects to /tools
   - Contact form opens mailto: on submit
   - Footer shows all 8 nav links
3. `npm run lint` — no ESLint errors
4. Check mobile: hamburger menu opens with all 8 items
5. Check contrast: nav text readable on ivory, hero text readable
6. Check Geist Mono: inspect labels in devtools, confirm `font-family: '__GeistMono_...'` not system monospace

## References

- Brainstorm: `docs/brainstorms/2026-04-04-stitch-redesign-brainstorm.md`
- Design source: `stitch-exports/*.html` (desktop "Final" versions are authoritative)
- Content reference: `stitch.md` (copy for new pages)
- Rush brand: `src/app/globals.css` lines 14-32 (existing token system)
- Anti-patterns: `CLAUDE.md` (no 3-col grids, no gradient buttons, no centered body)
