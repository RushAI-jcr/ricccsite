import { type Publication } from "./types";
import { type SemanticPaper } from "./semantic-scholar";
import { type OpenAlexWork } from "./openalex";
import { siteConfig } from "./config";

/**
 * Merge publications from PubMed, Semantic Scholar, and OpenAlex.
 * Deduplicates by DOI. Priority: PubMed metadata > OpenAlex > S2.
 * Citation count: max across sources.
 */
export function mergePublications(
  pubmedPubs: readonly Publication[],
  s2Papers: readonly SemanticPaper[],
  oaWorks: readonly OpenAlexWork[] = []
): Publication[] {
  // Start with cloned PubMed results
  const enriched = pubmedPubs.map((pub) => ({ ...pub }));

  // Index by DOI for dedup
  const byDoi = new Map<string, Publication>();
  for (const pub of enriched) {
    if (pub.doi) byDoi.set(pub.doi.toLowerCase(), pub);
  }

  // Enrich from Semantic Scholar (citation counts)
  for (const s2 of s2Papers) {
    const key = s2.doi?.toLowerCase();
    const match = key ? byDoi.get(key) : undefined;

    if (match) {
      match.citationCount = Math.max(match.citationCount ?? 0, s2.citationCount);
      match.source = "both";
    } else if (s2.doi) {
      const pub: Publication = {
        pmid: s2.pmid ?? "",
        title: s2.title,
        authors: s2.authors,
        journal: s2.venue,
        year: s2.year?.toString() ?? "",
        doi: s2.doi,
        citationCount: s2.citationCount,
        source: "semantic-scholar",
      };
      enriched.push(pub);
      byDoi.set(s2.doi.toLowerCase(), pub);
    }
  }

  // Enrich from OpenAlex (citation counts, volume/issue/pages, + papers not in PubMed/S2)
  for (const oa of oaWorks) {
    const key = oa.doi?.toLowerCase();
    const match = key ? byDoi.get(key) : undefined;

    if (match) {
      match.citationCount = Math.max(match.citationCount ?? 0, oa.citationCount);
      // Backfill volume/issue/pages if PubMed didn't have them
      if (!match.volume && oa.volume) match.volume = oa.volume;
      if (!match.issue && oa.issue) match.issue = oa.issue;
      if (!match.pages && oa.pages) match.pages = oa.pages;
    } else if (oa.doi) {
      const pub: Publication = {
        pmid: "",
        title: oa.title,
        authors: oa.authors,
        journal: oa.journal,
        year: oa.year,
        doi: oa.doi,
        volume: oa.volume,
        issue: oa.issue,
        pages: oa.pages,
        citationCount: oa.citationCount,
        source: "openalex",
      };
      enriched.push(pub);
      byDoi.set(oa.doi.toLowerCase(), pub);
    }
  }

  // Filter out off-topic papers using configurable exclude patterns
  const excludePatterns = siteConfig.excludeTitlePatterns;
  const filtered = enriched.filter((pub) => {
    const title = pub.title.toLowerCase();
    return !excludePatterns.some((pattern) => title.includes(pattern));
  });

  // Sort by year (newest first)
  return filtered.sort((a, b) => b.year.localeCompare(a.year));
}
