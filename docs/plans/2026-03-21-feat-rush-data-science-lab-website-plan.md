---
title: "feat: Rush Data Science Lab Website"
type: feat
date: 2026-03-21
brainstorm: docs/brainstorms/2026-03-21-rush-data-science-lab-brainstorm.md
references:
  - https://healthcare-allocation-lab.github.io/ (primary design reference — Parker Healthcare Allocation Lab)
  - https://clif-icu.com (CLIF Consortium — PI's related project, UX patterns)
---

# Rush Data Science Lab Website

## Overview

Build a 7-page academic lab website for the Rush Data Science Lab. Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, MDX content, PubMed + GitHub API integrations, deployed on Vercel. Rush institutional brand system.

**Repo:** https://github.com/RushAI-jcr/ricccsite
**Current state:** Empty — no git, no code, no config files.

## Primary Design References

### Parker Healthcare Allocation Lab (https://healthcare-allocation-lab.github.io/) — **Closest Alignment**

This is the primary design model. Key patterns to replicate with Rush branding:

| Pattern | Parker Lab Implementation | Our Adaptation |
|---------|--------------------------|----------------|
| **Home flow** | Hero → PI intro → CLIF callout → Approach diagram → Research domains → Research Spotlights → Publications → Footer | Hero → PI intro → CLIF/consortium callout → Research domains → Metrics bar → Research spotlights → Featured pub → Footer |
| **PI-forward hero** | Dr. Parker prominently featured with full credentials (MD, PhD), title, headshot | PI prominently featured with credentials, title, Rush affiliation |
| **Research domains** | 3 interconnected domains with visual iconography | Adapt to our research areas with Rush-branded iconography |
| **Research spotlights** | 2 featured pubs with journal logos, thumbnail images, full citations with DOI | 2-3 featured pubs with journal info, DOI links, thumbnail images |
| **PubMed integration** | Dynamic loading from PubMed + Google Scholar + MyNCBI links | PubMed ISR + Google Scholar link + MyNCBI link in footer |
| **Funding logos** | NHLBI, NLM, Greenwall foundation wordmarks displayed | Rush funders/partners logos section |
| **Footer** | Lab name, university, department, address, Scholar/GitHub/X/Bluesky links | Lab name, Rush affiliation, address, Scholar/GitHub/X/Bluesky links |
| **Conceptual diagram** | Ethical + empirical approach feedback loop visualization | Research approach diagram (optional, content-dependent) |
| **Nav structure** | Home, Research, Team, Join, Contact (5 pages) | Home, Research, Team, Publications, Software, News, Contact (7 pages) |
| **Tone** | Academic + modern professional, minimal, publication-forward | Same — credibility through citations, data-driven, institutional gravitas |

### CLIF Consortium (https://clif-icu.com) — **UX Pattern Reference**

CLIF is built by PIs in the lab. Borrow interaction patterns, not visual identity:

| Pattern | CLIF Implementation | Our Adaptation |
|---------|---------------------|----------------|
| **Statistics banner** | 808K+ patients, 62 hospitals, 12 institutions (animated counters) | Publications count, Active Projects, Team Members, Year Founded |
| **Card hover transitions** | Smooth scale/shadow transitions on hover | Apply to research cards, pub cards, team cards |
| **Dark mode** | localStorage-persisted toggle | Consider for Phase 2+ (not Phase 1) |
| **Geographic map** | Institutional map showing site locations | Optional — if lab has multi-site collaborations |
| **Tools section** | Data Dictionary, ETL Guide, mCIDE Explorer as separate tool pages | Software & Tools page with GitHub repo cards |
| **Search** | Pagefind integration | Consider for Phase 3 (site-wide search) |
| **Feature cards** | 4-card grid with icons: Standardized, Privacy-Preserving, Rapid Research, Open Source | Adapt for research value propositions on Home page |

> **Important:** CLIF uses Astro + Tailwind. We use Next.js + Tailwind. The visual patterns transfer; the framework does not.

## Problem Statement

The Rush Data Science Lab needs a professional web presence that showcases research, team, publications, and software tools. The site must follow Rush's institutional brand guidelines and be easily maintainable by non-developers via MDX content files. The site should match the academic credibility and modern professionalism of the Parker Healthcare Allocation Lab site while using Rush's brand system.

## Proposed Solution

A phased build using the Vercel-native stack (Next.js 15 + Tailwind v4 + shadcn/ui), delivering core pages first (Home, Team, Publications, Contact), then expanding to Research, Software & Tools, and News. Design modeled primarily on the Parker Healthcare Allocation Lab site structure and tone.

---

## Technical Approach

### Architecture

```
ricccsite/
├── src/
│   ├── app/                        # Next.js 15 App Router
│   │   ├── layout.tsx              # Root layout (font, nav, footer, analytics)
│   │   ├── page.tsx                # Home
│   │   ├── team/page.tsx           # Team
│   │   ├── publications/page.tsx   # Publications
│   │   ├── contact/page.tsx        # Contact / Join
│   │   ├── research/page.tsx       # Research (Phase 2)
│   │   ├── software/page.tsx       # Software & Tools (Phase 2)
│   │   ├── news/page.tsx           # News listing (Phase 3)
│   │   ├── news/[slug]/page.tsx    # News detail (Phase 3)
│   │   └── not-found.tsx           # Custom 404
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── header.tsx          # Nav bar with Rush brand
│   │   │   ├── footer.tsx          # Footer: secondary nav, social links (Scholar/GitHub/X/Bluesky), Rush affiliation
│   │   │   ├── mobile-nav.tsx      # Hamburger menu
│   │   │   └── social-links.tsx    # Reusable Scholar/GitHub/X/Bluesky icon links
│   │   ├── home/
│   │   │   ├── hero.tsx            # Hero: lab name, tagline, PI intro with credentials + headshot (Parker Lab style)
│   │   │   ├── metrics-bar.tsx     # Animated counters (CLIF-style statistics banner)
│   │   │   ├── research-domains.tsx # Research domain cards with iconography (Parker Lab 3-domain style)
│   │   │   ├── research-spotlights.tsx # 2-3 featured pubs with journal info + thumbnails (Parker Lab style)
│   │   │   └── funding-logos.tsx   # Funding org logos/wordmarks (Parker Lab style)
│   │   ├── team/
│   │   │   ├── pi-bio.tsx          # PI full bio: credentials, headshot, academic links (Parker Lab PI-forward style)
│   │   │   ├── staff-grid.tsx      # Staff member grid with hover transitions (CLIF card style)
│   │   │   └── student-list.tsx    # Compact student list
│   │   ├── publications/
│   │   │   ├── pub-list.tsx        # Publication listing grouped by year
│   │   │   ├── pub-card.tsx        # Publication card: title, authors, journal, DOI, PubMed link
│   │   │   ├── pub-filters.tsx     # Client-side year filter + text search
│   │   │   └── pub-spotlight.tsx   # Featured spotlight card (Parker Lab research spotlight style)
│   │   └── contact/
│   │       └── pathway-cards.tsx   # 3 audience pathway cards
│   ├── lib/
│   │   ├── pubmed.ts              # PubMed E-utilities client
│   │   ├── github.ts              # GitHub API client
│   │   ├── mdx.ts                 # MDX loading utilities
│   │   └── fonts.ts               # General Sans font config
│   └── styles/
│       └── globals.css             # Tailwind v4 + Rush tokens
├── content/
│   ├── team/                       # MDX per team member
│   │   ├── pi-lastname.mdx
│   │   ├── staff-member-1.mdx
│   │   └── student-1.mdx
│   ├── research/                   # MDX per research area
│   │   └── research-area-1.mdx
│   ├── news/                       # MDX per news post
│   │   └── 2026-03-21-welcome.mdx
│   └── publications.json           # Curated PMID list + overrides
├── public/
│   ├── images/
│   │   ├── team/                   # Headshot photos
│   │   ├── research/              # Research area images
│   │   └── funders/               # Funding org logos (NHLBI, etc.)
│   ├── fonts/                      # General Sans woff2 files
│   └── og-image.png               # Default OG image
├── .env.example                    # NCBI_API_KEY, GITHUB_TOKEN
├── .gitignore
├── next.config.ts
├── tailwind.config.ts              # Rush brand tokens
├── tsconfig.json
├── package.json
└── README.md
```

### Rush Brand Token System

```typescript
// tailwind.config.ts — Rush color tokens
const rushColors = {
  indigo:       '#1E1869', // Nav, hero backgrounds
  'deep-blue':  '#00668E', // Primary CTA, links
  cerulean:     '#54ADD3', // Secondary accent (use only on dark bg — fails WCAG AA on ivory)
  ivory:        '#FFFBEC', // Page background
  white:        '#FFFFFF', // Card backgrounds
  charcoal:     '#333333', // Body text
  'light-gray': '#F5F5F5', // Section alternation
  'mid-gray':   '#666666', // Secondary text
}
```

> **Note:** Only 4 Rush colors were specified in the PRD. The remaining 4 above are reasonable defaults for a professional site. If the Rush-Digital-Quick-Guide PDF becomes available, swap these out.

**Typography:** General Sans from Fontshare (Semibold for headings, Regular for body). Loaded as local `woff2` files via `next/font/local`.

### Site Configuration (`src/lib/config.ts`)

Centralized config for content that appears in multiple places (header, footer, hero, meta):

```typescript
export const siteConfig = {
  name: "Rush Data Science Lab",
  institution: "Rush University Medical Center",
  department: "Department of Medicine", // update as needed
  address: "Chicago, IL",
  tagline: "Advancing Critical Care Through Data Science", // placeholder

  // PI info (displayed in hero, team, structured data)
  pi: {
    name: "TBD",
    credentials: "MD, PhD", // update
    title: "TBD",
    email: "TBD@rush.edu",
  },

  // Social/academic links (Parker Lab pattern — appear in footer + social-links component)
  links: {
    googleScholar: "", // Google Scholar profile URL
    myNcbi: "",        // MyNCBI collections URL
    github: "https://github.com/RushAI-jcr",
    twitter: "",       // X/Twitter handle URL
    bluesky: "",       // Bluesky profile URL
    clif: "https://clif-icu.com", // CLIF Consortium (PI affiliation)
  },

  // Funding orgs (logos in public/images/funders/)
  funders: [
    // { name: "NHLBI", logo: "/images/funders/nhlbi.png", url: "..." },
  ],
}
```

### Resolved Specification Gaps

These gaps were identified during spec-flow analysis. Each is resolved with a default decision:

| Gap | Decision | Rationale |
|-----|----------|-----------|
| **PubMed query strategy** | Curated `publications.json` with PMIDs; PubMed API enriches metadata at build time | Full editorial control; API is data source, not source of truth |
| **Data fetching strategy** | ISR: publications revalidate every 24h, GitHub repos every 1h | Balances freshness with API rate limits |
| **PubMed API key** | Use NCBI API key (env var) | 10 req/s vs 3 req/s; free to register |
| **Publication filters** | Year filter + free-text search over titles/authors (client-side) | Simple, covers 90% of use cases |
| **Featured publication** | `featured: true` in `publications.json` entry; falls back to most recent | Manual curation with sensible default |
| **GitHub repos** | Curated list in `content/software.json` (org, repo name, description override) | Editorial control over which repos appear |
| **GitHub API auth** | GitHub token in env var | Avoids 60 req/hr unauthenticated limit |
| **Contact/Join pathways** | 3 pathways: Prospective Students, Collaborators, General Inquiry | Matches academic lab norms |
| **Contact interaction** | Informational panels with mailto links, no server-side forms | Avoids HIPAA complexity; simplest viable approach |
| **Team member pages** | Single page, no sub-routes; PI bio expanded, others in grid | Simpler; add detail pages later if needed |
| **Team data schema** | MDX frontmatter: name, role, tier (pi/staff/student/alumni), photo, email, links (ORCID, Scholar, site, GitHub) | Covers all standard academic fields |
| **Alumni** | `alumni: true` frontmatter flag; collapsible section at bottom of Team page | Graceful handling without removal |
| **Metrics bar** | Publications count, Active Projects, Team Members, Year Founded | Safe defaults; counts derived from content |
| **Nav order** | Home, Research, Team, Publications, Software & Tools, News, Contact | Research-forward ordering |
| **404 page** | Custom `not-found.tsx` with Rush branding and nav back | Standard UX |
| **SEO** | Per-page meta + OG tags; Organization + Person JSON-LD; sitemap.xml; robots.txt | Academic discoverability essentials |
| **Accessibility** | WCAG 2.1 AA target; `prefers-reduced-motion` for metrics bar; semantic HTML throughout | Institutional standard |
| **Cerulean contrast** | Use Cerulean Blue only on dark backgrounds (Indigo, Deep Blue) or as decorative element, never as text on Ivory | Fails WCAG AA on light backgrounds |
| **Image optimization** | Next.js `<Image>` component; WebP with blur placeholder; team photos 400x400 max | Standard Next.js best practice |
| **Caching** | ISR with stale-while-revalidate; build-time fallback cache for API failures | Resilient to API downtime |
| **RSS** | Include for News page (Phase 3) | Trivial to add; expected by academics |
| **Structured data** | Organization schema on Home; Person schema on Team for PI | Improves Google Knowledge Panel |

---

## Implementation Phases

### Phase 1: Foundation + Core Pages (Home, Team, Publications, Contact)

#### Step 1.1: Project Scaffolding

- [ ] Initialize git, connect remote to `RushAI-jcr/ricccsite`
- [ ] `npx create-next-app@latest` — Next.js 15, TypeScript, Tailwind CSS, App Router, `src/` directory
- [ ] Configure `tailwind.config.ts` with Rush brand tokens (colors above)
- [ ] Initialize shadcn/ui (`npx shadcn@latest init`)
- [ ] Download General Sans (Regular + Semibold) from Fontshare → `public/fonts/`
- [ ] Configure `next/font/local` in `src/lib/fonts.ts`
- [ ] Set up `globals.css` with Tailwind v4 directives + Rush base styles (Ivory bg, Charcoal text)
- [ ] Create `.env.example` with `NCBI_API_KEY` and `GITHUB_TOKEN` placeholders
- [ ] Create `.gitignore` (Next.js defaults + `.env`)
- [ ] Create project-level `CLAUDE.md` codifying tech stack, anti-patterns, and brand tokens

**Files:** `package.json`, `tailwind.config.ts`, `tsconfig.json`, `next.config.ts`, `src/lib/fonts.ts`, `src/styles/globals.css`, `.env.example`, `.gitignore`, `CLAUDE.md`

#### Step 1.2: Layout Shell (Nav + Footer)

- [ ] `src/app/layout.tsx` — Root layout with General Sans font, Rush Ivory background, Vercel Analytics
- [ ] `src/components/layout/header.tsx` — Top nav bar: Rush Indigo background, white text, 7 nav links, Rush logo/text placeholder
- [ ] `src/components/layout/mobile-nav.tsx` — Hamburger menu for mobile (shadcn Sheet component)
- [ ] `src/components/layout/social-links.tsx` — Reusable social/academic link icons: Google Scholar, GitHub, X/Twitter, Bluesky (matches Parker Lab footer pattern)
- [ ] `src/components/layout/footer.tsx` — **Parker Lab footer style:**
  - Lab name, Rush University Medical Center affiliation
  - Department and physical address (Chicago, IL)
  - Secondary nav (replicates main nav)
  - Social/academic links via `social-links.tsx`
  - Google Scholar link, MyNCBI link, GitHub org link
  - Copyright: "© 2026 Rush Data Science Lab, Rush University Medical Center"
- [ ] Responsive breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)

**Files:** `src/app/layout.tsx`, `src/components/layout/header.tsx`, `src/components/layout/mobile-nav.tsx`, `src/components/layout/social-links.tsx`, `src/components/layout/footer.tsx`

#### Step 1.3: Home Page

Modeled on the Parker Healthcare Allocation Lab home page flow: Hero → PI intro → Research domains → Metrics → Spotlights → Funding → Footer.

- [ ] `src/app/page.tsx` — Home page assembling 6 sections in order below
- [ ] `src/components/home/hero.tsx` — **Parker Lab style PI-forward hero:**
  - Rush Indigo background
  - Lab name + one-line mission tagline
  - PI headshot (circular or rounded-rect) with full credentials (name, MD/PhD, title, department)
  - Brief lab description (2-3 sentences)
  - Optional: callout link to CLIF Consortium or key affiliated project
- [ ] `src/components/home/research-domains.tsx` — **Parker Lab 3-domain style:**
  - NOT a symmetric 3-column icon grid (anti-pattern)
  - Asymmetric layout: research domain cards with descriptive titles, brief text, and iconography
  - Each card links to the Research page (anchored to that domain)
  - Use Rush Deep Blue headings, Ivory card backgrounds
- [ ] `src/components/home/metrics-bar.tsx` — **CLIF-style statistics banner:**
  - Animated counters: Publications, Active Projects, Team Members, Year Founded
  - Counts derived from content files at build time (not hardcoded)
  - Rush Indigo or Deep Blue background with white text
  - `prefers-reduced-motion`: show static numbers, no animation
- [ ] `src/components/home/research-spotlights.tsx` — **Parker Lab research spotlight style:**
  - 2-3 featured publications with:
    - Publication title (linked to DOI)
    - Journal name + year
    - Author list (truncated with et al.)
    - Optional thumbnail image
  - Sourced from `publications.json` entries marked `featured: true`
- [ ] `src/components/home/funding-logos.tsx` — **Parker Lab funding acknowledgment style:**
  - Row of funding org logos/wordmarks (NIH, NHLBI, etc.)
  - Grayscale or muted by default, full color on hover
  - Stored in `public/images/funders/`
- [ ] Add Organization JSON-LD structured data
- [ ] OG meta tags (title, description, image)

**Files:** `src/app/page.tsx`, `src/components/home/hero.tsx`, `src/components/home/research-domains.tsx`, `src/components/home/metrics-bar.tsx`, `src/components/home/research-spotlights.tsx`, `src/components/home/funding-logos.tsx`, `public/images/funders/`

#### Step 1.4: Team Page

- [ ] Create placeholder team MDX files in `content/team/`
- [ ] Frontmatter schema: `name`, `role`, `tier` (pi|staff|student|alumni), `photo`, `email`, `bio`, `orcid?`, `scholar?`, `website?`, `github?`, `joined?`
- [ ] `src/lib/mdx.ts` — MDX loading utility using `next-mdx-remote` + `gray-matter` for frontmatter
- [ ] `src/app/team/page.tsx` — Reads all team MDX, groups by tier, renders 3-tier layout
- [ ] `src/components/team/pi-bio.tsx` — Full-width PI section with photo, bio, links
- [ ] `src/components/team/staff-grid.tsx` — 3-column grid of staff cards (photo, name, role, links)
- [ ] `src/components/team/student-list.tsx` — Compact list/grid of students (smaller cards)
- [ ] Collapsible alumni section at bottom (if any `alumni: true` entries)
- [ ] Person JSON-LD for PI
- [ ] Next.js `<Image>` with blur placeholder for all team photos

**Files:** `content/team/*.mdx`, `src/lib/mdx.ts`, `src/app/team/page.tsx`, `src/components/team/pi-bio.tsx`, `src/components/team/staff-grid.tsx`, `src/components/team/student-list.tsx`

#### Step 1.5: Publications Page

Modeled on Parker Lab's publications section: dynamic PubMed integration + Google Scholar link + research spotlights.

- [ ] Create `content/publications.json` — Array of `{ pmid, featured?, titleOverride?, tags?, thumbnailImage? }`
- [ ] `src/lib/pubmed.ts` — PubMed E-utilities client: `fetchByPMIDs(pmids: string[])` → returns `{ title, authors, journal, year, doi, pmid, abstract }`
- [ ] `src/app/publications/page.tsx` — ISR page (revalidate: 86400); fetches PubMed data at build; renders list
- [ ] **Top of page:** Links to Google Scholar profile and MyNCBI (Parker Lab pattern — multiple access points to publications)
- [ ] `src/components/publications/pub-spotlight.tsx` — **Parker Lab research spotlight style:** 2-3 featured pubs at top of page with:
  - Journal logo/name prominently displayed
  - Thumbnail image (if provided)
  - Full citation with DOI link
  - Author list with et al. notation
- [ ] `src/components/publications/pub-card.tsx` — Standard publication card: title, authors (truncated), journal, year, PubMed link badge, DOI link badge
- [ ] `src/components/publications/pub-filters.tsx` — Client-side: year dropdown filter + free-text search input
- [ ] `src/components/publications/pub-list.tsx` — Grouped by year (newest first), filtered client-side
- [ ] Fallback: if PubMed API fails at build time, show PMID links only with a "metadata unavailable" note
- [ ] ScholarlyArticle JSON-LD for each publication

**Files:** `content/publications.json`, `src/lib/pubmed.ts`, `src/app/publications/page.tsx`, `src/components/publications/pub-spotlight.tsx`, `src/components/publications/pub-card.tsx`, `src/components/publications/pub-filters.tsx`, `src/components/publications/pub-list.tsx`

#### Step 1.6: Contact / Join Page

- [ ] `src/app/contact/page.tsx` — 3 audience pathway cards
- [ ] `src/components/contact/pathway-cards.tsx` — 3 cards side by side (stacked on mobile):
  - **Prospective Students**: What we look for, current openings, mailto PI with subject line
  - **Collaborators**: Research areas open to collaboration, mailto PI with subject line
  - **General Inquiry**: Lab address, department, general email
- [ ] Each card: Rush Deep Blue heading, description, CTA (mailto link styled as button)
- [ ] No server-side forms (avoids HIPAA complexity)

**Files:** `src/app/contact/page.tsx`, `src/components/contact/pathway-cards.tsx`

#### Step 1.7: SEO & Metadata

- [ ] `src/app/sitemap.ts` — Dynamic sitemap generation
- [ ] `src/app/robots.ts` — robots.txt (allow all, link to sitemap)
- [ ] Per-page `metadata` exports in each `page.tsx` (title, description, OG tags)
- [ ] Default OG image at `public/og-image.png` (Rush branded placeholder)
- [ ] `src/app/not-found.tsx` — Custom 404 with Rush branding and navigation

**Files:** `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/not-found.tsx`, `public/og-image.png`

#### Step 1.8: Vercel Deployment

- [ ] Connect GitHub repo to Vercel
- [ ] Set environment variables: `NCBI_API_KEY`, `GITHUB_TOKEN`
- [ ] Enable Vercel Analytics
- [ ] Enable Vercel Speed Insights
- [ ] Verify build succeeds and all 4 pages render correctly
- [ ] Verify ISR revalidation works for Publications

**Files:** (Vercel dashboard config, no files)

---

### Phase 2: Research + Software & Tools

#### Step 2.1: Research Page

- [ ] Create placeholder research area MDX files in `content/research/`
- [ ] Frontmatter: `title`, `question` (the "big question"), `description`, `image?`, `relatedPubs?` (PMIDs), `relatedTeam?` (slugs), `status` (active|completed)
- [ ] `src/app/research/page.tsx` — "Big Questions" layout: each research area as a full-width section with question as heading
- [ ] Visual: alternating Ivory/white background sections, research image on alternating sides
- [ ] Link each area to related publications and team members

**Files:** `content/research/*.mdx`, `src/app/research/page.tsx`

#### Step 2.2: Software & Tools Page

- [ ] Create `content/software.json` — Array of `{ org, repo, descriptionOverride? }`
- [ ] `src/lib/github.ts` — GitHub API client: `fetchRepos(repos: {org, repo}[])` → returns `{ name, description, stars, forks, language, updatedAt, url }`
- [ ] `src/app/software/page.tsx` — ISR page (revalidate: 3600); fetches GitHub data at build
- [ ] Repo cards: name, description, language badge, stars, forks, last updated, link to GitHub
- [ ] Fallback: if GitHub API fails, show repo name + direct link only

**Files:** `content/software.json`, `src/lib/github.ts`, `src/app/software/page.tsx`

---

### Phase 3: News & Updates

#### Step 3.1: News System

- [ ] Create placeholder news MDX in `content/news/`
- [ ] Frontmatter: `title`, `date`, `author`, `excerpt`, `tags?`, `coverImage?`
- [ ] `src/app/news/page.tsx` — News listing: cards sorted by date, paginated (10 per page)
- [ ] `src/app/news/[slug]/page.tsx` — Individual news post rendered from MDX
- [ ] `src/app/feed.xml/route.ts` — RSS feed generation
- [ ] OG tags per news post for social sharing

**Files:** `content/news/*.mdx`, `src/app/news/page.tsx`, `src/app/news/[slug]/page.tsx`, `src/app/feed.xml/route.ts`

---

## Acceptance Criteria

### Functional Requirements

- [ ] All 7 pages render correctly on desktop, tablet, and mobile
- [ ] Publications page fetches and displays PubMed data via ISR
- [ ] Software page fetches and displays GitHub repo data via ISR
- [ ] Team page renders 3-tier layout from MDX content
- [ ] Contact page shows 3 audience pathways with working mailto links
- [ ] Navigation works on all viewport sizes (hamburger on mobile)
- [ ] Content is updatable by editing MDX files and pushing to GitHub

### Non-Functional Requirements

- [ ] Lighthouse performance score ≥ 90
- [ ] WCAG 2.1 AA compliance (color contrast, keyboard nav, screen reader)
- [ ] `prefers-reduced-motion` respected for all animations
- [ ] All images use Next.js `<Image>` with appropriate sizing
- [ ] No Rush anti-patterns: no symmetric 3-col grids, no gradient buttons, no centered body text, no colored card borders

### Quality Gates

- [ ] TypeScript strict mode, zero type errors
- [ ] All pages have unique meta titles + descriptions + OG tags
- [ ] Sitemap and robots.txt accessible
- [ ] Build succeeds on Vercel with no warnings
- [ ] API fallbacks work (site builds even when PubMed/GitHub APIs are down)

---

## Dependencies & Prerequisites

| Dependency | Status | Blocker? |
|------------|--------|----------|
| General Sans font files (Fontshare) | Available free | No |
| NCBI API key | Free registration at ncbi.nlm.nih.gov | No |
| GitHub personal access token | Create from GitHub settings | No |
| Vercel account | Free tier sufficient | No |
| Rush brand guide PDF (complete colors) | Referenced but not in repo | Partial — 4 core colors known, remaining 4 TBD |
| Rush logo assets | Not yet available | Non-blocking — use text placeholder |
| Real team content (bios, photos) | Not yet available | Non-blocking — placeholders first |
| Real publication PMIDs | Not yet available | Non-blocking — use example PMIDs |

---

## Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| PubMed API rate limiting | Medium | Medium | Use NCBI API key (10/s); batch requests; ISR cache |
| PubMed API downtime during build | Low | High | Build-time cache fallback; show PMIDs without metadata |
| Incomplete Rush brand guide | High | Medium | Proceed with 4 known colors + reasonable defaults; swap when guide arrives |
| Calibre font license acquired later | Medium | Low | General Sans is token-swappable; single file change |
| Content never provided | Medium | High | Ship with quality placeholders; site is still functional |
| HIPAA concerns on Contact forms | Low | Critical | No server-side forms — mailto links only |

---

## Anti-Pattern Checklist

Before every PR, verify:

- [ ] No symmetric 3-column icon grids anywhere
- [ ] No gradient buttons (solid Rush Deep Blue only)
- [ ] No centered body text (left-aligned throughout)
- [ ] No colored side-borders on cards
- [ ] No Cerulean Blue text on Ivory/white backgrounds (contrast fail)

---

## References

### Internal

- Brainstorm: `docs/brainstorms/2026-03-21-rush-data-science-lab-brainstorm.md`
- PRD: `Please look up lab pages like parker lab or wiscon.md`

### External Inspiration (Ranked by Alignment)

1. **Parker Healthcare Allocation Lab** (PRIMARY): https://healthcare-allocation-lab.github.io/ — Closest design model. PI-forward, publication-centric, modern academic tone.
2. **CLIF Consortium** (UX PATTERNS): https://clif-icu.com — PI's project. Statistics banner, card transitions, tools section.
3. Stanford Parker Lab: https://med.stanford.edu/parkerlab.html
4. UW Churpek Lab Contact: https://janechurpek.labs.wisc.edu/contact-us/
5. UW ICU Data Science: https://www.medicine.wisc.edu/apcc/icu-data-science-research

### Documentation

- Next.js 15 App Router: https://nextjs.org/docs/app
- shadcn/ui: https://ui.shadcn.com
- next-mdx-remote: https://github.com/hashicorp/next-mdx-remote
- PubMed E-utilities: https://www.ncbi.nlm.nih.gov/books/NBK25501/
- Fontshare General Sans: https://www.fontshare.com/fonts/general-sans
- Vercel Analytics: https://vercel.com/docs/analytics
