import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import matter from "gray-matter";
import { requireAdmin } from "@/lib/staff/auth";
import { checkOrigin } from "@/lib/staff/csrf";
import { auditLog } from "@/lib/staff/audit";
import { getFile, upsertFile } from "@/lib/staff/github";
import { parseMember, serializeMember, validateSlug } from "@/lib/staff/mdx-staff";
import { MemberSchema } from "@/lib/staff/validation";
import type { MemberFrontmatter } from "@/lib/staff/types";
import type { TeamTier } from "@/lib/team";

type RouteContext = { params: Promise<{ slug: string }> };

// GET /api/staff/members/[slug] — read one member
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { slug } = await params;
  if (!validateSlug(slug)) {
    return NextResponse.json({ error: "not_found", message: "Invalid slug" }, { status: 404 });
  }

  try {
    const { content, sha } = await getFile(`content/team/${slug}.mdx`);
    const { frontmatter, bio } = parseMember(content);
    return NextResponse.json({ data: { slug, frontmatter, bio, sha } });
  } catch (err: unknown) {
    // @ts-expect-error -- Octokit error shape
    if (err?.status === 404) {
      return NextResponse.json({ error: "not_found", message: "Member not found" }, { status: 404 });
    }
    console.error("[staff] GET member error:", err);
    return NextResponse.json({ error: "server_error", message: "Internal error" }, { status: 500 });
  }
}

// PUT /api/staff/members/[slug] — update one member
export async function PUT(req: NextRequest, { params }: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const csrfError = checkOrigin(req);
  if (csrfError) return csrfError;

  const { slug } = await params;
  if (!validateSlug(slug)) {
    return NextResponse.json({ error: "not_found", message: "Invalid slug" }, { status: 404 });
  }

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

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

  try {
    // Fetch current file + SHA inside handler (never from form)
    const { content: current, sha } = await getFile(`content/team/${slug}.mdx`);
    const { frontmatter: existing } = parseMember(current);

    // Merge — preserve previous_tier if present, keep tier from new data
    const frontmatter: MemberFrontmatter = {
      ...existing,
      ...fields,
    } as MemberFrontmatter;

    const mdxContent = serializeMember(bio ?? "", frontmatter);
    await upsertFile(`content/team/${slug}.mdx`, mdxContent, `admin: update ${slug}`, sha);

    revalidatePath("/team");
    auditLog("update", ip, slug);

    return NextResponse.json({ data: { slug, revalidated: true } });
  } catch (err: unknown) {
    // @ts-expect-error -- Octokit error shape
    if (err?.status === 409 || err?.status === 422) {
      return NextResponse.json(
        { error: "conflict", message: "Another edit was saved while you were working. Reload and try again." },
        { status: 409 }
      );
    }
    // @ts-expect-error -- Octokit error shape
    if (err?.status === 404) {
      return NextResponse.json({ error: "not_found", message: "Member not found" }, { status: 404 });
    }
    console.error("[staff] PUT member error:", err);
    return NextResponse.json({ error: "server_error", message: "Internal error" }, { status: 500 });
  }
}

// PATCH /api/staff/members/[slug] — archive ({ tier: "alumni" }) or restore ({ tier: "<original>" })
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const csrfError = checkOrigin(req);
  if (csrfError) return csrfError;

  const { slug } = await params;
  if (!validateSlug(slug)) {
    return NextResponse.json({ error: "not_found", message: "Invalid slug" }, { status: 404 });
  }

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  const body = await req.json().catch(() => null);
  const action = body?.action as "archive" | "restore" | undefined;

  if (action !== "archive" && action !== "restore") {
    return NextResponse.json(
      { error: "validation_error", message: "action must be 'archive' or 'restore'" },
      { status: 400 }
    );
  }

  try {
    const { content, sha } = await getFile(`content/team/${slug}.mdx`);
    const { data } = matter(content);

    let updatedData: MemberFrontmatter;

    if (action === "archive") {
      updatedData = {
        ...data,
        previous_tier: data.tier as TeamTier, // preserve for restore
        tier: "alumni",
      } as MemberFrontmatter;
    } else {
      // restore — use stored previous_tier, fall back to "staff"
      const restoredTier = (data.previous_tier as TeamTier) ?? "staff";
      const { previous_tier: _removed, ...rest } = data;
      void _removed;
      updatedData = { ...rest, tier: restoredTier } as MemberFrontmatter;
    }

    // Re-parse bio from current content
    const { bio } = parseMember(content);
    const mdxContent = serializeMember(bio, updatedData);
    await upsertFile(`content/team/${slug}.mdx`, mdxContent, `admin: ${action} ${slug}`, sha);

    revalidatePath("/team");
    auditLog(action === "archive" ? "archive" : "restore", ip, slug);

    return NextResponse.json({ data: { slug, action, revalidated: true } });
  } catch (err: unknown) {
    // @ts-expect-error -- Octokit error shape
    if (err?.status === 409 || err?.status === 422) {
      return NextResponse.json(
        { error: "conflict", message: "File was modified externally. Reload and try again." },
        { status: 409 }
      );
    }
    console.error("[staff] PATCH member error:", err);
    return NextResponse.json({ error: "server_error", message: "Internal error" }, { status: 500 });
  }
}
