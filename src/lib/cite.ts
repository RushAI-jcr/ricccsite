import { type Publication } from "./types";

/**
 * Format a publication as an AMA/Vancouver citation.
 * Example: Smith J, Doe A, Lee B. Article title. J Name. 2024;12(3):45-50. doi:10.1000/xyz
 */
export function formatAMA(pub: Publication): string {
  const parts: string[] = [];

  // Authors
  if (pub.authors) parts.push(pub.authors);

  // Title (ensure ends with period)
  const title = pub.title.endsWith(".") ? pub.title : `${pub.title}.`;
  parts.push(title);

  // Journal + Year;Volume(Issue):Pages
  if (pub.journal && pub.year) {
    let journalPart = pub.journal;
    journalPart += `. ${pub.year}`;
    if (pub.volume) {
      journalPart += `;${pub.volume}`;
      if (pub.issue) journalPart += `(${pub.issue})`;
      if (pub.pages) journalPart += `:${pub.pages}`;
    }
    journalPart += ".";
    parts.push(journalPart);
  } else if (pub.journal) {
    parts.push(`${pub.journal}.`);
  } else if (pub.year) {
    parts.push(`${pub.year}.`);
  }

  // DOI
  if (pub.doi) parts.push(`doi:${pub.doi}`);

  return parts.join(" ");
}
