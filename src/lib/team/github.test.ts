import { describe, it, expect } from "vitest";
import { normalizeGithubToUsername, isValidGithubUsername } from "./github";

describe("normalizeGithubToUsername", () => {
  it("returns empty for blank input", () => {
    expect(normalizeGithubToUsername("")).toBe("");
    expect(normalizeGithubToUsername("   ")).toBe("");
  });

  it("accepts valid bare usernames", () => {
    expect(normalizeGithubToUsername("octocat")).toBe("octocat");
    expect(normalizeGithubToUsername("foo-bar")).toBe("foo-bar");
  });

  it("extracts username from github.com profile URLs", () => {
    expect(normalizeGithubToUsername("https://github.com/octocat")).toBe("octocat");
    expect(normalizeGithubToUsername("https://www.github.com/foo-bar/")).toBe("foo-bar");
    expect(normalizeGithubToUsername("http://github.com/user?tab=repositories")).toBe("user");
  });

  it("returns empty for non-github URLs or invalid usernames", () => {
    expect(normalizeGithubToUsername("https://example.com/foo")).toBe("");
    expect(normalizeGithubToUsername("not a username!")).toBe("");
  });
});

describe("isValidGithubUsername", () => {
  it("matches GitHub username rules used for links", () => {
    expect(isValidGithubUsername("a")).toBe(true);
    expect(isValidGithubUsername("octo-cat")).toBe(true);
    expect(isValidGithubUsername("")).toBe(false);
  });
});
