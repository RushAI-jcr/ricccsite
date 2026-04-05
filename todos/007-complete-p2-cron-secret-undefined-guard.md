---
status: pending
priority: p2
issue_id: "007"
tags: [code-review, security]
dependencies: []
---

# 007: Add Undefined Guard for CRON_SECRET in Revalidate Route

## Problem Statement

In `src/app/api/revalidate/route.ts`, if `CRON_SECRET` env var is unset, the comparison becomes `authHeader !== 'Bearer undefined'`. While this rejects requests (safe), it's an ambiguous failure mode. An explicit guard is clearer and more defensive.

## Proposed Solutions

### Option A: Add explicit check (Recommended)
```typescript
const cronSecret = process.env.CRON_SECRET;
if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**Effort:** Small
**Risk:** Low

## Technical Details

- **Affected files:** `src/app/api/revalidate/route.ts`

## Acceptance Criteria

- [ ] Route returns 401 when `CRON_SECRET` is undefined
- [ ] Route returns 401 when auth header doesn't match
- [ ] Route succeeds with valid CRON_SECRET

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-22 | Created from code review | Flagged by Security Sentinel and TypeScript Reviewer |
