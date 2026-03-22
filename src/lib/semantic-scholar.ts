export interface SemanticPaper {
  paperId: string;
  title: string;
  authors: string;
  venue: string;
  year: number | null;
  citationCount: number;
  doi: string | null;
  pmid: string | null;
}

interface S2AuthorWithPapers {
  authorId: string;
  name: string;
  papers: S2Paper[];
}

interface S2Paper {
  paperId: string;
  title: string;
  year: number | null;
  citationCount: number;
  authors: { name: string }[];
  externalIds: { DOI?: string; PubMed?: string } | null;
  publicationVenue: { name: string } | null;
}

const S2_BASE = "https://api.semanticscholar.org/graph/v1";

// Per S2 API docs, the /author/search endpoint supports inline papers fields,
// so we can get author + papers in a single request instead of two sequential calls.
const PAPER_FIELDS =
  "papers.title,papers.year,papers.citationCount,papers.externalIds,papers.publicationVenue,papers.authors";

/**
 * Search for an author on Semantic Scholar and return their papers with citation counts.
 * Uses a single API call with inline paper fields (per S2 docs).
 */
export async function searchAuthorPapers(
  authorName: string,
  limit = 5
): Promise<SemanticPaper[]> {
  if (!authorName) return [];

  const apiKey = process.env.SEMANTIC_SCHOLAR_API_KEY;
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(apiKey ? { "x-api-key": apiKey } : {}),
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    // Single call: search author with inline papers fields
    const res = await fetch(
      `${S2_BASE}/author/search?query=${encodeURIComponent(authorName)}&fields=${PAPER_FIELDS}&limit=${limit}`,
      { headers, signal: controller.signal, next: { revalidate: 86400 } }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`Semantic Scholar author search returned ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!data?.data || !Array.isArray(data.data) || data.data.length === 0) {
      return [];
    }

    const author: S2AuthorWithPapers = data.data[0];
    const papers: S2Paper[] = author.papers ?? [];

    return papers
      .filter((p) => p.title)
      .map((p) => {
        const authorList = p.authors?.map((a) => a.name) ?? [];
        const authorsStr =
          authorList.length > 3
            ? `${authorList.slice(0, 3).join(", ")}, et al.`
            : authorList.join(", ");

        return {
          paperId: p.paperId,
          title: p.title,
          authors: authorsStr,
          venue: p.publicationVenue?.name ?? "",
          year: p.year,
          citationCount: p.citationCount ?? 0,
          doi: p.externalIds?.DOI ?? null,
          pmid: p.externalIds?.PubMed ?? null,
        };
      })
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  } catch (error) {
    console.warn("Semantic Scholar fetch failed:", error);
    return [];
  }
}
