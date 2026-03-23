import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Research",
  description: "Research focus areas at the RICCC Lab",
};

const themes = [
  {
    title: "ICU Data Science",
    description:
      "The ICU generates thousands of data points per patient per day — vital signs, laboratory results, medications, ventilator settings, nursing assessments — yet most of this information is never systematically analyzed to improve care. Our lab develops machine learning models and NLP pipelines that transform raw electronic health record data into actionable clinical decision support. Current work includes predictive models for ICU mortality, early detection of clinical deterioration, and automated identification of treatment-eligible patient phenotypes from unstructured clinical notes.",
  },
  {
    title: "Federated ICU Research",
    description:
      "Meaningful advances in critical care require data from diverse patient populations across many hospitals — but sharing raw patient data across institutions raises serious privacy and governance barriers. As founding members of the CLIF Consortium, we helped build an open-source data standard for longitudinal ICU data that enables high-quality, privacy-preserving multicenter research. Our federated approach now spans 10+ U.S. academic medical centers and over 800,000 ICU encounters, allowing us to study care variations and outcomes at a scale no single institution can achieve alone.",
  },
  {
    title: "Clinical Trials in ICU",
    description:
      "Observational data can reveal associations between care variations and patient outcomes, but determining whether those associations are truly causal requires different methods. Our lab designs pragmatic randomized clinical trials in the ICU and applies advanced causal inference techniques — including instrumental variable analysis and target trial emulation — to observational data. Active projects include trials on intubation practices, bag-mask ventilation strategies, mechanical ventilation optimization, and antimicrobial stewardship in critically ill patients.",
  },
  {
    title: "Multidisciplinary ICU Research",
    description:
      "Critical illness does not respect disciplinary boundaries, and neither does our research. RICCC brings together investigators from pulmonary medicine, critical care, emergency medicine, sleep medicine, respiratory care, biostatistics, and clinical informatics. This breadth allows us to approach problems from multiple angles — combining physiologic expertise with computational methods, clinical trial design with machine learning, and ethical analysis with empirical research. Whether you are a medical student, resident, data scientist, or established investigator, we welcome collaborators at every career stage.",
  },
];

export default function ResearchPage() {
  return (
    <div>
      <PageHeader
        title="Research"
        description="We leverage machine learning, large-scale clinical data, and causal inference to drive real-world impact in the ICU."
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {themes.map((theme) => (
          <section key={theme.title} className="mb-12 last:mb-0">
            <h2 className="text-xl font-bold text-rush-green mb-3">
              {theme.title}
            </h2>
            <p className="text-rush-charcoal leading-relaxed max-w-3xl">
              {theme.description}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
