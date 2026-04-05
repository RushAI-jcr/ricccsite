import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "News & Updates",
  description:
    "Latest from the RICCC Lab at Rush University — ICU data science milestones, clinical trial updates, CLIF consortium developments, and team announcements.",
  openGraph: { url: "/news" },
};

export default function NewsPage() {
  return (
    <main className="bg-rush-surface text-rush-on-surface">
      <PageHeader
        label="News & Updates"
        title="The RICCC Dispatch"
        description="Lab announcements, grant awards, new publications, and team milestones, updated as the work unfolds."
      />

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-24">
        <div className="max-w-2xl">
          <div className="pl-8">
            <span className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-4 block">
              Coming Soon
            </span>
            <h2 className="text-2xl font-bold text-rush-on-surface mb-4">
              Newsfeed in Progress
            </h2>
            <p className="text-rush-on-surface-variant leading-relaxed">
              We are putting together a feed of lab news, grant awards, and milestones.
              It is not ready yet. In the meantime, you can follow our work through
              the{" "}
              <Link
                href="/publications"
                className="text-rush-dark-green font-semibold underline underline-offset-4 hover:text-rush-teal transition-colors"
              >
                publications page
              </Link>{" "}
              or reach out via the{" "}
              <Link
                href="/contact"
                className="text-rush-dark-green font-semibold underline underline-offset-4 hover:text-rush-teal transition-colors"
              >
                contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
