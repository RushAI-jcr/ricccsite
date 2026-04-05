# RICCC Lab Website

## Contact
- Public lab email: info@riccc-lab.com

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Vercel hosting with Analytics + Speed Insights
- Sveltia CMS at /admin/ (git-backed, no database)
- PubMed E-utilities API for publications (author-name search)
- Content stored as MDX/JSON files in content/ directory

## Content Management (Sveltia CMS)
- GitHub org: https://github.com/riccc-rush-lab — site repository `ricccsite` (Sveltia commits here)
- CMS at /admin/ — edits commit directly to GitHub repo
- Auth: GitHub OAuth (editors need GitHub account + repo write access)
- Team members: content/team/*.mdx (editable via CMS)
- Research spotlights: content/spotlights.json (editable via CMS)
- Site config: content/site-config.json (editable via CMS)
- Photos: public/images/team/ (uploaded via CMS media picker)

## Rush Brand System (from Rush Digital Quick Guide)
Official Rush colors with green as primary, defined in globals.css:
- `rush-green` (#006332): Growth Green — official primary brand color
- `rush-dark-green` (#004923): Derived heading shade — actual color used for h1–h3, CTA button backgrounds, active nav (darker for accessibility contrast ~9:1 on warm ivory)
- `rush-teal` (#00A66C): Legacy Green — links, secondary buttons, accents, focus rings
- `rush-emerald` (#5FEEA2): Vitality Green — highlights, badges
- `rush-ivory` (#FFFBEC): Page background (Rush tertiary)
- `rush-sage` (#DFF9EB), `rush-mint` (#E8F8F0): Rush tertiary greens — available as tokens; **do not** use as full-bleed section backgrounds (use `rush-surface-container-low` / `-container` / `-container-high` instead)
- `rush-charcoal` (#0C0C0C): Body text (Rush Black)
- `rush-mid-gray` (#A59F9F): Secondary text (Rush Wash Gray)
- `rush-umber` (#5F5858): Muted text (Rush Raw Umber)
- `rush-light-gray` (#EAEAEA): Borders, cards (Rush Gray)

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
