import { z } from "zod";
import { TEAM_TIERS } from "@/lib/team-constants";
import type { TeamTier } from "@/lib/team-constants";
import type { MemberFrontmatter } from "@/lib/staff/types";

// Cast for z.enum — preserves literal union type
const TIERS_TUPLE = TEAM_TIERS as readonly [TeamTier, ...TeamTier[]];

export const MemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(200).regex(/^[^\n\r]+$/, "No newlines allowed"),
  role: z.string().min(1, "Role is required").max(300).regex(/^[^\n\r]+$/, "No newlines allowed"),
  tier: z.enum(TIERS_TUPLE),
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

// Compile-time check: every required key in MemberFrontmatter (except previous_tier)
// must also exist in the Zod schema. Catches forgotten fields at build time.
type ZodKeys = keyof Omit<MemberInput, "bio">;
type FrontmatterKeys = keyof Omit<MemberFrontmatter, "previous_tier">;
type _MissingFromZod = Exclude<FrontmatterKeys, ZodKeys>;
type _MissingFromInterface = Exclude<ZodKeys, FrontmatterKeys>;
// These will be 'never' if both sides have the same keys — if not, you get a compile error:
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _zodKeyCheck: _MissingFromZod extends never ? true : _MissingFromZod = true;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ifaceKeyCheck: _MissingFromInterface extends never ? true : _MissingFromInterface = true;
