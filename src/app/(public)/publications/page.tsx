import type { Metadata } from "next";
import { searchByAuthor } from "@/lib/pubmed";
import { searchAuthorPapers } from "@/lib/semantic-scholar";
import { fetchAuthorWorks } from "@/lib/openalex";
import { mergePublications } from "@/lib/merge-publications";
import { PubFilters } from "@/components/publications/pub-filters";
import { ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Publications | ICU & Critical Care Research",
  description:
    "Publications from J.C. Rojas, Kevin Buell, and the RICCC Lab — ICU data science, AI, clinical trials, and federated critical care research at Rush University.",
  openGraph: { url: "/publications" },
};

// ISR: revalidate every 24 hours
export const revalidate = 86400;

export default async function PublicationsPage() {
  // Fetch from all 3 sources in parallel
  const [pubmedPubs, s2Results, oaResults] = await Promise.all([
    // PubMed: author-name query
    searchByAuthor(siteConfig.pubmedQuery),
    // Semantic Scholar: per-author name search
    Promise.all(siteConfig.authors.map((author) => searchAuthorPapers(author))),
    // OpenAlex: per-author ID search (most reliable, broadest coverage)
    Promise.all(siteConfig.openalexAuthors.map((a) => fetchAuthorWorks(a.id))),
  ]);

  const s2Papers = s2Results.flat();
  const oaWorks = oaResults.flat();

  // Merge and deduplicate across all 3 sources
  const publications = mergePublications(pubmedPubs, s2Papers, oaWorks);

  // If all APIs failed, throw so ISR preserves the previous cached page
  if (publications.length === 0 && (siteConfig.pubmedQuery || siteConfig.openalexAuthors.length > 0)) {
    throw new Error("No publications returned from any source — preserving stale cache");
  }

  return (
    <main className="bg-rush-surface text-rush-on-surface">
      <PageHeader
        label="The Living Archive"
        title="Publications"
        description="Papers from the lab: critical care, machine learning, federated data, and healthcare equity. Automatically synced from PubMed, OpenAlex, and Semantic Scholar."
      />

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-24">
        {/* External links */}
        <div className="flex flex-wrap gap-6 mb-10 pb-6 border-b border-rush-outline-variant/20">
          {siteConfig.links.googleScholarProfiles.map((profile) => (
            <a
              key={profile.url}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-rush-teal hover:text-rush-dark-green transition-colors underline underline-offset-4"
            >
              Google Scholar — {profile.name}{" "}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          ))}
          {siteConfig.links.myNcbi && (
            <a
              href={siteConfig.links.myNcbi}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-rush-teal hover:text-rush-dark-green transition-colors underline underline-offset-4"
            >
              MyNCBI <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
        </div>

        <PubFilters publications={publications} />

        <div className="mt-16 pt-10 border-t border-rush-outline-variant/20 flex flex-wrap gap-6">
          {siteConfig.links.googleScholarProfiles.map((profile) => (
            <a
              key={`footer-${profile.url}`}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-rush-teal hover:text-rush-dark-green transition-colors underline underline-offset-4"
            >
              Google Scholar — {profile.name}{" "}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
