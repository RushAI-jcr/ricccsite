---
status: complete
priority: p3
issue_id: "035"
tags: [code-review, simplification, dry]
dependencies: []
---

# 035: Duplicated URL validation in hasMemberSocialLinks vs MemberSocialLinks

## Problem Statement

`hasMemberSocialLinks()` (line 11) and `MemberSocialLinks` component (line 47) both independently call `isSafeUrl()` and `isLinkedInUrl()` on the same member fields. If validation logic changes in one place but not the other, they could diverge.

## Findings

- **Code Simplicity Reviewer**: The predicate duplicates the render logic's URL checks
- **File**: `src/components/team/member-social-links.tsx`

## Proposed Solutions

Extract the validated-items array into a shared helper (e.g., `getSocialItems(member)`) and have both `hasMemberSocialLinks` and `MemberSocialLinks` use it. The predicate becomes `getSocialItems(member).length > 0`.

- **Effort**: Small
- **Risk**: Low
