import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Tools | CLIF Consortium & Open ICU Data Standards",
  description:
    "Open-source ICU data infrastructure from RICCC: the CLIF federated data standard (17 institutions, 62 hospitals, 800K+ patients), reproducible pipelines, and FairCareAI for healthcare AI auditing.",
};

interface TechStackItem {
  id: string;
  colSpan: string;
  bg: string;
  heading: string;
  description: string;
  tags: string[] | null;
  tagBg: string | null;
  variant: "dark" | "light";
}

const techStack: TechStackItem[] = [
  {
    id: "data",
    colSpan: "md:col-span-2 lg:col-span-3",
    bg: "bg-rush-dark-green text-white",
    heading: "Data Standards",
    description:
      "Rush is a founding site in the CLIF Consortium (17 institutions, 62 hospitals). We contribute to the open-source data standard: 22+ relational tables covering vitals, labs, medications, respiratory support, microbiology, and procedures.",
    tags: ["CLIF", "17 Institutions", "800K+ Patients"],
    tagBg: "bg-white/20 text-white",
    variant: "dark",
  },
  {
    id: "analysis",
    colSpan: "md:col-span-2 lg:col-span-2",
    bg: "bg-rush-surface-container-high",
    heading: "Analysis & Pipelines",
    description: "Reproducible pipelines for cohort construction, phenotyping, and causal inference across federated ICU datasets.",
    tags: null,
    tagBg: null,
    variant: "light",
  },
  {
    id: "viz",
    colSpan: "md:col-span-2 lg:col-span-2",
    bg: "bg-rush-secondary-container",
    heading: "Visualization",
    description:
      "Interactive dashboards for exploratory cohort analysis and study reporting across multi-center datasets.",
    tags: null,
    tagBg: null,
    variant: "light",
  },
];

const openStandardsFeatures = [
  {
    title: "CLIF Schema",
    description: "Relational tables for temporal clinical entities: ventilator settings, medication drips, vitals, labs, and intake/output across ICU stays.",
  },
  {
    title: "Privacy-Preserving Federation",
    description: "Multi-center research that never requires pooling raw patient data across institutional boundaries.",
  },
  {
    title: "EHR Extraction Pipelines",
    description: "Site-specific ETL pipelines that map local EHR data into the shared CLIF format for cross-institutional analysis.",
  },
];

const FAIRCARE_GITHUB = "https://github.com/riccc-rush-lab/faircare";

const fairCareAiHighlights = [
  "Two report personas: full technical validation for data scientists, and streamlined 3–5 page governance-ready summaries.",
  "Implements the Van Calster et al. (2025) fairness visualization framework (e.g., AUROC, calibration, sensitivity/TPR, selection rate) with plain-language explanations.",
  "Aligned with the Coalition for Health AI (CHAI) Responsible AI Checkpoint 1 and RAIC governance artifacts (model card, reproducibility bundle).",
  "Runs locally with no cloud requirement for audit computation (HIPAA-friendly workflow). Accessibility-minded outputs (WCAG-oriented typography, colorblind-safe palettes).",
];

const clifJsonLd = {
  "@context": "https://schema.org",
  "@type": "ResearchProject",
  name: "CLIF Consortium",
  alternateName: "Common Longitudinal ICU Format",
  description:
    "An open-source federated ICU data standard spanning 17 institutions, 62 hospitals, and 800,000+ patients",
  url: "https://clif-icu.com",
  foundingDate: "2025",
  funder: {
    "@type": "ResearchOrganization",
    name: "RICCC",
    url: siteConfig.url,
  },
  memberOf: {
    "@type": "ResearchOrganization",
    name: "RICCC",
    url: siteConfig.url,
  },
};

export default function ToolsPage() {
  return (
    <main className="bg-rush-surface text-rush-on-surface">
      <JsonLd data={clifJsonLd} />
      {/* Hero */}
      <header className="pt-32 pb-16 max-w-screen-2xl mx-auto px-6 lg:px-8 mb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <span className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-4 block">
              Tools & Infrastructure
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-rush-on-surface leading-[1.1] mb-8">
              Tools &{" "}
              <br />
              <span className="text-rush-dark-green italic">Open Standards</span>
            </h1>
            <p className="text-xl text-rush-on-surface-variant max-w-2xl leading-relaxed">
              The tools and data standards we use and contribute to, from federated ICU data
              formats to open-source fairness auditing. Most of this is built in the open.
            </p>
          </div>
          <div className="lg:col-span-4 flex items-end">
            <div className="p-6 bg-rush-surface-container rounded-sm w-full">
              <span className="font-mono text-[0.7rem] uppercase tracking-widest text-rush-teal block mb-2">
                Technical Approach
              </span>
              <p className="text-sm font-medium italic text-rush-on-surface-variant leading-relaxed">
                &ldquo;Federation, not centralization: models and results cross institutional
                boundaries, raw patient data never does.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Technical Stack bento grid */}
      <section className="bg-rush-surface-container-low py-24">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-16 ml-0 lg:ml-10 text-rush-on-surface">
            The Technical Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {techStack.map((item) => {
              const isDark = item.variant === "dark";

              return (
                <div
                  key={item.id}
                  className={`${item.colSpan} ${item.bg} p-8 rounded-sm flex flex-col justify-between shadow-card-sm`}
                >
                  <div>
                    <h3
                      className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-rush-on-surface"}`}
                    >
                      {item.heading}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed mb-6 ${
                        isDark ? "text-white/80" : "text-rush-on-surface-variant"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                  {item.tags && item.tagBg && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-3 py-1 rounded-full font-mono text-xs uppercase tracking-widest ${item.tagBg}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Standards section */}
      <section className="py-24">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: CLIF description */}
            <div>
              <h2 className="text-4xl font-bold mb-8 leading-tight text-rush-on-surface">
                Open Standards for
                <br />
                Critical Care Research
              </h2>
              <p className="text-lg text-rush-on-surface-variant mb-12 leading-relaxed">
                The{" "}
                <a
                  href={siteConfig.links.clif}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-rush-dark-green underline underline-offset-4"
                >
                  CLIF Consortium
                </a>{" "}
                (Common Longitudinal ICU Format) is an open-source data standard published in{" "}
                <em>Intensive Care Medicine</em> (2025). Rush is a founding site in the network,
                which now spans 17 institutions, 62 hospitals, and over 800,000 ICU patients. CLIF
                defines 22+ relational tables for the full complexity of an ICU stay, including ventilator
                settings, medication drips, vitals, labs, microbiology, and procedures, so
                multi-site studies can run without centralizing raw patient data.
              </p>
              <div className="space-y-6">
                {openStandardsFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex gap-4 items-start p-4 hover:bg-rush-surface-container-low transition-colors rounded-sm"
                  >
                    <div className="w-10 h-10 rounded-full bg-rush-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-rush-dark-green text-sm font-bold">&rarr;</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-rush-on-surface text-base mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-rush-on-surface-variant leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: CLIF network stats */}
            <div className="bg-rush-surface-container-high rounded-sm overflow-hidden shadow-card">
              <div className="bg-rush-dark-green px-8 py-6">
                <span className="font-mono text-xs uppercase tracking-widest text-white/60 block mb-1">
                  CLIF Consortium
                </span>
                <p className="text-white font-bold text-lg">Network at a Glance</p>
              </div>
              <div className="divide-y divide-rush-outline-variant/20">
                {[
                  { stat: "17", label: "Institutions" },
                  { stat: "62", label: "Hospitals" },
                  { stat: "800K+", label: "ICU patients" },
                  { stat: "22+", label: "Relational tables" },
                ].map(({ stat, label }) => (
                  <div key={label} className="flex items-center justify-between px-8 py-5">
                    <span className="text-rush-on-surface-variant text-sm">{label}</span>
                    <span className="font-mono text-2xl font-bold text-rush-dark-green">{stat}</span>
                  </div>
                ))}
              </div>
              <div className="px-8 py-6 bg-rush-surface-container border-t border-rush-outline-variant/20">
                <a
                  href={siteConfig.links.clif}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-sm text-rush-dark-green underline underline-offset-4 decoration-rush-teal hover:gap-4 transition-all"
                >
                  Visit clif-icu.com &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open software: FairCareAI */}
      <section className="bg-rush-surface-container-low py-24 border-t border-rush-outline-variant/10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-4 block">
              Open software
            </span>
            <h2 className="text-4xl font-bold text-rush-on-surface mb-4 leading-tight">
              Healthcare AI fairness auditing for clinical decision support
            </h2>
            <p className="text-lg text-rush-on-surface-variant leading-relaxed">
              <strong className="font-semibold text-rush-on-surface">FairCareAI</strong> is a Python
              package for auditing machine learning models for fairness in clinical settings. It is
              built on the Van Calster et al. (2025) methodology and aligned with the CHAI RAIC
              governance framework, so health system teams can bring evidence-based fairness analysis to
              governance and clinical stakeholders.
            </p>
          </div>

          <div className="rounded-sm border border-rush-outline-variant/25 bg-rush-surface p-8 md:p-10 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-rush-dark-green mb-2">FairCareAI</h3>
                <p className="text-sm text-rush-on-surface-variant max-w-xl leading-relaxed">
                  Package suggests, humans decide. FairCareAI produces metrics and visualizations for
                  review; deployment and policy choices remain with your institution and committees.
                </p>
              </div>
              <a
                href={FAIRCARE_GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center bg-rush-dark-green text-white px-6 py-3 rounded-sm font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                View on GitHub
              </a>
            </div>

            <ul className="space-y-3 mb-8 text-sm text-rush-on-surface-variant leading-relaxed">
              {fairCareAiHighlights.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="text-rush-teal font-bold shrink-0" aria-hidden>
                    ·
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mb-6">
              <p className="font-mono text-xs uppercase tracking-widest text-rush-on-surface-variant mb-2">
                Install
              </p>
              <pre className="bg-rush-surface-container-high rounded-sm p-4 font-mono text-sm text-rush-on-surface overflow-x-auto border border-rush-outline-variant/20">
                <code>pip install faircareai</code>
              </pre>
              <p className="mt-2 text-xs text-rush-on-surface-variant">
                Optional exports (PDF, PowerPoint, PNG bundles):{" "}
                <code className="font-mono text-rush-on-surface">pip install &quot;faircareai[export]&quot;</code>
                . See the repository for Playwright/Chromium setup for PDF generation.
              </p>
            </div>

            <p className="text-xs text-rush-on-surface-variant leading-relaxed border-t border-rush-outline-variant/20 pt-6">
              FairCareAI supports CHAI-grounded fairness review; all outputs are advisory. Validate
              results in your local context before any clinical or operational use. Software is
              provided as-is; see the project license and documentation on GitHub.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-rush-surface py-24 border-t border-rush-outline-variant/10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-4 block">
              Get Involved
            </span>
            <h2 className="text-4xl font-bold text-rush-dark-green mb-6 tracking-tight">
              Advance Critical Care With Us
            </h2>
            <p className="text-lg text-rush-on-surface-variant mb-10 leading-relaxed">
              Whether you are a clinician, engineer, or researcher, our infrastructure is designed to
              be open, reproducible, and collaborative. Reach out to learn how RICCC tools can power
              your next study.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-rush-dark-green text-white px-8 py-4 rounded-sm font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Contact the Lab
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
