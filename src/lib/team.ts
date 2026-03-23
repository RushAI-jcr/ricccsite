import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type TeamTier = "pi" | "staff" | "student" | "alumni" | "collaborator";

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  tier: TeamTier;
  email: string;
  bio: string;
  photo?: string;
  pubmedName?: string;
  orcid?: string;
  scholar?: string;
  website?: string;
  github?: string;
  displayOrder: number;
}

const tierOrder: Record<TeamTier, number> = {
  pi: 0,
  staff: 1,
  student: 2,
  alumni: 3,
  collaborator: 4,
};

const validTiers = new Set<string>(["pi", "staff", "student", "alumni", "collaborator"]);

export function getAllTeamMembers(): TeamMember[] {
  const teamDir = path.join(process.cwd(), "content/team");

  if (!fs.existsSync(teamDir)) return [];

  const files = fs.readdirSync(teamDir).filter((f) => f.endsWith(".mdx"));

  const members = files.map((file) => {
    const raw = fs.readFileSync(path.join(teamDir, file), "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.mdx$/, "");
    const tier = validTiers.has(data.tier) ? (data.tier as TeamTier) : "student";

    return {
      slug,
      name: data.name ?? slug,
      role: data.role ?? "",
      tier,
      email: data.email ?? "",
      bio: content.trim(),
      photo: data.photo || undefined,
      pubmedName: data.pubmed_name || undefined,
      orcid: data.orcid || undefined,
      scholar: data.scholar || undefined,
      website: data.website || undefined,
      github: data.github || undefined,
      displayOrder: data.display_order ?? 50,
    };
  });

  return members
    .filter((m) => m.name !== "TBD")
    .sort((a, b) => {
      const tierDiff = tierOrder[a.tier] - tierOrder[b.tier];
      if (tierDiff !== 0) return tierDiff;
      return a.displayOrder - b.displayOrder;
    });
}

export function getTeamMembersByTier(): Record<TeamTier, TeamMember[]> {
  const members = getAllTeamMembers();
  const grouped: Record<TeamTier, TeamMember[]> = {
    pi: [],
    staff: [],
    student: [],
    alumni: [],
    collaborator: [],
  };

  for (const member of members) {
    grouped[member.tier].push(member);
  }

  return grouped;
}

