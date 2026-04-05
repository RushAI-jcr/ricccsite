---
status: pending
priority: p2
issue_id: "015"
tags: [code-review, architecture, dry]
dependencies: []
---

# 015: Research pillars triplicated, PI data hardcoded outside CMS

## Problem Statement

Two DRY violations:

1. **Research pillars** (ICU Data Science, Federated ICU Research, Clinical Trials, Interdisciplinary Team Science) are defined as inline arrays in three files with slightly different descriptions: `research/page.tsx` (themes), `mission/page.tsx` (goals), `lab-mission.tsx` (goals). Adding a 5th pillar or changing a title requires updating 3 files.

2. **Faculty data** in `mission/page.tsx` (lines 38-51) hardcodes PI names, roles, and descriptions, duplicating data from `content/team/*.mdx`. The hero component also hardcodes "Kevin Buell, MBBS, MS". When a PI's title changes in the CMS, these pages go stale.

## Findings

- **Code Simplicity Reviewer**: ~60 LOC of duplicated pillar data, ~15 LOC of hardcoded faculty data.
- **Architecture Strategist**: Hardcoded PI data bypasses the single-source-of-truth invariant.

## Proposed Solutions

### Option A: Extract pillars to shared data file + load PIs from team data

1. Create `src/lib/research-pillars.ts` with canonical titles/descriptions, imported by all 3 consumers.
2. On the mission page, import PIs from `getAllTeamMembers()` filtered by `tier === 'pi'` instead of the hardcoded `facultyCards` array.
3. In hero.tsx, read both PIs from `siteConfig` or team data instead of hardcoding Buell's name.

- **Effort**: Medium (30 minutes)

## Technical Details

- **Affected files**: `src/app/research/page.tsx`, `src/app/mission/page.tsx`, `src/components/home/lab-mission.tsx`, `src/components/home/hero.tsx`

## Acceptance Criteria

- [ ] Research pillar titles defined in exactly one place
- [ ] Mission page faculty section reads from team MDX data
- [ ] Hero attribution reads both PIs from data layer, not hardcoded strings
