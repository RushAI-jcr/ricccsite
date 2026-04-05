import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/staff/auth";
import { checkOrigin } from "@/lib/staff/csrf";
import { auditLog } from "@/lib/staff/audit";
import { getClientIp } from "@/lib/staff/request";
import { listTeamFiles, getFile, upsertFile, RequestError } from "@/lib/staff/github";
import { serializeMember, parseMember, nameToSlug, validateSlug } from "@/lib/staff/mdx-staff";
import { MemberSchema } from "@/lib/staff/validation";
import type { MemberFrontmatter } from "@/lib/staff/types";

// GET /api/staff/members — list all team members, with optional inline frontmatter
export async function GET(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const files = await listTeamFiles();

  // ?detail=true returns frontmatter inline (eliminates N+1 client fetches)
  const url = new URL(req.url);
  if (url.searchParams.get("detail") === "true") {
    const members = await Promise.all(
      files.map(async (f) => {
        try {
          const { content } = await getFile(f.path);
          const { frontmatter } = parseMember(content);
          return { slug: f.slug, ...frontmatter };
        } catch {
          return { slug: f.slug, name: f.slug, role: "", tier: "staff" as const };
        }
      })
    );
    return NextResponse.json({ data: members });
  }

  return NextResponse.json({ data: files });
}

// POST /api/staff/members — create a new team member
export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const csrfError = checkOrigin(req);
  if (csrfError) return csrfError;

  const ip = await getClientIp();

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "validation_error", message: "Invalid JSON" }, { status: 400 });
  }

  const parsed = MemberSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: "validation_error", message: first.message, field: String(first.path[0] ?? "") },
      { status: 400 }
    );
  }

  const { bio, ...fields } = parsed.data;
  const slug = body.slug ? String(body.slug) : nameToSlug(fields.name);

  if (!validateSlug(slug)) {
    return NextResponse.json(
      { error: "validation_error", message: "Cannot derive a valid slug from this name", field: "name" },
      { status: 400 }
    );
  }

  try {
    const files = await listTeamFiles();
    if (files.some((f) => f.slug === slug)) {
      return NextResponse.json(
        { error: "conflict", message: `A member with slug "${slug}" already exists` },
        { status: 409 }
      );
    }

    const frontmatter: MemberFrontmatter = { ...fields } as MemberFrontmatter;
    const mdxContent = serializeMember(bio ?? "", frontmatter);

    await upsertFile(`content/team/${slug}.mdx`, mdxContent, `admin: create ${slug}`);

    revalidatePath("/team");
    auditLog("create", ip, slug);

    return NextResponse.json({ data: { slug } }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof RequestError && err.status === 409) {
      return NextResponse.json(
        { error: "conflict", message: `A member with slug "${slug}" already exists` },
        { status: 409 }
      );
    }
    console.error("[staff] POST member error:", err);
    return NextResponse.json({ error: "server_error", message: "Create failed" }, { status: 500 });
  }
}
