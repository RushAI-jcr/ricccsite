---
status: pending
priority: p1
issue_id: "013"
tags: [code-review, performance, frontend-races]
dependencies: []
---

# 013: requestAnimationFrame animation loop not cancelable on unmount

## Problem Statement

In `src/components/home/metrics-bar.tsx`, the `AnimatedCounter` component launches a `requestAnimationFrame` loop (1500ms duration) when the metrics bar scrolls into view. The cleanup function only calls `observer.disconnect()` but does nothing to cancel the rAF loop. If the user navigates away mid-animation (common on a marketing site), four orphaned animation loops call `setCount()` on unmounted components, wasting CPU on the next page.

Additionally, the `prefersReducedMotion` check uses two separate `useEffect` hooks where execution order is an implementation detail, and the reduced-motion path wraps `setCount` in an unnecessary `requestAnimationFrame`.

## Findings

- **Frontend Races Reviewer**: Flagged as Critical. Four simultaneous ghost loops on fast navigation.
- **Performance Oracle**: Confirmed. rAF callbacks continue until `progress >= 1` with no cancellation mechanism.

## Proposed Solutions

### Option A: Add cancellation token + merge prefersReducedMotion (Recommended)

Add a `let canceled = false` flag set in the cleanup function. The `animate()` function checks `if (canceled) return` before each `setCount` call. Merge the `prefersReducedMotion` check into a single `useRef` initialization. Remove the unnecessary `requestAnimationFrame` wrapper in the reduced-motion path.

- **Pros**: Fixes all three issues, minimal code change
- **Cons**: None
- **Effort**: Small (10 minutes)
- **Risk**: None

## Technical Details

- **Affected file**: `src/components/home/metrics-bar.tsx`, lines 49-86

## Acceptance Criteria

- [ ] rAF loop canceled on unmount via cleanup function
- [ ] `prefersReducedMotion` computed in a single `useRef` (no two-effect race)
- [ ] Reduced-motion path calls `setCount(target)` directly (no rAF wrapper)
- [ ] No React state-update-on-unmounted-component warnings in dev
