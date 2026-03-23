import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Software & Tools",
  description: "Open-source software and computational tools from the RICCC Lab",
};

export default function SoftwarePage() {
  return (
    <div>
      <PageHeader 
        title="Software & Tools"
        description="Access open-source codebases, machine learning pipelines, and clinical data tools developed by our engineering and research teams."
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-rush-charcoal mb-4">Software Directory Coming Soon</h2>
        <p className="text-rush-mid-gray text-lg max-w-2xl mx-auto">
          We strongly believe in open science. We are preparing our repositories and documentation for public release. Links to GitHub and deployment tools will be available here soon.
        </p>
      </div>
    </div>
  );
}
