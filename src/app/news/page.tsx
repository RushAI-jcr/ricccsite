import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "News",
  description: "Latest news from the RICCC Lab",
};

export default function NewsPage() {
  return (
    <div>
      <PageHeader 
        title="News & Updates"
        description="Stay up-to-date with the latest lab announcements, grant awards, new publications, and team milestones."
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-rush-charcoal mb-4">Newsfeed Coming Soon</h2>
        <p className="text-rush-mid-gray text-lg max-w-2xl mx-auto">
          We are actively curating our recent press releases and lab achievements. Our news portal will be launching soon.
        </p>
      </div>
    </div>
  );
}
