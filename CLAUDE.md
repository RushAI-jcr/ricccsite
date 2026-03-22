# RICCC Lab Website

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Vercel hosting with Analytics + Speed Insights
- Sveltia CMS at /admin/ (git-backed, no database)
- PubMed E-utilities API for publications (author-name search)
- Content stored as MDX/JSON files in content/ directory

## Content Management (Sveltia CMS)
- CMS at /admin/ — edits commit directly to GitHub repo
- Auth: GitHub OAuth (editors need GitHub account + repo write access)
- Team members: content/team/*.mdx (editable via CMS)
- Research spotlights: content/spotlights.json (editable via CMS)
- Site config: content/site-config.json (editable via CMS)
- Photos: public/images/team/ (uploaded via CMS media picker)

## Rush Brand System
Colors defined as CSS custom properties in globals.css:
- `rush-indigo` (#1E1869): Nav, hero backgrounds
- `rush-deep-blue` (#00668E): Primary CTA, links
- `rush-cerulean` (#54ADD3): Secondary accent — ONLY on dark backgrounds
- `rush-ivory` (#FFFBEC): Page background
- `rush-charcoal` (#333333): Body text
- `rush-mid-gray` (#666666): Secondary text
- `rush-light-gray` (#F5F5F5): Section alternation

## Anti-Patterns (DO NOT USE)
- No symmetric 3-column icon grids
- No gradient buttons (solid Rush Deep Blue only)
- No centered body text (left-aligned throughout)
- No colored side-borders on cards
- No Cerulean Blue text on light backgrounds

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Design References
- Parker Healthcare Allocation Lab: https://healthcare-allocation-lab.github.io/
- CLIF Consortium: https://clif-icu.com
