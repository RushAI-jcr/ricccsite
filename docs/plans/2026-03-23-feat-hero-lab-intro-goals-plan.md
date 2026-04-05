---
title: "feat: Expand hero with lab mission and 4 research goals"
type: feat
date: 2026-03-23
---

# feat: Expand hero with lab mission and 4 research goals

## Overview

Replace the minimal hero (lab name + tagline + CLIF link + logo) with a richer intro: mission statement + 4 research goals. Remove the separate Research Domains section from the home page — the hero goals replace it.

## Proposed Solution

### 1. Rewrite `src/components/home/hero.tsx`

Keep the two-column layout (text left, logo right). Replace current content with:

**Left column:**
- Lab full name (h1) — keep as-is
- Mission statement (2-3 sentences) — replaces tagline
- 4 research goals as a compact 2x2 grid with icons and brief descriptions
- Remove CLIF link

**Right column:**
- Lab logo — keep as-is

```tsx
// src/components/home/hero.tsx — new left column content

<h1>{siteConfig.fullName}</h1>

<p className="mission">
  {/* 2-3 sentence mission statement about advancing critical care
      through data science, federated research, and clinical trials */}
</p>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {goals.map((goal) => (
    <div key={goal.title} className="flex items-start gap-3">
      <div className="icon-circle">
        <goal.icon />
      </div>
      <div>
        <h3>{goal.title}</h3>
        <p>{goal.description}</p>
      </div>
    </div>
  ))}
</div>
```

**4 Research Goals:**

| Goal | Icon | Description |
|------|------|-------------|
| ICU Data Science | `Activity` | Applying machine learning and predictive analytics to large-scale ICU datasets |
| Federated ICU Research | `Network` | Multi-center collaborations across 10+ hospitals via the CLIF Consortium |
| Clinical Trials in ICU | `FlaskConical` | Pragmatic randomized trials and causal inference in critical care settings |
| Multidisciplinary ICU Research | `Users` | Bridging pulmonary medicine, informatics, biostatistics, and respiratory care |

### 2. Update `src/app/page.tsx`

Remove `ResearchDomains` import and component. Page flow becomes:

```
Hero (expanded) → MetricsBar → ResearchSpotlights → FundingLogos
```

### 3. Mission statement content

Draft for `siteConfig` or inline:

> RICCC brings together clinicians, data scientists, and trainees at Rush University Medical Center to improve outcomes for critically ill patients. Through federated research across 10 U.S. healthcare centers, pragmatic clinical trials, and advanced analytics, we translate ICU data into evidence that changes practice.

### 4. Files to delete (optional cleanup)

- `src/components/home/research-domains.tsx` — no longer imported anywhere after removal from page.tsx

## Acceptance Criteria

- [x] Hero displays mission statement (2-3 sentences)
- [x] Hero displays 4 research goals in a 2x2 grid with icons
- [x] CLIF link removed from hero (CLIF mentioned in Federated Research goal instead)
- [x] Research Domains section removed from home page
- [x] Two-column layout preserved (text left, logo right)
- [x] Responsive: goals stack to single column on mobile
- [x] TypeScript compiles clean
- [x] Rush brand colors and anti-patterns respected

## Context

- Brainstorm: `docs/brainstorms/2026-03-23-hero-lab-intro-brainstorm.md`
- Current hero: `src/components/home/hero.tsx`
- Current domains: `src/components/home/research-domains.tsx`
- Home page: `src/app/page.tsx`
- Site config: `content/site-config.json`
- Icons from `lucide-react` (already a dependency)
