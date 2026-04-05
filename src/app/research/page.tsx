import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { RESEARCH_PILLARS } from "@/lib/research-pillars";

export const metadata: Metadata = {
  title: "Research",
  description: "Research focus areas at the RICCC Lab",
};

function pillar(id: string) {
  const found = RESEARCH_PILLARS.find((p) => p.id === id);
  if (!found) throw new Error(`Research pillar "${id}" not found`);
  return found;
}

export default function ResearchPage() {
  return (
    <main className="pt-32 pb-24">
      {/* Hero Header */}
      <header className="max-w-screen-2xl mx-auto px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <span className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-6 block">
              Research
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-rush-on-surface mb-8 leading-[1.1]">
              Our Research <br />
              <span className="text-rush-dark-green italic">Pillars</span>
            </h1>
            <p className="text-xl text-rush-on-surface-variant max-w-2xl leading-relaxed">
              Our work sits at the intersection of ICU data, machine learning,
              and clinical trials. The goal is practical: build tools and methods
              that help clinicians make better decisions for critically ill patients.
            </p>
          </div>
        </div>
      </header>

      {/* Pillar 01 — ICU Data Science */}
      <section className="mb-32 bg-rush-surface-container-low py-24">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="font-mono text-rush-dark-green font-bold text-4xl opacity-20">
              01
            </span>
            <h2 className="text-3xl font-bold mt-4 mb-6 text-rush-on-surface">
              {pillar("icu-data-science").title}
            </h2>
            <p className="text-rush-on-surface-variant leading-relaxed mb-8">
              {pillar("icu-data-science").full}
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-sm bg-rush-dark-green flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
                </span>
                <span className="text-sm font-medium text-rush-on-surface">
                  ICU Readmission Prediction
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-sm bg-rush-dark-green flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
                </span>
                <span className="text-sm font-medium text-rush-on-surface">
                  Clinical NLP & AI Screening
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pillar 02 — Federated ICU Research */}
      <section className="mb-32">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <span className="font-mono text-rush-dark-green font-bold text-4xl opacity-20">
                02
              </span>
              <h2 className="text-3xl font-bold mt-4 mb-6 text-rush-on-surface">
                {pillar("federated").title}
              </h2>
              <p className="text-rush-on-surface-variant leading-relaxed mb-6">
                {pillar("federated").full}
              </p>
              <a
                href={siteConfig.links.clif}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rush-dark-green font-bold border-b-2 border-rush-teal/30 pb-1 inline-block hover:border-rush-teal transition-colors"
              >
                Explore CLIF Documentation
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </div>
            <div className="lg:col-span-5 flex items-center">
              <div className="bg-rush-surface-container p-6 rounded-sm w-full">
                <p className="font-mono text-xs uppercase tracking-widest text-rush-on-surface-variant mb-2">
                  Network Status
                </p>
                <p className="text-base font-bold text-rush-dark-green">
                  CLIF Network Active
                </p>
                <p className="text-xs text-rush-on-surface-variant mt-1">
                  17 institutions · 62 hospitals · 800K+ patients
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillar 03 — Clinical Trials in ICU */}
      <section className="mb-32 bg-rush-dark-green text-white py-24">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="font-mono text-white/50 font-bold text-4xl">
              03
            </span>
            <h2 className="text-4xl font-bold mt-4 mb-8">
              {pillar("trials").title}
            </h2>
            <p className="text-xl text-white/80 mb-12 leading-relaxed">
              {pillar("trials").full}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 border border-white/10 bg-white/5 rounded-sm">
                <h4 className="font-bold mb-2">Individualized Treatment Effects</h4>
                <p className="text-sm text-white/80 leading-relaxed">
                  Models that estimate which patients are likely to benefit from
                  a given intervention — for example, personalized oxygenation
                  targets for patients on mechanical ventilation.
                </p>
              </div>
              <div className="p-6 border border-white/10 bg-white/5 rounded-sm">
                <h4 className="font-bold mb-2">Target Trial Emulation</h4>
                <p className="text-sm text-white/80 leading-relaxed">
                  Using observational ICU data to approximate the results of
                  trials that would be impractical or unethical to run — a way
                  to get causal answers from the data we already have.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillar 04 — Interdisciplinary Team Science */}
      <section className="mb-32">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="font-mono text-rush-dark-green font-bold text-4xl opacity-20">
              04
            </span>
            <h2 className="text-3xl font-bold mt-4 mb-6 text-rush-on-surface">
              {pillar("interdisciplinary").title}
            </h2>
            <p className="text-rush-on-surface-variant text-lg leading-relaxed mb-8">
              {pillar("interdisciplinary").full}
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                "Pulmonary & Critical Care",
                "Emergency Medicine",
                "Respiratory Therapy",
                "Biostatistics",
                "Data Science",
                "Clinical Informatics",
              ].map((discipline) => (
                <span
                  key={discipline}
                  className="px-4 py-2 bg-rush-surface-container-high rounded-sm text-xs font-mono uppercase tracking-widest text-rush-on-surface-variant"
                >
                  {discipline}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 mb-32">
        <div className="bg-rush-surface-container p-12 lg:p-24 rounded-sm">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-rush-on-surface">
              Interested in <br />
              Working Together?
            </h2>
            <p className="max-w-xl text-rush-on-surface-variant mb-10 leading-relaxed">
              If your work touches ICU data, clinical trials, or federated
              research, we would like to hear from you.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-rush-dark-green text-white px-8 py-4 rounded-sm font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
