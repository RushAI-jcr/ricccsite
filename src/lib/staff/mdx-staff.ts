import matter from "gray-matter";
import slugLib from "slug";
import type { MemberFrontmatter } from "./types";

// Canonical key order for serialization — prevents noisy git diffs
const FIELD_ORDER: (keyof MemberFrontmatter)[] = [
  "name",
  "role",
  "tier",
  "email",
  "photo",
  "pubmed_name",
  "orcid",
  "scholar",
  "linkedin",
  "website",
  "github",
  "display_order",
  "mission_subtitle",
  "mission_blurb",
  "alternate_names",
  "previous_tier",
];

export function parseMember(raw: string): {
  frontmatter: MemberFrontmatter;
  bio: string;
} {
  const { data, content } = matter(raw);
  return {
    frontmatter: data as MemberFrontmatter,
    bio: content.trim(),
  };
}

export function serializeMember(bio: string, fields: MemberFrontmatter): string {
  // Build data in canonical key order
  const data: Record<string, unknown> = {};
  for (const key of FIELD_ORDER) {
    const v = fields[key];
    // Explicitly omit null/undefined/"" — but preserve 0, false, and other falsy non-empties
    if (v !== null && v !== undefined && (typeof v !== "string" || v !== "")) {
      data[key] = v;
    }
  }
  // Always coerce display_order to integer — form inputs arrive as strings
  if (data.display_order !== undefined) {
    data.display_order = parseInt(String(data.display_order), 10) || 50;
  }
  return matter.stringify(bio.trim() || "Bio coming soon.", data);
}

export function nameToSlug(name: string): string {
  // Use slug package for proper Unicode transliteration
  // "María García-López" → "maria-garcia-lopez" (not "mara-garca-lpez")
  return slugLib(name, { lower: true, trim: true }).slice(0, 60);
}

export function validateSlug(s: string): boolean {
  return /^[a-z0-9-]+$/.test(s) && s.length > 0 && s.length <= 60;
}
