import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Research",
  description: "Research focus areas at the RICCC Lab",
};

export default function ResearchPage() {
  return (
    <div>
      <PageHeader 
        title="Research"
        description="Discover how we leverage machine learning, large-scale clinical data, and thoughtful ethics to drive real-world impact in the ICU."
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-rush-charcoal mb-4">Detailed Research Portfolios Coming Soon</h2>
        <p className="text-rush-mid-gray text-lg max-w-2xl mx-auto">
          We are currently organizing detailed project summaries for our clinical AI models, data science pipelines, and healthcare equity frameworks. Please check back shortly!
        </p>
      </div>
    </div>
  );
}
