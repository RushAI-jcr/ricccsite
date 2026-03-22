import { type Publication } from "./pubmed";
import { type SemanticPaper } from "./semantic-scholar";

/**
 * Merge PubMed and Semantic Scholar results.
 * Deduplicates by DOI/PMID — if a paper exists in both, keep PubMed metadata + add citation count.
 * Papers only in Semantic Scholar are added as new entries.
 * Does NOT mutate the input arrays.
 */
export function mergePublications(
  pubmedPubs: readonly Publication[],
  s2Papers: readonly SemanticPaper[]
): Publication[] {
  // Clone PubMed pubs to avoid mutating the input
  const enriched = pubmedPubs.map((pub) => ({ ...pub }));

  // Index cloned pubs by DOI/PMID for fast lookup
  const byDoi = new Map<string, Publication>();
  const byPmid = new Map<string, Publication>();

  for (const pub of enriched) {
    if (pub.doi) byDoi.set(pub.doi.toLowerCase(), pub);
    if (pub.pmid) byPmid.set(pub.pmid, pub);
  }

  // Enrich cloned pubs with Semantic Scholar citation counts
  for (const s2 of s2Papers) {
    const matchByDoi = s2.doi ? byDoi.get(s2.doi.toLowerCase()) : undefined;
    const matchByPmid = s2.pmid ? byPmid.get(s2.pmid) : undefined;
    const match = matchByDoi || matchByPmid;

    if (match) {
      match.citationCount = s2.citationCount;
      match.source = "both";
    }
  }

  // Find papers only in Semantic Scholar (not in PubMed)
  const s2Only: Publication[] = s2Papers
    .filter((s2) => {
      const matchByDoi = s2.doi ? byDoi.has(s2.doi.toLowerCase()) : false;
      const matchByPmid = s2.pmid ? byPmid.has(s2.pmid) : false;
      return !matchByDoi && !matchByPmid;
    })
    .map((s2) => ({
      pmid: s2.pmid ?? "",
      title: s2.title,
      authors: s2.authors,
      journal: s2.venue,
      year: s2.year?.toString() ?? "",
      doi: s2.doi,
      citationCount: s2.citationCount,
      source: "semantic-scholar" as const,
    }));

  // Combine and sort by year (newest first)
  return [...enriched, ...s2Only].sort((a, b) =>
    b.year.localeCompare(a.year)
  );
}
