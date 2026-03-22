import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News",
  description: "Latest news from the RICCC Lab",
};

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-rush-green mb-4">
        News & Updates
      </h1>
      <p className="text-rush-mid-gray text-lg">News page coming in Phase 3.</p>
    </div>
  );
}
