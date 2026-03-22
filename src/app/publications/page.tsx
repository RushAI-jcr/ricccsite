import type { Metadata } from "next";
import { searchByAuthor } from "@/lib/pubmed";
import { searchAuthorPapers } from "@/lib/semantic-scholar";
import { mergePublications } from "@/lib/merge-publications";
import { PubFilters } from "@/components/publications/pub-filters";
import { ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Publications",
  description: "Publications from the RICCC Lab",
};

// ISR: revalidate every 24 hours
export const revalidate = 86400;

export default async function PublicationsPage() {
  // Fetch from both sources in parallel
  const [pubmedPubs, s2Papers] = await Promise.all([
    searchByAuthor(siteConfig.pubmedQuery),
    searchAuthorPapers(siteConfig.pi.name),
  ]);

  // Merge and deduplicate
  const publications = mergePublications(pubmedPubs, s2Papers);

  // If both APIs failed and returned nothing, throw so ISR preserves the previous cached page
  // instead of caching an empty result for 24 hours
  if (publications.length === 0 && (siteConfig.pubmedQuery || siteConfig.pi.name)) {
    throw new Error("No publications returned from any source — preserving stale cache");
  }

  const pubmedCount = publications.filter(
    (p) => p.source === "pubmed" || p.source === "both"
  ).length;
  const s2OnlyCount = publications.filter(
    (p) => p.source === "semantic-scholar"
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-rush-indigo mb-4">
        Publications
      </h1>

      {/* External links */}
      <div className="flex flex-wrap gap-4 mb-4">
        {siteConfig.links.googleScholar && (
          <a
            href={siteConfig.links.googleScholar}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-rush-deep-blue hover:underline"
          >
            Google Scholar <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {siteConfig.links.myNcbi && (
          <a
            href={siteConfig.links.myNcbi}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-rush-deep-blue hover:underline"
          >
            MyNCBI <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      <p className="text-rush-mid-gray mb-8">
        {publications.length > 0
          ? `${publications.length} publications (${pubmedCount} from PubMed${s2OnlyCount > 0 ? `, ${s2OnlyCount} additional from Semantic Scholar` : ""}).`
          : "Publications are loaded automatically from PubMed and Semantic Scholar."}
      </p>

      <PubFilters publications={publications} />
    </div>
  );
}
