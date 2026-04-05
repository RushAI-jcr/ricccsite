export interface ResearchPillar {
  id: string;
  title: string;
  short: string;
  full: string;
}

export const RESEARCH_PILLARS: ResearchPillar[] = [
  {
    id: "icu-data-science",
    title: "ICU Data Science",
    short:
      "We use machine learning and NLP on ICU data to build tools clinicians can actually use — readmission risk scores, deterioration alerts, and AI-assisted screening.",
    full:
      "The ICU generates thousands of data points per patient per day, but most of it sits in the EHR unused. We build models and NLP pipelines that try to change that — readmission risk scores, early deterioration alerts, and AI-assisted substance misuse screening that runs at the bedside. The goal is practical: tools that help clinicians make better decisions with data they already have.",
  },
  {
    id: "federated",
    title: "Federated ICU Research",
    short:
      "Rush is a founding site in the CLIF Consortium — an open-source ICU data standard now spanning 17 institutions, 62 hospitals, and 800,000+ patients.",
    full:
      "Good ICU research needs diverse data from many hospitals, but sharing raw patient records is a non-starter for privacy. The CLIF Consortium addresses this with a shared, open-source data standard. Rush is a founding site in the network, which now covers 17 institutions, 62 hospitals, and over 800,000 ICU patients. The idea is federation over centralization: models and results move across institutions, raw data never does.",
  },
  {
    id: "trials",
    title: "Clinical Trials & Causal Inference",
    short:
      "Pragmatic trials run inside real ICU workflows, paired with causal inference methods to figure out which treatments actually help which patients.",
    full:
      "ICU care varies a lot between hospitals and between patients, and it is often unclear whether those variations matter. We run pragmatic trials embedded in everyday ICU workflows and use causal inference methods — target trial emulation, heterogeneous treatment effect modeling — to figure out which patients benefit from which interventions. Current work includes individualized oxygenation targets and ventilation strategies.",
  },
  {
    id: "interdisciplinary",
    title: "Interdisciplinary Team Science",
    short:
      "We work with emergency medicine, respiratory therapy, biostatistics, and informatics at Rush — the problems we care about don't fit in one discipline.",
    full:
      "Critical illness doesn't respect disciplinary boundaries. At Rush, we work with investigators in emergency medicine and respiratory therapy on shared trials and data science, alongside biostatisticians, data scientists, and clinical informaticists. The questions that matter at the bedside don't fit neatly into one department, so neither do we.",
  },
];
