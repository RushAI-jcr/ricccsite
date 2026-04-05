import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/staff/auth";
import { listTeamFiles } from "@/lib/staff/github";
import { validateSlug } from "@/lib/staff/mdx-staff";

type RouteContext = { params: Promise<{ slug: string }> };

// GET /api/staff/members/[slug]/exists — side-effect-free slug uniqueness check
// Useful for both the create form and agent use cases
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { slug } = await params;
  if (!validateSlug(slug)) {
    return NextResponse.json({ exists: false, valid: false });
  }

  const files = await listTeamFiles();
  const exists = files.some((f) => f.slug === slug);

  return NextResponse.json({ exists, valid: true });
}
