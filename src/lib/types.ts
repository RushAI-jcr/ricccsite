export interface Publication {
  pmid: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  doi: string | null;
  volume?: string;
  issue?: string;
  pages?: string;
  citationCount?: number;
  source: "pubmed" | "semantic-scholar" | "openalex" | "both";
}

/**
 * Format an author name list for display.
 * Shows first `max` names, then "et al." if truncated.
 */
export function formatAuthorList(names: string[], max = 3): string {
  if (names.length === 0) return "";
  return names.length > max
    ? `${names.slice(0, max).join(", ")}, et al.`
    : names.join(", ");
}
