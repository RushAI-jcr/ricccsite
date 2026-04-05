/**
 * GitHub is stored in team MDX as a bare username (matches public link builder).
 * Staff/Sveltia may submit a full https://github.com/... profile URL — normalize here.
 */

const GITHUB_USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

export function isValidGithubUsername(s: string): boolean {
  return s.length > 0 && GITHUB_USERNAME_RE.test(s);
}

/**
 * Returns a canonical username, or "" if empty/invalid input.
 * Accepts bare usernames or https://github.com/{user}/... URLs.
 */
export function normalizeGithubToUsername(input: string): string {
  const s = input.trim();
  if (!s) return "";

  if (/^https?:\/\//i.test(s)) {
    try {
      const u = new URL(s);
      const host = u.hostname.replace(/^www\./i, "").toLowerCase();
      if (host !== "github.com") return "";
      const first = u.pathname.split("/").filter(Boolean)[0];
      if (!first) return "";
      return isValidGithubUsername(first) ? first : "";
    } catch {
      return "";
    }
  }

  return isValidGithubUsername(s) ? s : "";
}
