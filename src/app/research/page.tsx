import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research",
  description: "Research focus areas at the RICCC Lab",
};

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-rush-indigo mb-4">Research</h1>
      <p className="text-rush-mid-gray text-lg">
        Research page coming in Phase 2.
      </p>
    </div>
  );
}
