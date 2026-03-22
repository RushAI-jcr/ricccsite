---
title: "Git-Backed CMS Over Custom Admin Backend for Academic Lab Websites"
category: architecture
tags:
  - cms-architecture
  - backend-simplification
  - git-as-backend
  - sveltia-cms
  - academic-websites
  - over-engineering
  - pubmed-integration
modules:
  - content-management
  - team-profiles
  - publications
severity: high
date: 2026-03-21
status: implemented
---

# Git-Backed CMS Over Custom Admin Backend

## Problem

An academic lab website (~15 non-technical trainees) needed a way for team members to edit their own profiles (name, photo, bio, links) without touching code. The initial implementation built a custom admin backend with:

- Vercel Postgres (Drizzle ORM) for team data
- Auth.js v5 for admin authentication
- Vercel Blob for photo uploads
- Server actions for CRUD operations
- ~20 backend files, 7 npm dependencies

This was over-engineered for the use case. The same problem is solved with zero backend code by established academic labs.

## Root Cause

**Assumption mismatch:** Assumed non-developers couldn't use GitHub workflows. In reality, git-backed CMS tools (Sveltia CMS, Decap CMS) provide a visual web UI that abstracts git entirely — trainees see a form, not a repo.

**Pattern bias:** Database-backed admin is the default web dev pattern, but it's overkill for content that:
- Changes infrequently (team bios update monthly, not minutely)
- Has low concurrent edit demands (15 people, not 15,000)
- Benefits from version control (git history = free audit trail)

## Discovery

Studying the **Parker Healthcare Allocation Lab** repo ([github.com/Healthcare-Allocation-Lab](https://github.com/Healthcare-Allocation-Lab/healthcare-allocation-lab.github.io)) revealed they manage **45 team members** with:
- Decap CMS (git-backed) at `/admin/`
- Team data as YAML + Markdown files in git
- PubMed author-name search for publications (zero manual curation)
- No database, no custom auth, no server actions

## Solution

Replaced the custom admin with **Sveltia CMS** (modern Decap CMS fork) and file-based content.

### What Was Deleted (~20 files, 7 deps)

```
src/app/(admin)/          # 8 admin route files
src/actions/              # 3 server action files
src/components/admin/     # Admin form component
src/lib/auth.ts           # Auth.js config
src/lib/auth.config.ts    # Auth edge config
src/lib/db.ts             # Drizzle connection
src/db/                   # Schema + seed (3 files)
middleware.ts             # Auth middleware
drizzle.config.ts         # Drizzle config
```

**Deps removed:** `@vercel/postgres`, `drizzle-orm`, `drizzle-kit`, `next-auth`, `bcryptjs`, `@vercel/blob`, `zod`

### What Was Created (~6 files, 2 deps)

```
public/admin/index.html   # Sveltia CMS entry (7 lines)
public/admin/config.yml   # CMS collection schema
content/team/*.mdx         # Team member profiles (frontmatter + markdown)
content/spotlights.json    # Research spotlights
content/site-config.json   # Lab metadata (name, PI, links, PubMed query)
```

**Deps added:** `gray-matter` (frontmatter parsing)

### Key Pattern: PubMed Author-Name Search

Instead of manually curating a list of PMIDs, search PubMed by author name + affiliation:

```typescript
// src/lib/pubmed.ts — searchByAuthor()
const searchRes = await fetch(
  `${NCBI_BASE}/esearch.fcgi?db=pubmed&term=${query}&retmax=100&retmode=json`
);
const pmids = searchData.esearchresult?.idlist ?? [];
return fetchByPMIDs(pmids);
```

Publications are discovered automatically. Zero curation overhead.

## Metrics

| Metric | Before | After |
|--------|--------|-------|
| Admin files | ~20 | 2 |
| npm dependencies | 19 | 12 |
| Database | Vercel Postgres | None |
| Auth system | Auth.js + credentials | GitHub OAuth (CMS) |
| Photo storage | Vercel Blob ($) | Git repo (free) |
| Publication mgmt | Manual PMID list | Auto PubMed search |
| Build time | 3.5s | 2.3s |
| Monthly cost | ~$20 (Postgres + Blob) | $0 |

## Decision Framework: When to Use Git-Based CMS

**Use git-backed CMS (Sveltia/Decap) when:**
- Content editors are fewer than ~50 people
- Content changes are infrequent (weekly/monthly, not real-time)
- Content benefits from version control
- Budget is limited (academic labs, open source projects)
- You already deploy from git (Vercel, Netlify, GitHub Pages)

**Use a custom admin backend when:**
- Hundreds of concurrent editors
- Content changes in real-time (chat, comments, transactions)
- Complex workflows (approval chains, scheduled publishing)
- Content is user-generated (not team-managed)

**Red flags you're over-engineering:**
- Building auth for < 20 users
- Database for content that changes monthly
- Server actions for CRUD on static data
- Photo upload service for < 100 images

## Prevention

Before building a custom admin backend, ask:
1. Could a git-backed CMS (Sveltia, Decap, Tina) handle this?
2. Does someone in my domain already solve this? (Check reference implementations)
3. How often does this content actually change?
4. How many people need to edit it?

If the answers are "yes, yes, rarely, few" — use a CMS, not a backend.

## References

- Parker Healthcare Allocation Lab: https://healthcare-allocation-lab.github.io/
- Parker Lab repo (reference implementation): https://github.com/Healthcare-Allocation-Lab/healthcare-allocation-lab.github.io
- Sveltia CMS: https://github.com/sveltia/sveltia-cms
- CLIF Consortium (UX patterns): https://clif-icu.com
- PubMed E-utilities API: https://www.ncbi.nlm.nih.gov/books/NBK25501/

## Internal References

- Brainstorm: `docs/brainstorms/2026-03-21-rush-data-science-lab-brainstorm.md`
- Plan: `docs/plans/2026-03-21-feat-rush-data-science-lab-website-plan.md`
- Team Editing Guide: `TEAM_EDITING_GUIDE.md`
