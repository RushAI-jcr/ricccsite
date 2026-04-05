import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { requireAdmin } from "@/lib/staff/auth";
import { checkOrigin } from "@/lib/staff/csrf";
import { auditLog } from "@/lib/staff/audit";
import { processPhoto } from "@/lib/staff/photo";
import { upsertBinaryFile, getFileSha } from "@/lib/staff/github";
import { validateSlug } from "@/lib/staff/mdx-staff";

// Required — sharp uses Node.js native binaries; Edge runtime cannot load them
export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BYTES = 4.5 * 1024 * 1024; // Vercel hard limit

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const csrfError = checkOrigin(req);
  if (csrfError) return csrfError;

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  // Reject oversized requests before buffering
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BYTES) {
    return NextResponse.json(
      { error: "file_too_large", message: "Photo must be under 4.5 MB" },
      { status: 413 }
    );
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "validation_error", message: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("photo") as File | null;
  const slugRaw = formData.get("slug") as string | null;

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "validation_error", message: "Missing photo field" }, { status: 400 });
  }

  // Server-side size check after buffering (content-length can be spoofed)
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "file_too_large", message: "Photo must be under 4.5 MB" },
      { status: 413 }
    );
  }

  // Slug is required — it determines the output filename
  const slug = slugRaw ? String(slugRaw).trim() : null;
  if (!slug || !validateSlug(slug)) {
    return NextResponse.json(
      { error: "validation_error", message: "Valid slug is required for photo upload" },
      { status: 400 }
    );
  }

  try {
    const processed = await processPhoto(file);
    const photoPath = `public/images/team/${slug}.jpg`;

    // Check if file already exists (get SHA for update, undefined for create)
    const existingSha = await getFileSha(photoPath) ?? undefined;

    await upsertBinaryFile(photoPath, processed, `admin: upload photo for ${slug}`, existingSha);

    const publicUrl = `/images/team/${slug}.jpg`;
    auditLog("upload", ip, slug, { size: processed.length });

    return NextResponse.json({ data: { url: publicUrl } });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unsupported image type") {
      return NextResponse.json(
        { error: "invalid_file_type", message: "Unsupported image type. Upload JPEG, PNG, or WebP." },
        { status: 415 }
      );
    }
    console.error("[staff] upload error:", err);
    return NextResponse.json({ error: "server_error", message: "Upload failed" }, { status: 500 });
  }
}
