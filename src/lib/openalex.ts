import { formatAuthorList } from "./types";

export interface OpenAlexWork {
  title: string;
  authors: string;
  journal: string;
  year: string;
  doi: string | null;
  volume?: string;
  issue?: string;
  pages?: string;
  citationCount: number;
}

interface OAWork {
  title: string;
  publication_year: number | null;
  doi: string | null;
  cited_by_count: number;
  primary_location: {
    source?: { display_name?: string };
  } | null;
  authorships: { author: { display_name: string } }[];
  biblio?: {
    volume?: string;
    issue?: string;
    first_page?: string;
    last_page?: string;
  };
}

const OA_BASE = "https://api.openalex.org";

/**
 * Fetch publications by OpenAlex author ID.
 * Uses author ID (not name search) for precise disambiguation.
 * No API key needed — just a polite mailto for better rate limits.
 */
export async function fetchAuthorWorks(
  authorId: string,
  limit = 200
): Promise<OpenAlexWork[]> {
  if (!authorId || !/^A\d+$/.test(authorId)) return [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    // Filter: English language only, exclude basic science (biology, chemistry, materials science)
    const filter = [
      `authorships.author.id:${authorId}`,
      "language:en",
      "type:article|review|preprint",
    ].join(",");

    const res = await fetch(
      `${OA_BASE}/works?filter=${filter}&sort=publication_date:desc&per_page=${limit}&select=title,publication_year,doi,cited_by_count,primary_location,authorships,biblio&mailto=riccc@rush.edu`,
      { signal: controller.signal, next: { revalidate: 86400 } }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`OpenAlex returned ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!data?.results || !Array.isArray(data.results)) return [];

    const works: OAWork[] = data.results;

    return works
      .filter((w) => w.title)
      .map((w) => {
        const authorList = w.authorships?.map((a) => a.author.display_name) ?? [];

        // OpenAlex DOIs include the full URL prefix — strip it
        const doi = w.doi?.replace("https://doi.org/", "") ?? null;

        // Page range from biblio
        const firstPage = w.biblio?.first_page;
        const lastPage = w.biblio?.last_page;
        const pages = firstPage && lastPage && firstPage !== lastPage
          ? `${firstPage}-${lastPage}`
          : firstPage || undefined;

        return {
          title: w.title,
          authors: formatAuthorList(authorList),
          journal: w.primary_location?.source?.display_name ?? "",
          year: w.publication_year?.toString() ?? "",
          doi,
          volume: w.biblio?.volume || undefined,
          issue: w.biblio?.issue || undefined,
          pages,
          citationCount: w.cited_by_count ?? 0,
        };
      });
  } catch (error) {
    console.warn("OpenAlex fetch failed:", error);
    return [];
  }
}
