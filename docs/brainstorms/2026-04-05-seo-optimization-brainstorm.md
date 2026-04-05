# SEO Optimization: Combined Technical + Content Strategy

**Date:** 2026-04-05
**Status:** Ready for planning
**Approach:** Combined (Technical SEO Overhaul + Strategic Content Pages)

## What We're Building

A comprehensive SEO overhaul to make the RICCC Lab site rank highly on Google for these target keywords:

| Keyword | Type | Current Coverage |
|---------|------|-----------------|
| ICU data science | Topic | Mentioned in mission description only |
| ICU clinical trials | Topic | Not in any meta description |
| J.C. Rojas | Person | No dedicated page, no Person schema |
| Kevin Buell | Person | No dedicated page, no Person schema |
| Rush University lab | Institution | Mentioned in a few descriptions |
| Chicago ICU data | Location+Topic | Not in any metadata |
| CLIF consortium | Project | Links to clif-icu.com but no structured data |

## Why This Approach

The site has solid bones (sitemap, robots.txt, per-page metadata) but is invisible to Google for target keywords because:

1. **Home page has zero custom metadata** — uses only root defaults ("RICCC" / "Advancing Critical Care Through Data Science")
2. **No JSON-LD structured data** — Google can't build Knowledge Panels for the lab or PIs
3. **No OpenGraph images** — social shares look empty, reducing backlink potential
4. **Generic meta descriptions** — "Publications from the RICCC Lab" contains zero target keywords
5. **No individual PI pages** — searching "J.C. Rojas" or "Kevin Buell" has nowhere to land
6. **No CLIF cross-linking SEO** — RICCC is a founding site of CLIF (clif-icu.com) but there's no structured data connecting them, missing bidirectional authority signals
7. **metadataBase still points to vercel.app** — not a custom domain

Combined approach (technical + content) is the right call because:
- Technical SEO fixes are fast, one-time, and unlock Google's understanding of the site
- Individual PI pages are the single highest-ROI content addition for name-based searches
- CLIF connection is a major authority signal — federated ICU data is a differentiator
- Both can be done in one pass without ongoing maintenance burden

## Key Decisions

### Technical SEO

1. **JSON-LD schemas to add:**
   - `ResearchOrganization` on root layout (lab identity, with `parentOrganization` linking to Rush)
   - `Person` schemas for Rojas & Buell on team page and individual PI pages
   - `WebSite` with `SearchAction` potential on home page
   - `ResearchProject` for CLIF on tools page — connects RICCC as founding site

2. **Keyword-optimized meta descriptions** for every page — rewrite all 8 page descriptions to naturally include target keywords

3. **Home page gets dedicated metadata:**
   - Title: "RICCC | ICU Data Science & Clinical Trials Lab at Rush University, Chicago"
   - Description targets all 6 keywords naturally

4. **Dynamic OG image** using Next.js `ImageResponse` — branded card with Rush green, lab name, page title

5. **Twitter card metadata** added to root layout

6. **Canonical URLs** explicit on every page

### Content SEO

7. **Individual PI profile pages** at `/team/jc-rojas` and `/team/kevin-buell`:
   - Rich content from existing MDX (education, research interests, publications)
   - Person JSON-LD schema per page with `affiliation`, `jobTitle`, `worksFor`
   - `sameAs` links to Google Scholar, ORCID, LinkedIn
   - Own OG image with PI photo + name + title

8. **CLIF connection strengthened:**
   - Tools page meta description references CLIF federated ICU data standard
   - JSON-LD `ResearchProject` schema for CLIF with `url: "https://clif-icu.com"` and `foundingLocation: "Rush University"`
   - `sameAs` / `memberOf` links between RICCC Organization schema and CLIF
   - Keywords: "CLIF consortium", "federated ICU data", "Common Longitudinal ICU Format"

9. **Sitemap expanded** to include PI profile pages

## Open Questions

- **Custom domain:** Is there a custom domain beyond `ricccsite.vercel.app`? This affects `metadataBase`, canonical URLs, and sitemap. (Using vercel.app subdomain hurts SEO vs a real domain.)
- **PI page URLs:** Should they be `/team/jc-rojas` and `/team/kevin-buell`, or `/team/juan-rojas` and `/team/kevin-buell` to match MDX filenames?
- **Google Search Console:** Is this site registered in Google Search Console? Critical for monitoring indexing and submitting sitemap.

## Out of Scope

- Blog/news content SEO strategy (ongoing effort, separate initiative)
- Google Ads / paid search
- Backlink building campaigns
- Performance optimization (Core Web Vitals already monitored via Vercel)
