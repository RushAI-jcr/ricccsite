---
title: "feat: Replace single PI card in hero with co-directors"
type: feat
date: 2026-03-22
---

# feat: Replace single PI card in hero with co-directors

## Overview

The homepage hero currently shows a single PI card (Juan C. Rojas) sourced from `siteConfig.pi`. The hero should instead present the lab as co-led by both PIs — Juan Rojas and Kevin Buell — as co-directors/co-founders of RICCC.

## Problem Statement

The current hero gives the impression of a single-PI lab. RICCC is co-directed, and the homepage should reflect this. The `siteConfig.pi` field is a single-person object, which is architecturally limiting.

## Proposed Solution

Replace the single PI card in `hero.tsx` with a "Co-Directors" section showing both PIs side-by-side using their photos (already available at `/images/team/*.jpg`). Pull PI data from team MDX files (tier: pi) rather than `siteConfig.pi`.

### Implementation

#### 1. Update `hero.tsx` — replace PI card with co-directors

Remove the current single-PI block (lines 21-35) and replace with a co-directors row:

```tsx
// src/components/home/hero.tsx
import { getTeamMembersByTier } from "@/lib/team";

// Inside Hero():
const grouped = getTeamMembersByTier();
const directors = grouped.pi; // [{name, photo, role, ...}, ...]

// Render as side-by-side compact cards with photos
{directors.length > 0 && (
  <div className="flex flex-col sm:flex-row gap-3 mb-6">
    {directors.map((dir) => (
      <div key={dir.name} className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3">
        <Image src={dir.photo} alt={dir.name} width={48} height={48}
               className="rounded-full object-cover" sizes="48px" />
        <div>
          <p className="font-semibold text-sm">{dir.name}</p>
          <p className="text-white/70 text-xs">Co-Director</p>
        </div>
      </div>
    ))}
  </div>
)}
```

#### 2. Keep CLIF callout below the co-directors row

The "Founding member of the CLIF Consortium" link stays — it applies to the lab, not a single PI.

#### 3. No changes to `siteConfig.pi`

The `pi` field in `site-config.json` can remain for other uses (e.g., metadata, contact). The hero simply stops using it. No data model migration needed.

## Acceptance Criteria

- [x] Hero shows both Juan Rojas and Kevin Buell as co-directors with photos
- [x] No single PI name/title/credentials displayed alone
- [x] Co-director data comes from team MDX files (tier: pi), not hardcoded
- [x] CLIF Consortium link remains visible
- [x] Layout works on mobile (stack vertically) and desktop (side-by-side)
- [x] Photos render at appropriate size with `sizes` attribute

## Context

- Team photos already exist: `/images/team/juan-rojas.jpg`, `/images/team/kevin-buell.jpg`
- `getTeamMembersByTier()` in `src/lib/team.ts` already groups by tier and returns PI members
- Both members have `tier: pi` in their MDX frontmatter
- Reference sites (Parker Lab, CLIF Consortium) show lab leadership without singling out one PI
