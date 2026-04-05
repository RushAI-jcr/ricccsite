---
status: pending
priority: p3
issue_id: "024"
tags: [code-review, simplification, quality]
dependencies: []
---

# 024: Miscellaneous simplification opportunities

## Problem Statement

Several small improvements identified:

1. **Inline SVGs**: Research page has 2 duplicate 7-line SVG checkmarks, team page has a 9-line user-plus SVG. Lucide React (already a dependency) has `Check` and `UserPlus` icons.
2. **FundingLogos name**: Component no longer renders logos — it renders a CTA banner. Name is misleading.
3. **PiBio bio parsing**: `extractInterests()` and `getLeadParagraph()` parse free-text with regex. Fragile — should be CMS fields long-term.
4. **Research placeholder panels**: Three large empty gray boxes with placeholder text ("EHR Data Streams", "Multi-site Network", "Interdisciplinary Teams") signal an unfinished page.
5. **Research decorative circle**: A purely decorative half-circle div adds wrapper complexity.
6. **Stale GitHub org**: `tools/page.tsx` line 68 references `RushAI-jcr` while the rest of the project uses `riccc-rush-lab`. Verify if FairCareAI repo has moved.
7. **StaffGrid role grouping**: Exact string matching on CMS free-text roles is brittle.

## Findings

- **Code Simplicity Reviewer**: All items flagged. ~50 LOC in inline SVGs, ~50 LOC in placeholder panels.
- **TypeScript Reviewer**: Stale GitHub org URL flagged.

## Proposed Solutions

Address individually as time permits. Priorities: replace inline SVGs (easy), verify GitHub org URL, remove or replace placeholder panels.

- **Effort**: Medium (30 minutes total)
