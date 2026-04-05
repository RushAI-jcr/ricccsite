/** Validate that a URL uses http(s) protocol (blocks javascript: and other schemes). */
export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/** Validate a PubMed ID (numeric only). */
export function isValidPmid(id: string): boolean {
  return /^\d+$/.test(id);
}

/** Validate a DOI (must start with 10. registrant prefix). */
export function isValidDoi(doi: string): boolean {
  return /^10\.\d{4,9}\/[^\s]+$/.test(doi);
}

/** Only allow profile URLs on LinkedIn domains (prevents open redirects). */
export function isLinkedInUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    const host = parsed.hostname.toLowerCase();
    return host === "linkedin.com" || host.endsWith(".linkedin.com");
  } catch {
    return false;
  }
}
