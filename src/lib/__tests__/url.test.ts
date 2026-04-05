import { describe, it, expect } from "vitest";
import { isSafeUrl, isValidDoi, isValidPmid } from "../url";

describe("isSafeUrl", () => {
  it("accepts https URLs", () => {
    expect(isSafeUrl("https://example.com")).toBe(true);
  });

  it("accepts http URLs", () => {
    expect(isSafeUrl("http://example.com")).toBe(true);
  });

  it("accepts URLs with paths and query strings", () => {
    expect(isSafeUrl("https://example.com/path?q=1&b=2#hash")).toBe(true);
  });

  it("accepts URLs with ports", () => {
    expect(isSafeUrl("https://example.com:8080/api")).toBe(true);
  });

  it("rejects javascript: protocol", () => {
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
  });

  it("rejects data: protocol", () => {
    expect(isSafeUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
  });

  it("rejects file: protocol", () => {
    expect(isSafeUrl("file:///etc/passwd")).toBe(false);
  });

  it("rejects ftp: protocol", () => {
    expect(isSafeUrl("ftp://example.com")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isSafeUrl("")).toBe(false);
  });

  it("rejects malformed URLs", () => {
    expect(isSafeUrl("not a url")).toBe(false);
  });
});

describe("isValidDoi", () => {
  it("accepts standard DOIs", () => {
    expect(isValidDoi("10.1001/jama.2024.12345")).toBe(true);
    expect(isValidDoi("10.1038/s41586-024-07386-0")).toBe(true);
    expect(isValidDoi("10.1164/rccm.202401-0001OC")).toBe(true);
  });

  it("rejects wrong prefix", () => {
    expect(isValidDoi("11.1001/jama.2024")).toBe(false);
  });

  it("rejects incomplete DOIs", () => {
    expect(isValidDoi("10.1001")).toBe(false);
    expect(isValidDoi("10.")).toBe(false);
  });

  it("rejects empty and whitespace", () => {
    expect(isValidDoi("")).toBe(false);
    expect(isValidDoi("10.1001/jama 2024")).toBe(false);
  });
});

describe("isValidPmid", () => {
  it("accepts numeric IDs", () => {
    expect(isValidPmid("12345678")).toBe(true);
    expect(isValidPmid("1")).toBe(true);
  });

  it("rejects non-numeric", () => {
    expect(isValidPmid("abc")).toBe(false);
    expect(isValidPmid("123.45")).toBe(false);
    expect(isValidPmid("12345abc")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidPmid("")).toBe(false);
  });
});
