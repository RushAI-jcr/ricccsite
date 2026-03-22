import { describe, it, expect, vi } from "vitest";
import { type Publication } from "../types";
import { type SemanticPaper } from "../semantic-scholar";
import { type OpenAlexWork } from "../openalex";

// Mock siteConfig to control excludeTitlePatterns in tests
vi.mock("../config", () => ({
  siteConfig: {
    excludeTitlePatterns: ["drosophila", "mice model"],
  },
}));

// Import after mock is set up
const { mergePublications } = await import("../merge-publications");

function makePubmed(overrides: Partial<Publication> = {}): Publication {
  return {
    pmid: "111",
    title: "Clinical study of ICU outcomes",
    authors: "Rojas JC, Smith A",
    journal: "Crit Care Med",
    year: "2024",
    doi: "10.1000/ccm.2024",
    source: "pubmed",
    ...overrides,
  };
}

function makeS2(overrides: Partial<SemanticPaper> = {}): SemanticPaper {
  return {
    paperId: "s2-001",
    title: "Clinical study of ICU outcomes",
    authors: "Rojas JC, Smith A",
    venue: "Critical Care Medicine",
    year: 2024,
    citationCount: 15,
    doi: "10.1000/ccm.2024",
    pmid: "111",
    ...overrides,
  };
}

function makeOA(overrides: Partial<OpenAlexWork> = {}): OpenAlexWork {
  return {
    title: "Clinical study of ICU outcomes",
    authors: "Rojas JC, Smith A",
    journal: "Critical Care Medicine",
    year: "2024",
    doi: "10.1000/ccm.2024",
    citationCount: 12,
    ...overrides,
  };
}

describe("mergePublications", () => {
  it("returns empty array when all inputs are empty", () => {
    expect(mergePublications([], [], [])).toEqual([]);
  });

  it("returns PubMed-only papers sorted by year", () => {
    const pubs = [
      makePubmed({ year: "2022", doi: "10.1/a" }),
      makePubmed({ year: "2024", doi: "10.1/b" }),
      makePubmed({ year: "2023", doi: "10.1/c" }),
    ];
    const result = mergePublications(pubs, []);
    expect(result.map((p) => p.year)).toEqual(["2024", "2023", "2022"]);
  });

  it("deduplicates by DOI and sets source to 'both'", () => {
    const pubmed = [makePubmed()];
    const s2 = [makeS2()];
    const result = mergePublications(pubmed, s2);
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("both");
  });

  it("takes max citation count across sources", () => {
    const pubmed = [makePubmed({ citationCount: 5 })];
    const s2 = [makeS2({ citationCount: 20 })];
    const result = mergePublications(pubmed, s2);
    expect(result[0].citationCount).toBe(20);
  });

  it("takes max citation count when PubMed is higher", () => {
    const pubmed = [makePubmed({ citationCount: 30 })];
    const s2 = [makeS2({ citationCount: 10 })];
    const result = mergePublications(pubmed, s2);
    expect(result[0].citationCount).toBe(30);
  });

  it("backfills volume/issue/pages from OpenAlex", () => {
    const pubmed = [makePubmed()]; // no volume/issue/pages
    const oa = [makeOA({ volume: "42", issue: "3", pages: "100-110" })];
    const result = mergePublications(pubmed, [], oa);
    expect(result[0].volume).toBe("42");
    expect(result[0].issue).toBe("3");
    expect(result[0].pages).toBe("100-110");
  });

  it("does not overwrite existing volume/issue/pages", () => {
    const pubmed = [makePubmed({ volume: "10", issue: "1", pages: "5-15" })];
    const oa = [makeOA({ volume: "99", issue: "99", pages: "999" })];
    const result = mergePublications(pubmed, [], oa);
    expect(result[0].volume).toBe("10");
    expect(result[0].issue).toBe("1");
    expect(result[0].pages).toBe("5-15");
  });

  it("adds OpenAlex-only papers with source 'openalex'", () => {
    const oa = [makeOA({ doi: "10.1/unique-oa", title: "OA only paper" })];
    const result = mergePublications([], [], oa);
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("openalex");
    expect(result[0].title).toBe("OA only paper");
  });

  it("adds S2-only papers with source 'semantic-scholar'", () => {
    const s2 = [makeS2({ doi: "10.1/unique-s2", title: "S2 only paper" })];
    const result = mergePublications([], s2);
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("semantic-scholar");
  });

  it("filters out papers matching exclude patterns", () => {
    const pubs = [
      makePubmed({ title: "Drosophila gene expression study", doi: "10.1/d" }),
      makePubmed({ title: "ICU mortality prediction", doi: "10.1/i" }),
    ];
    const result = mergePublications(pubs, []);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("ICU mortality prediction");
  });

  it("exclude pattern matching is case-insensitive", () => {
    const pubs = [
      makePubmed({ title: "DROSOPHILA MELANOGASTER study", doi: "10.1/d" }),
    ];
    const result = mergePublications(pubs, []);
    expect(result).toHaveLength(0);
  });

  it("does not add S2 papers without DOI", () => {
    const s2 = [makeS2({ doi: null, title: "No DOI paper" })];
    const result = mergePublications([], s2);
    expect(result).toHaveLength(0);
  });

  it("deduplicates DOIs case-insensitively", () => {
    const pubmed = [makePubmed({ doi: "10.1000/ABC" })];
    const s2 = [makeS2({ doi: "10.1000/abc" })];
    const result = mergePublications(pubmed, s2);
    expect(result).toHaveLength(1);
  });
});
