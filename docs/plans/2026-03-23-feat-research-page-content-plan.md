---
title: "feat: Build Research page with 4 theme sections"
type: feat
date: 2026-03-23
---

# feat: Build Research page with 4 theme sections

## Overview

Replace the "Coming Soon" placeholder on the Research page with 4 theme-based sections matching the hero goals. Each section has a prose description (3-5 sentences) covering the clinical problem, methods, and current work. No cards, no icons — left-aligned prose following Parker Lab's typographic model.

## Proposed Solution

### Update `src/app/research/page.tsx`

Replace placeholder with 4 research theme sections. Content is hardcoded inline (not from a JSON file) to keep it simple and editable — can migrate to CMS-driven content later.

**Page structure:**
```
PageHeader("Research")
  └─ Section: ICU Data Science
  └─ Section: Federated ICU Research
  └─ Section: Clinical Trials in ICU
  └─ Section: Multidisciplinary ICU Research
```

Each section:
```tsx
<section className="mb-12">
  <h2 className="text-xl font-bold text-rush-green mb-3">{title}</h2>
  <p className="text-rush-charcoal leading-relaxed max-w-3xl">
    {description — 3-5 sentences}
  </p>
</section>
```

### Draft content for each section

**ICU Data Science**
> The ICU generates thousands of data points per patient per day — vital signs, laboratory results, medications, ventilator settings, nursing assessments — yet most of this information is never systematically analyzed to improve care. Our lab develops machine learning models and NLP pipelines that transform raw electronic health record data into actionable clinical decision support. Current work includes predictive models for ICU mortality, early detection of clinical deterioration, and automated identification of treatment-eligible patient phenotypes from unstructured clinical notes.

**Federated ICU Research**
> Meaningful advances in critical care require data from diverse patient populations across many hospitals — but sharing raw patient data across institutions raises serious privacy and governance barriers. As founding members of the CLIF Consortium, we helped build an open-source data standard for longitudinal ICU data that enables high-quality, privacy-preserving multicenter research. Our federated approach now spans 10+ U.S. academic medical centers and over 800,000 ICU encounters, allowing us to study care variations and outcomes at a scale no single institution can achieve alone.

**Clinical Trials in ICU**
> Observational data can reveal associations between care variations and patient outcomes, but determining whether those associations are truly causal requires different methods. Our lab designs pragmatic randomized clinical trials in the ICU and applies advanced causal inference techniques — including instrumental variable analysis and target trial emulation — to observational data. Active projects include trials on intubation practices, bag-mask ventilation strategies, mechanical ventilation optimization, and antimicrobial stewardship in critically ill patients.

**Multidisciplinary ICU Research**
> Critical illness does not respect disciplinary boundaries, and neither does our research. RICCC brings together investigators from pulmonary medicine, critical care, emergency medicine, sleep medicine, respiratory care, biostatistics, and clinical informatics. This breadth allows us to approach problems from multiple angles — combining physiologic expertise with computational methods, clinical trial design with machine learning, and ethical analysis with empirical research. Whether you are a medical student, resident, data scientist, or established investigator, we welcome collaborators at every career stage.

## Acceptance Criteria

- [x] Research page displays 4 themed sections with prose descriptions
- [x] No "Coming Soon" placeholder text remains
- [x] PageHeader description updated to match new content
- [x] Left-aligned text throughout (no centered text on desktop)
- [x] No icon cards or symmetric grids
- [x] Content mentions specific methods (ML, NLP, causal inference, target trial emulation)
- [x] CLIF Consortium mentioned with context in Federated section
- [x] Multidisciplinary section includes a "join us" signal
- [x] TypeScript compiles clean

## Context

- Current page: `src/app/research/page.tsx` (placeholder)
- Hero goals: `src/components/home/hero.tsx` (4 matching goals)
- Peer model: Parker Lab uses theme-based prose sections, no cards
- CLAUDE.md: no symmetric grids, no centered body text, left-aligned throughout
