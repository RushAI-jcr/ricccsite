import type { TeamTier } from "@/lib/team";

// MDX frontmatter shape — snake_case, matches content/team/*.mdx files exactly
export interface MemberFrontmatter {
  name: string;
  role: string;
  tier: TeamTier;
  email: string;
  photo?: string;
  pubmed_name?: string;
  display_order?: number;
  linkedin?: string;
  orcid?: string;
  scholar?: string;
  website?: string;
  github?: string;
  // Stored on archive, removed on restore — not rendered by public site
  previous_tier?: TeamTier;
}

// GitHub Contents API file result (decoded)
export interface GitHubFileResult {
  content: string; // decoded UTF-8, NOT base64
  sha: string;
}

// Entry from a directory listing
export interface TeamFileEntry {
  slug: string; // filename without .mdx
  path: string; // "content/team/foo.mdx"
  sha: string;  // blob SHA
}

// Consistent API error envelope used across all /api/staff/* routes
export interface ApiError {
  error: string;   // machine-readable: "forbidden", "not_found", "conflict", "validation_error"
  message: string; // human-readable
  field?: string;  // which input field caused the error (validation only)
}
