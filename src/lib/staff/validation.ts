import { z } from "zod";
import type { TeamTier } from "@/lib/team";

const TIERS = ["pi", "staff", "student", "alumni", "collaborator"] as const satisfies readonly [
  TeamTier,
  ...TeamTier[],
];

export const MemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(200).regex(/^[^\n\r]+$/, "No newlines allowed"),
  role: z.string().min(1, "Role is required").max(300).regex(/^[^\n\r]+$/, "No newlines allowed"),
  tier: z.enum(TIERS),
  email: z.string().email("Invalid email").max(254),
  photo: z.string().max(300).optional().or(z.literal("")),
  pubmed_name: z.string().max(100).optional().or(z.literal("")),
  display_order: z.coerce.number().int().min(0).max(999).default(50),
  linkedin: z.string().url("Must be a URL").startsWith("https://").optional().or(z.literal("")),
  orcid: z
    .string()
    .regex(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/, "Invalid ORCID format")
    .optional()
    .or(z.literal("")),
  scholar: z.string().url("Must be a URL").startsWith("https://").optional().or(z.literal("")),
  website: z.string().url("Must be a URL").startsWith("https://").optional().or(z.literal("")),
  github: z.string().url("Must be a URL").startsWith("https://").optional().or(z.literal("")),
  bio: z.string().max(5000).optional().default(""),
});

export type MemberInput = z.infer<typeof MemberSchema>;
