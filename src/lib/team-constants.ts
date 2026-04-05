// Client-safe team constants — no Node.js imports (fs, path, gray-matter)
// Used by both server-side team.ts and client-side admin components

export type TeamTier = "pi" | "staff" | "student" | "alumni" | "collaborator";

// Canonical tier list — single source of truth for forms, validation, and display
export const TEAM_TIERS: readonly TeamTier[] = ["pi", "staff", "student", "alumni", "collaborator"] as const;

// Display order for admin UI — alumni last
export const TIER_DISPLAY_ORDER: readonly TeamTier[] = ["pi", "staff", "student", "collaborator", "alumni"] as const;

export const TIER_LABELS: Record<TeamTier, string> = {
  pi: "Principal Investigators",
  staff: "Staff",
  student: "Students & Trainees",
  collaborator: "Collaborators",
  alumni: "Alumni",
};
