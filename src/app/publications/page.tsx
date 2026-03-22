import type { Metadata } from "next";
import { searchByAuthor } from "@/lib/pubmed";
import { searchAuthorPapers } from "@/lib/semantic-scholar";
import { fetchAuthorWorks } from "@/lib/openalex";
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

  const pubmedCount = publications.filter(
    (p) => p.source === "pubmed" || p.source === "both"
  ).length;
  const otherCount = publications.length - pubmedCount;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-rush-green mb-4">
        Publications
      </h1>

      {/* External links */}
      <div className="flex flex-wrap gap-4 mb-4">
        {siteConfig.links.googleScholar && (
          <a
            href={siteConfig.links.googleScholar}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-rush-teal hover:underline"
          >
            Google Scholar <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {siteConfig.links.myNcbi && (
          <a
            href={siteConfig.links.myNcbi}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-rush-teal hover:underline"
          >
            MyNCBI <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      <p className="text-rush-mid-gray mb-8">
        {publications.length > 0
          ? `${publications.length} publications (${pubmedCount} from PubMed${otherCount > 0 ? `, ${otherCount} additional from OpenAlex/Semantic Scholar` : ""}).`
          : "Publications are loaded automatically from PubMed, Semantic Scholar, and OpenAlex."}
      </p>

      <PubFilters publications={publications} />
    </div>
  );
}
