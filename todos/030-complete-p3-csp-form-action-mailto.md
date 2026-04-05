---
status: complete
priority: p3
issue_id: "030"
tags: [code-review, security, csp]
dependencies: []
---

# 030: CSP form-action 'self' may block mailto if form refactored

## Problem Statement

CSP includes `form-action 'self'`. The InquiryForm uses `window.location.href` for mailto navigation (not a form action), so it works now. But a future refactor to standard form submission would break.

## Findings

- **Security Sentinel**: Low-to-medium. Fragile arrangement, not a current bug.

## Proposed Solutions

Either add `mailto:` to CSP form-action directive, or add a code comment documenting the constraint.

- **Effort**: Small
- **Risk**: None
