---
title: "Site-wide copy editing: remove grant-speak, fix CLIF factual error, update config"
date: 2026-04-04
category: integration-issues
tags:
  - copy-editing
  - tone
  - factual-correction
  - brand-voice
  - clif
  - site-config
  - content
severity: moderate
status: resolved
affected_modules:
  - src/lib/research-pillars.ts
  - src/app/research/page.tsx
  - src/app/mission/page.tsx
  - src/app/contact/page.tsx
  - src/app/tools/page.tsx
  - src/app/news/page.tsx
  - src/components/home/lab-mission.tsx
  - content/site-config.json
root_cause: >
  Site copy was written in marketing/grant-speak style — self-congratulatory,
  buzzword-heavy, and overly formal — unsuitable for a public-facing lab website.
  Additionally, the CLIF Consortium relationship was overstated ("co-founded"
  instead of "founding site") in 6 places across 4 files, and the lab founded
  year was listed as 2020 instead of 2025 in site-config.json.
symptoms:
  - Copy across all pages read like a grant abstract rather than a website
  - Buzzwords throughout ("leverage", "scalable", "evidence-based interventions", "digital scaffolding", "clinical intelligence")
  - CLIF Consortium relationship incorrectly described as "co-founded" in 6 locations
  - Lab founded year wrong (2020 vs 2025) in content/site-config.json
  - PI photos on mission page oversized at 112px, reduced to 80px
  - CTAs overly formal ("Advance Critical Care With Us", "All collaboration requests are reviewed by our faculty leadership")
  - Trainee card used corporate voice ("Nurturing the next generation")
---

# Site-Wide Copy Editing — Grant-Speak Removal, CLIF Factual Correction, Config Fixes

A comprehensive copy editing pass across 8 files to replace grant-speak with honest, engaging language, correct a factual error about CLIF Consortium co-founding, and fix stale config data.

## Root Cause Analysis

Three distinct problems were identified:

**1. Grant-speak tone throughout the site.** Copy was written in the style of an NIH grant abstract — heavy on buzzwords, self-promotional framing, and corporate voice. This is a common failure mode when academic researchers write website copy: they default to the register they use most often (persuasive grant writing), producing text that sounds impressive but says very little.

**2. Factual inaccuracy about CLIF Consortium.** The site stated "we co-founded the CLIF Consortium" in 6 places across 4 files. Rush is a *founding site* — a participant from the beginning — but did not co-found the consortium. The distinction matters: "co-founded" implies organizational leadership and credit that belongs to others. This likely originated from a single piece of copy that was duplicated across pages without verification.

**3. Stale config data.** The `founded` year in `content/site-config.json` was set to 2020 (incorrect; should be 2025). PI photos on the mission page used 112px dimensions, visually too large for the layout.

## Solution

### Copy Editing Principles Applied

1. **Conversational, honest tone.** Write as a small research group talking to peers, not as an institution issuing a press release.
2. **Drop buzzwords.** Remove "leverage," "scalable," "evidence-based interventions," "digital scaffolding," "clinical intelligence," "Rush-Vetted Infrastructure."
3. **Say what you actually do.** Not what sounds impressive.
4. **Use "we" as a small group.** Not the corporate "we" that implies institutional authority.
5. **CTAs should be inviting, not commanding.** "Interested in Working Together?" instead of "Advance Critical Care With Us."

### Before/After Examples

**Research page hero:**
```
Before: "We leverage machine learning, large-scale clinical data, and causal
inference to drive real-world impact in the ICU — turning bedside observations
into scalable, evidence-based interventions."

After: "Our work sits at the intersection of ICU data, machine learning, and
clinical trials. The goal is practical: build tools and methods that help
clinicians make better decisions for critically ill patients."
```

**Contact page hero:**
```
Before: "RICCC at Rush University Medical Center collaborates with academic
investigators, clinical partners, and trainees to advance critical care through
data science, federated research, and pragmatic trials."

After: "We are a small group, and we like working with people who share our
interests in ICU data science, federated research, and clinical trials. If that
sounds like you, let us know."
```

**Trainee card:**
```
Before: "Nurturing the next generation of clinical data scientists through
structured mentorship and hands-on lab access."

After: "We take on trainees interested in clinical data science — mentorship,
hands-on projects, and direct involvement in ongoing studies."
```

**Tools page title:**
```
Before: "The Infrastructure of Clinical Intelligence"
After: "Tools & Open Standards"
```

**Form intro:**
```
Before: "All collaboration requests are reviewed by our faculty leadership.
Please specify your institution's primary area of interest so we can connect
you with the right team."

After: "Tell us a bit about what you are working on and how it might connect
with our research. We will get back to you."
```

### CLIF Correction (6 instances across 4 files)

| File | Before | After |
|------|--------|-------|
| `research-pillars.ts` (short) | "Co-founders of the CLIF Consortium" | "A founding site in the CLIF Consortium" |
| `research-pillars.ts` (full) | "which we co-founded" | "Rush is a founding site in" |
| `mission/page.tsx` | "We co-founded the CLIF Consortium" | "As a founding site in the CLIF Consortium" |
| `lab-mission.tsx` | "Consortium we co-founded" | "Consortium — where Rush is a founding site" |
| `tools/page.tsx` (bento) | "co-founded the CLIF Consortium" | "founding site in the CLIF Consortium" |
| `tools/page.tsx` (prose) | "data standard we co-founded" | "data standard where Rush is a founding site" |

### Config and Sizing Fixes

- `content/site-config.json`: `founded` changed from `2020` to `2025`
- `mission/page.tsx`: PI photo container `w-28 h-28` (112px) reduced to `w-20 h-20` (80px)

### Files Changed (8 total)

- **`src/lib/research-pillars.ts`** — all 4 pillar descriptions (short + full)
- **`src/app/research/page.tsx`** — hero subtitle, trial cards, CTA
- **`src/app/mission/page.tsx`** — PI blurbs, CTA, photo sizing
- **`src/app/contact/page.tsx`** — hero, 4 bento cards, trust signals, form intro, footer CTA
- **`src/app/tools/page.tsx`** — hero title/subtitle, bento cards, CLIF prose
- **`src/app/news/page.tsx`** — placeholder text
- **`src/components/home/lab-mission.tsx`** — mission paragraph, CLIF reference
- **`content/site-config.json`** — founded year

## Prevention Strategies

### Preventing Grant-Speak Regression

**Add a tone guide to CLAUDE.md:**
- Write like you're explaining the lab to a smart colleague over coffee
- Banned phrases: "cutting-edge", "novel", "leveraging", "dedicated to", "advancing the field", "at the forefront", "pioneering", "world-class", "seeks to transform"
- If a sentence could appear in a grant abstract, rewrite it

**Grep-based CI lint for banned phrases:**
```bash
BANNED="cutting-edge|novel approach|leveraging|dedicated to advancing|at the forefront|pioneering|world-class|seeks to transform"
grep -riE "$BANNED" src/app/ src/components/ content/ --include="*.tsx" --include="*.mdx" --include="*.json"
```

### Preventing Factual Errors

**Add a verified facts section to CLAUDE.md:**
```markdown
## Factual Claims — Verified
- CLIF Consortium: Rush is a **founding site**. Do NOT say "co-founded."
- RICCC Lab founded: **2025** (not 2020).
```

**Grep-based CI check for known incorrect claims:**
```bash
WRONG="co-founded CLIF|co-founded the CLIF|founded in 2020"
grep -riE "$WRONG" src/ content/ --include="*.tsx" --include="*.ts" --include="*.json"
```

### Preventing Data Drift

- All shared facts (founded year, institution, department, affiliations) MUST live in `content/site-config.json` or `src/lib/config.ts` and be imported — never hardcoded in component files.
- The `RESEARCH_PILLARS` array in `src/lib/research-pillars.ts` is the single source of truth for pillar descriptions across all pages.

## Related Documentation

### Existing Solutions
- `docs/solutions/integration-issues/2026-04-04-stitch-redesign-code-review-13-fixes.md` — Prior code review that established DRY patterns for research pillars and design tokens
- `docs/solutions/architecture/rush-brand-color-system-mapping.md` — Canonical Rush color tokens

### Related Plans
- `docs/plans/2026-04-04-feat-stitch-editorial-redesign-plan.md` — Primary Stitch redesign plan
- `docs/plans/2026-03-23-feat-hero-refinement-peer-patterns-plan.md` — Earlier hero copy work with tension-first messaging
- `docs/plans/2026-03-23-feat-hero-lab-intro-goals-plan.md` — Hero mission statement expansion
- `docs/plans/2026-03-23-feat-research-page-content-plan.md` — Research page editorial tone guidelines

### CLAUDE.md Conventions Applied
- **Anti-Patterns** — "No centered body text" informed CTA left-alignment
- **Content Management** — CMS config as single source of truth for founded year
- **Rush Brand System** — Tone should match the brand: professional but approachable
