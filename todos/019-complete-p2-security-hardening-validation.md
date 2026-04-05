---
status: pending
priority: p2
issue_id: "019"
tags: [code-review, security]
dependencies: []
---

# 019: Missing ORCID/GitHub validation and form maxLength constraints

## Problem Statement

1. `src/components/team/member-social-links.tsx`: ORCID and GitHub username values from CMS frontmatter are interpolated into URLs without format validation. A CMS author could enter malformed values. (Low exploitability — requires GitHub OAuth write access.)

2. `src/components/contact/inquiry-form.tsx`: No `maxLength` on name, email, or proposal text inputs. Extremely long values could cause mail client issues.

## Findings

- **Security Sentinel**: ORCID validation missing (Medium), form constraints missing (Medium).

## Proposed Solutions

### Option A: Add validation + maxLength

1. Validate ORCID: `/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/`
2. Validate GitHub username: `/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/`
3. Add `maxLength` to form inputs: name (200), email (320), proposal (5000)

- **Effort**: Small (10 minutes)

## Acceptance Criteria

- [ ] ORCID and GitHub username validated before URL interpolation
- [ ] Form text inputs have reasonable maxLength constraints
