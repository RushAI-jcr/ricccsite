<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Please look up lab pages like parker lab or wisconsin churpek lab websites to look up design and pages for data science labs.  and then make PRD of tech stack using vercel hosting and rush style guide as color schema

Here's the full PRD for the Rush Data Science Lab website — it covers everything from brand tokens to Vercel deployment. Key highlights:

## What's in the PRD

**Rush Brand Design System** — All 8 Rush colors mapped to semantic CSS variables (Indigo `#1E1869` for nav/hero backgrounds, Deep Blue `#00668E` as primary CTA color, Cerulean Blue `#54ADD3` as secondary accent, with Ivory `#FFFBEC` page background). Calibre Semibold for headers and Calibre Regular for body copy, with General Sans (Fontshare) as the web-safe fallback.[^1]

**Tech Stack (Vercel-native):**

- **Next.js 15** (App Router) — zero-config Vercel deployment, hybrid SSG/SSR, built-in API routes[^2]
- **TypeScript + Tailwind CSS v4 + shadcn/ui** — the dominant stack for production web apps in 2026[^3]
- **MDX + Contentlayer** for publications, team bios, and news posts
- **PubMed E-utilities API** + GitHub API integrations for auto-updated content
- **Vercel Analytics + Speed Insights** for Core Web Vitals monitoring[^4]

**7 Pages modeled on best academic labs:**

- Home with asymmetric research cards, animated metrics bar, featured publication
- Research with "Big Questions" framing (inspired by Terrer Lab MIT)[^5]
- Team with 3-tier layout (PI full bio → staff grid → student compact list)
- Publications with filter + PubMed links (modeled on ICU Data Science Lab)[^6]
- Software \& Tools (GitHub repo cards)
- News \& Updates
- Join / Contact with 3 separated audience pathways (modeled on Churpek Lab UW)[^7]

**Anti-patterns explicitly called out** — no symmetric 3-column icon grids, no gradient buttons (violates Rush style), no centered body text, no colored side-borders on cards.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^36][^37][^38][^39][^40][^41][^42][^43][^44][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://med.stanford.edu/parkerlab.html

[^2]: https://www.medicine.wisc.edu/apcc/icu-data-science-research

[^3]: https://janechurpek.labs.wisc.edu/contact-us/

[^4]: https://www.sitesgo.com/blog/research-lab-website-design-examples

[^5]: https://med.stanford.edu/design-everest/homepage-layouts/homepage-2.html

[^6]: https://icahn.mssm.edu/files/ISMMS/Assets/Research/Research Portal/Lab Website Request/WordpressLabWebsiteSetupGuidelines.pdf

[^7]: https://www.impactmedialab.com/scicomm/lab-website-key-features

[^8]: Rush-Digital-Quick-Guide-082825-copy.pdf

[^9]: https://vercel.com/docs/frameworks/full-stack/nextjs

[^10]: https://responsiveappdevelopers.com/blogs/best-tech-stacks-for-web-development-in-2026

[^11]: https://www.reddit.com/r/nextjs/comments/1g952o0/best_tech_stack/

[^12]: https://www.youtube.com/watch?v=9n8Gh4t5byE

[^13]: https://uit.stanford.edu/news/new-website-design-options-faculty-and-labs-using-stanford-sites

[^14]: https://www.youtube.com/watch?v=I698vc7w8Jw

[^15]: https://www.impactmedialab.com/scicomm/8-best-academic-lab-websites-to-inspire-your-lab-site

[^16]: https://parkersruth.com

[^17]: https://ieor.berkeley.edu/jobs/research-associate-postdoctoral-at-university-of-wisconsin-matthew-churpek-lab/

[^18]: https://ucdavisdatalab.github.io/workshop_portfolios/examples.html

[^19]: https://datasciencemajor.stanford.edu/research-impact/data-science-undergraduate-research-focus/datasurf-projects-summer-2026

[^20]: https://dribbble.com/tags/data-science-website

[^21]: https://universityresearchpark.org

[^22]: https://www.reddit.com/r/labrats/comments/17j39t5/looking_for_inspiration_while_redesigning_my_labs/

[^23]: https://med.stanford.edu/design-mckinley/home-page-layouts/homepage-2.html

[^24]: https://its.weill.cornell.edu/services/web-application-development/research-lab-websites

[^25]: https://www.blendb2b.com/blog/best-healthcare-website-examples

[^26]: https://med.stanford.edu/design-mckinley/general-page-layouts.html

[^27]: https://theacademicdesigner.com/2024/research-lab-websites/

[^28]: https://www.mockplus.com/blog/post/healthcare-website-design-examples-templates

[^29]: https://med.stanford.edu/design-mckinley/panel-builder-layouts/layout-one.html

[^30]: https://www.lib.sfu.ca/help/publish/scholarly-publishing/radical-access/research-website-tips

[^31]: https://azurodigital.com/medtech-website-examples/

[^32]: https://med.stanford.edu/design-mckinley/panel-builder-layouts.html

[^33]: https://www.framer.com/blog/healthcare-website-design-examples/

[^34]: https://med.stanford.edu/design-everest/panel-builder-layouts/layout-three.html

[^35]: https://labpages.org

[^36]: https://www.dbswebsite.com/blog/8-great-examples-of-healthcare-websites/

[^37]: https://www.linkedin.com/posts/francois-arbour-investor_from-my-experience-the-ideal-stack-for-development-activity-7318606498090151936-VgWS

[^38]: https://www.lib.uwo.ca/files/research/UX Lab Website Navigation Redesign Project Summary.pdf

[^39]: https://www.youtube.com/watch?v=0DJwFqSPW98\&vl=en

[^40]: https://www.reddit.com/r/nextjs/comments/1irsbwd/seeking_advice_on_the_best_tech_stack/

[^41]: https://vercel.com/kb/guide/deploying-next-and-userbase-with-vercel

[^42]: https://geekyants.com/blog/building-to-scale-my-experience-with-nextjs-and-vercel-in-production

[^43]: https://www.reddit.com/r/nextjs/comments/10br7hq/help_with_picking_the_right_tech_stack/

[^44]: https://dxstudio.msu.edu/experience-design/web-strategy/site-structure

