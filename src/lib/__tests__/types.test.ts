import { describe, it, expect } from "vitest";
import { formatAuthorList } from "../types";

describe("formatAuthorList", () => {
  it("returns empty string for empty array", () => {
    expect(formatAuthorList([])).toBe("");
  });

  it("returns single name without et al.", () => {
    expect(formatAuthorList(["Smith J"])).toBe("Smith J");
  });

  it("joins two names with comma", () => {
    expect(formatAuthorList(["Smith J", "Doe A"])).toBe("Smith J, Doe A");
  });

  it("joins exactly max names without et al.", () => {
    expect(formatAuthorList(["A", "B", "C"])).toBe("A, B, C");
  });

  it("truncates with et al. when exceeding max", () => {
    expect(formatAuthorList(["A", "B", "C", "D"])).toBe("A, B, C, et al.");
  });

  it("truncates large lists", () => {
    const names = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    expect(formatAuthorList(names)).toBe("A, B, C, et al.");
  });

  it("respects custom max parameter", () => {
    expect(formatAuthorList(["A", "B", "C"], 1)).toBe("A, et al.");
  });

  it("handles max larger than array length", () => {
    expect(formatAuthorList(["A", "B"], 5)).toBe("A, B");
  });
});
