import { describe, it, expect } from "vitest";
import { formatAMA } from "../cite";
import { type Publication } from "../types";

function makePub(overrides: Partial<Publication> = {}): Publication {
  return {
    pmid: "12345",
    title: "Test Article Title",
    authors: "Smith J, Doe A, Lee B",
    journal: "J Test Med",
    year: "2024",
    doi: "10.1000/test",
    source: "pubmed",
    ...overrides,
  };
}

describe("formatAMA", () => {
  it("formats a full citation with all fields", () => {
    const pub = makePub({ volume: "12", issue: "3", pages: "45-50" });
    const result = formatAMA(pub);
    expect(result).toBe(
      "Smith J, Doe A, Lee B Test Article Title. J Test Med. 2024;12(3):45-50. doi:10.1000/test"
    );
  });

  it("formats citation without volume/issue/pages", () => {
    const result = formatAMA(makePub());
    expect(result).toBe(
      "Smith J, Doe A, Lee B Test Article Title. J Test Med. 2024. doi:10.1000/test"
    );
  });

  it("formats citation without journal", () => {
    const result = formatAMA(makePub({ journal: "" }));
    expect(result).toBe(
      "Smith J, Doe A, Lee B Test Article Title. 2024. doi:10.1000/test"
    );
  });

  it("formats citation without year", () => {
    const result = formatAMA(makePub({ year: "" }));
    expect(result).toBe(
      "Smith J, Doe A, Lee B Test Article Title. J Test Med. doi:10.1000/test"
    );
  });

  it("formats citation without journal or year", () => {
    const result = formatAMA(makePub({ journal: "", year: "" }));
    expect(result).toBe(
      "Smith J, Doe A, Lee B Test Article Title. doi:10.1000/test"
    );
  });

  it("does not double-period when title already ends with period", () => {
    const result = formatAMA(makePub({ title: "Title with period." }));
    expect(result).toContain("Title with period. J Test Med");
    expect(result).not.toContain("..");
  });

  it("omits DOI when null", () => {
    const result = formatAMA(makePub({ doi: null }));
    expect(result).not.toContain("doi:");
  });

  it("includes volume without issue", () => {
    const result = formatAMA(makePub({ volume: "5" }));
    expect(result).toContain("2024;5.");
  });

  it("includes volume and issue without pages", () => {
    const result = formatAMA(makePub({ volume: "5", issue: "2" }));
    expect(result).toContain("2024;5(2).");
  });
});
