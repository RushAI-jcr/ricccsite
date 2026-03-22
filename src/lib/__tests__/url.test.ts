import { describe, it, expect } from "vitest";
import { isSafeUrl } from "../url";

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
