---
status: pending
priority: p2
issue_id: "006"
tags: [code-review, content]
dependencies: []
---

# 006: Kevin Buell Bio Contains Consortium Description Instead of Personal Bio

## Problem Statement

`content/team/kevin-buell.mdx` bio section was replaced with the RICCC consortium overview paragraph — this is lab-level description text, not a personal bio for the team member. The education section is correct, but the main bio paragraph describes the consortium rather than Kevin Buell specifically.

## Proposed Solutions

### Option A: Replace with actual personal bio
Write or obtain Kevin Buell's actual bio describing his individual research interests and background.

**Effort:** Small (content change only)
**Risk:** Low

## Technical Details

- **Affected files:** `content/team/kevin-buell.mdx`

## Acceptance Criteria

- [ ] Kevin Buell's bio describes him individually, not the consortium
- [ ] Education section remains intact

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-22 | Created from code review | Flagged by Simplicity Reviewer |
