---
status: pending
priority: p3
issue_id: "009"
tags: [code-review, cleanup, css]
dependencies: []
---

# 009: Remove Dead CSS Class `animate-float-delayed`

## Problem Statement

`.animate-float-delayed` is defined in `globals.css` (line 133) but is not referenced in any `.tsx` file. This is dead CSS.

## Proposed Solutions

Remove the class definition (3 lines) from `globals.css`. The `float` keyframe is still needed for `animate-float`.

**Effort:** Small | **Risk:** Low

## Technical Details

- **Affected files:** `src/app/globals.css`

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-22 | Created from code review | Flagged by Simplicity Reviewer and Architecture Strategist |
