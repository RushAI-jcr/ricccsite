import { type Publication, formatAuthorList } from "./types";

interface PubMedArticle {
  uid: string;
  title: string;
  authors: { name: string }[];
  source: string;
  pubdate: string;
  volume?: string;
  issue?: string;
  pages?: string;
  elocationid?: string;
  articleids: { idtype: string; value: string }[];
}

const NCBI_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

/**
 * Search PubMed by author name + affiliation query (Parker Lab pattern).
 * No manual PMID curation needed — publications are discovered automatically.
 */
export async function searchByAuthor(
  query: string,
  maxResults = 100
): Promise<Publication[]> {
  if (!query) return [];

  const apiKey = process.env.NCBI_API_KEY;

  try {
    // Step 1: Search for PMIDs matching the query
    const searchParams = new URLSearchParams({
      db: "pubmed",
      term: query,
      retmax: String(maxResults),
      retmode: "json",
      sort: "date",
      ...(apiKey ? { api_key: apiKey } : {}),
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const searchRes = await fetch(
      `${NCBI_BASE}/esearch.fcgi?${searchParams}`,
      { next: { revalidate: 86400 }, signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!searchRes.ok) {
      console.warn(`PubMed esearch returned ${searchRes.status}`);
      return [];
    }

    const searchData: { esearchresult?: { idlist?: string[] } } =
      await searchRes.json();
    const pmids = searchData.esearchresult?.idlist ?? [];

    if (pmids.length === 0) return [];

    // Step 2: Fetch metadata for those PMIDs
    return fetchByPMIDs(pmids);
  } catch (error) {
    console.warn("PubMed author search failed:", error);
    return [];
  }
}

/**
 * Fetch publication metadata for a list of PMIDs.
 */
async function fetchByPMIDs(pmids: string[]): Promise<Publication[]> {
  if (pmids.length === 0) return [];

  const apiKey = process.env.NCBI_API_KEY;
  const params = new URLSearchParams({
    db: "pubmed",
    id: pmids.join(","),
    retmode: "json",
    ...(apiKey ? { api_key: apiKey } : {}),
  });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${NCBI_BASE}/esummary.fcgi?${params}`, {
      next: { revalidate: 86400 },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`PubMed esummary returned ${res.status}`);
      return pmids.map(fallbackPublication);
    }

    const data: { result?: Record<string, PubMedArticle> } = await res.json();
    const result = data.result ?? {};

    return pmids
      .map((pmid) => {
        const article = result[pmid];
        if (!article?.title) return fallbackPublication(pmid);

        const doi =
          article.articleids?.find((a) => a.idtype === "doi")?.value ??
          article.elocationid?.replace("doi: ", "") ??
          null;

        const authorList = article.authors?.map((a) => a.name) ?? [];
        const year = article.pubdate?.split(" ")[0] ?? "";

        return {
          pmid,
          title: article.title,
          authors: formatAuthorList(authorList),
          journal: article.source,
          year,
          doi,
          volume: article.volume || undefined,
          issue: article.issue || undefined,
          pages: article.pages || undefined,
          source: "pubmed" as const,
        };
      })
      .sort((a, b) => b.year.localeCompare(a.year));
  } catch (error) {
    console.warn("PubMed fetch failed:", error);
    return pmids.map(fallbackPublication);
  }
}

function fallbackPublication(pmid: string): Publication {
  return {
    pmid,
    title: `Publication (PMID: ${pmid})`,
    authors: "Metadata unavailable",
    journal: "",
    year: "",
    doi: null,
    source: "pubmed",
  };
}
