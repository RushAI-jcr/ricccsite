---
title: "feat: Refine hero with tension-first mission, prose goals, peer patterns"
type: feat
date: 2026-03-23
---

# feat: Refine hero with tension-first mission, prose goals, peer patterns

## Overview

Refine the hero based on peer lab site research (Parker Lab, CLIF, Amsterdam Medical Data Science). Three changes: rewrite mission as tension-first, convert icon-grid goals to prose-style list, and add CLIF consortium credential prominently.

## Proposed Changes to `src/components/home/hero.tsx`

### 1. Tension-first mission statement

**Current:**
> We bring together clinicians, data scientists, and trainees at Rush University Medical Center to improve outcomes for critically ill patients. Through federated research across 10 U.S. healthcare centers, pragmatic clinical trials, and advanced causal inference, we translate ICU data into evidence that changes practice.

**Proposed:**
> Critical care generates enormous data — and most of it goes unused at the bedside. The RICCC Lab at Rush University Medical Center builds the methods, tools, and evidence to change that. Through federated research across 10 U.S. hospitals, pragmatic clinical trials, and causal inference, we turn ICU data into practice-changing insights for critically ill patients.

**Why:** Amsterdam's tension-first pattern ("doctors and data scientists don't always understand each other") is the most memorable opener across all peer sites. Leading with the problem earns attention before making claims.

### 2. Prose-style research goals (replace icon grid)

**Current:** 2x2 icon card grid (Activity, Network, FlaskConical, Users icons)

**Proposed:** Vertical list with bold title + inline description, no icons. Left-aligned, no grid.

```tsx
<div className="space-y-3">
  {goals.map((goal) => (
    <div key={goal.title}>
      <h3 className="font-semibold text-sm text-rush-emerald">
        {goal.title}
      </h3>
      <p className="text-white/70 text-sm leading-relaxed">
        {goal.description}
      </p>
    </div>
  ))}
</div>
```

**Why:**
- CLAUDE.md bans "symmetric 3-column icon grids" — the 2x2 is borderline
- Parker Lab uses prose-labeled domains, not icon cards
- Peer researcher flagged "symmetric icon grids feel corporate rather than research-focused"
- Left-aligned prose matches the CLAUDE.md rule "left-aligned throughout"

### 3. CLIF consortium credential

Add a small credential line below the mission, before goals:

```tsx
<p className="text-sm text-rush-emerald mb-6">
  Founding members of the CLIF Consortium —
  a federated network across 10+ U.S. academic medical centers
</p>
```

**Why:** Parker positions "Founding Executive Director of CLIF" prominently. CLIF membership is a differentiator — it signals multi-center scale and credibility.

### 4. Keep logo on right

Two-column layout stays. Logo stays on the right. No changes to right column.

## Acceptance Criteria

- [x] Mission leads with the problem ("data goes unused") before the solution
- [x] Research goals rendered as prose list, not icon grid
- [x] No symmetric grid pattern in hero
- [x] CLIF credential line visible between mission and goals
- [x] Left-aligned text throughout (no centered text on desktop)
- [x] lucide-react icon imports removed (no longer needed in hero)
- [x] TypeScript compiles clean

## Context

- Peer research: Parker Lab, CLIF Consortium, Amsterdam Medical Data Science
- Anti-patterns from CLAUDE.md: no symmetric 3-column icon grids, no centered body text
- Current hero: `src/components/home/hero.tsx`
