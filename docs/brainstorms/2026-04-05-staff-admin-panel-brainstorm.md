---
date: 2026-04-05
topic: staff-admin-panel
---

# Staff Admin Panel — Team Member Management

## What We're Building

A lightweight `/staff/` admin panel built in Next.js that lets 5+ non-technical lab staff manage team member profiles without needing GitHub accounts. Staff visit the URL, enter a shared passphrase, and get a simple UI to add, edit, or archive team members — including uploading headshots and editing bios.

All edits commit directly to the GitHub repo via a bot Personal Access Token. Vercel auto-deploys on push, so changes go live in ~1 minute. No third-party services, no GitHub accounts for editors.

## Why This Approach

Three options were considered:

- **Custom admin panel (chosen):** Lowest staff friction, fits Vercel/Next.js naturally, no new services
- **Sveltia CMS + Cloudflare Access:** CMS is already built but requires DNS/CDN infrastructure changes
- **Shared GitHub account:** Nothing to build but shared credentials with no audit trail

A custom panel wins because the editing surface is narrow (one content type, ~10 fields), the tech stack supports it natively, and the UX can be optimized exactly for non-technical users.

## Key Decisions

- **Route:** `/staff/` — keeps `/admin/` (Sveltia) available for developer use
- **Auth:** Single shared passphrase stored as `ADMIN_PASSPHRASE` Vercel env var; validated server-side on every API call; session stored in an httpOnly cookie
- **Photo handling:** Multipart upload → API route → base64 → GitHub Contents API commit to `public/images/team/`; resize/compress server-side (sharp) before committing to keep file sizes under 200KB
- **Content storage:** Reads/writes the same `content/team/*.mdx` files the site already uses — no new data layer
- **Archive vs delete:** "Remove" sets `tier: alumni` rather than deleting the file — preserves history, matches existing alumni display logic
- **GitHub bot:** A dedicated `GITHUB_BOT_TOKEN` PAT in Vercel env vars (fine-grained: contents write on ricccsite repo only)
- **Deploy trigger:** No manual trigger needed — Vercel auto-deploys on every commit to main

## Scope

Full CRUD on team member profiles:

| Action | Description |
|---|---|
| List members | Show all current members grouped by tier |
| Edit member | Photo, bio, name, role, email, social links (LinkedIn, ORCID, scholar, website, GitHub) |
| Add member | Create a new MDX file with all fields |
| Archive member | Set tier to `alumni` (soft delete) |

## Resolved Questions

- **Photo compression:** Yes — use `sharp` server-side to resize to 400×400px and compress to ~200KB max before committing. Staff can upload any size.
- **Archive confirmation:** Yes — show a confirmation dialog before setting a member to alumni.
- **Nav visibility:** Direct URL only (`/staff/`) — not in the public nav. Staff bookmark it.


## Next Steps

→ `/workflows:plan` to define implementation steps, API routes, and component structure
