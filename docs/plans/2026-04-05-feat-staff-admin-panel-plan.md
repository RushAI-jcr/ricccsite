---
title: "feat: Staff Admin Panel — Team Member Management"
type: feat
date: 2026-04-05
brainstorm: docs/brainstorms/2026-04-05-staff-admin-panel-brainstorm.md
deepened: 2026-04-05
---

# feat: Staff Admin Panel — Team Member Management

## Enhancement Summary

**Deepened on:** 2026-04-05
**Research agents used:** security-sentinel, performance-oracle, architecture-strategist, kieran-typescript-reviewer, julik-frontend-races-reviewer, code-simplicity-reviewer, agent-native-reviewer, best-practices-researcher, framework-docs-researcher, data-integrity-guardian, pattern-recognition-specialist

### Key Improvements
1. **Root layout blocker identified**: `src/app/layout.tsx` unconditionally injects `<Header>` and `<Footer>`. A `(public)` route group must be created _before_ Phase 1 or every admin page will render public nav. This gates all other work.
2. **Session token is not "1"**: The planned `admin_session=1` cookie is trivially forgeable. Replace with an HMAC-signed token plus a `SESSION_SECRET` env var; use `iron-session` for cookie management.
3. **Naming inconsistency**: Route lives at `/staff/`, but `api/admin/` and `lib/admin/` conflict with the existing Sveltia CMS `/admin/` namespace. Rename all to `staff`.
4. **5 files eliminated**: Separate `archive/restore` routes, `AdminError.tsx`, and `ConfirmDialog.tsx` are YAGNI — collapse to PATCH + inline patterns.
5. **3 data-integrity bugs**: `null/undefined` fields silently deleted by js-yaml on save; archive/restore loses original tier (PI restored as `staff`); photo field not pre-populated in edit form.
6. **Frontend races**: 8 async state bugs in `PhotoUpload`, `MemberForm`, and `MemberList` require generation counters, `isSaving` flags, and `isDirtyRef` pattern.

### New Considerations Discovered
- Vercel body size limit is **4.5 MB on all plans** — not configurable. Image uploads of typical portrait photos (< 2 MB) fit fine.
- `getContent` response `data.content` has embedded `\n` chars — must strip before `Buffer.from()`.
- `@types/sharp` is deprecated; types are bundled in `sharp` since v0.32.0.
- `@octokit/plugin-throttling` retry behavior causes Vercel function timeout on hobby tier (10s) — remove.
- `revalidatePath("/team")` must be called after every mutation or the public site stays stale.
- `previous_tier` must be stored in frontmatter on archive or restore loses the member's original role.
- Next.js is **16.2.1** (not 15) and sharp is **0.34.5** in this project.

---

## Overview

A lightweight `/staff/` admin panel built in Next.js 16 App Router. Non-technical staff (no GitHub account) log in with a shared passphrase and get a full CRUD UI to manage team member profiles — photos, bios, contact info, and social links. All edits commit to the GitHub repo via a bot PAT; Vercel redeploys automatically (~1 min to live).

This is **not** a replacement for Sveltia CMS (which remains at `/admin/` for developer use). It is a parallel, staff-facing interface over the same `content/team/*.mdx` files.

---

## Problem Statement

5+ non-technical lab staff need to maintain team profiles (headshots, bios, contact info) without GitHub accounts or CMS onboarding. The existing Sveltia CMS requires GitHub OAuth — a hard barrier for this group.

---

## Architecture

```
src/
  app/
    (public)/                           → NEW route group — moves Header/Footer out of root layout
      layout.tsx                        → public nav/footer (moved from root)
      page.tsx, team/, research/, ...   → all existing public pages
    staff/
      page.tsx                          → redirect: no session → /staff/login, session → /staff/members
      layout.tsx                        → admin shell (Rush brand, no public nav/footer, logout button)
      login/
        page.tsx                        → passphrase form
      members/
        page.tsx                        → member list grouped by tier
        new/
          page.tsx                      → create member form
        [slug]/
          edit/
            page.tsx                    → edit member form
  api/
    staff/                              → renamed from api/admin/ (avoids Sveltia /admin/ collision)
      login/route.ts                    → POST: verify passphrase, set session cookie
      logout/route.ts                   → POST: clear session cookie
      members/route.ts                  → GET: list all; POST: create new member
      members/[slug]/route.ts           → GET: read one; PUT: update one; PATCH: set tier (archive/restore)
      members/[slug]/exists/route.ts    → GET: slug existence check (agent-friendly)
      upload/route.ts                   → POST: multipart photo → sharp → GitHub commit
  components/
    staff/                              → renamed from components/admin/
      LoginForm.tsx
      MemberList.tsx                    → grouped list with tier headers
      MemberForm.tsx                    → shared create/edit form (discriminated union props)
      PhotoUpload.tsx                   → file input + preview (no drag-drop in v1)
  lib/
    staff/                              → renamed from lib/admin/
      types.ts                          → NEW: MemberFrontmatter, GitHubFileResult, TeamFileEntry, ApiError
      github.ts                         → Octokit singleton; getFile, upsertFile, upsertBinaryFile, listTeamFiles
      mdx-staff.ts                      → parseMember, serializeMember (gray-matter round-trip + slug logic)
      auth.ts                           → verifyPassphrase, getSession (iron-session)
      rate-limit.ts                     → in-memory per-IP rate limiter (login route only)
      photo.ts                          → processPhoto() → sharp resize → Buffer
middleware.ts                           → protect /staff/* and /api/staff/* except /staff/login
```

### Research Insights

**Route group is a Phase 0 blocker.** `src/app/layout.tsx` unconditionally renders `<Header>` and `<Footer>`. Without a `(public)` route group, every admin page inherits public chrome. CSS overrides to hide it are an anti-pattern that leaves dead markup in the DOM and breaks accessibility. Create the route group before writing any staff page.

**Naming: all `staff`, no `admin`.** `/admin/` is already claimed by Sveltia CMS (`public/admin/config.yml`). The existing `header.tsx` already guards `pathname?.startsWith("/admin")`. Using `api/staff/` and `lib/staff/` throughout prevents namespace collision and follows the codebase convention (all files in a feature share one noun, like `team.ts` / `components/team/`).

**Collapsed routes.** `archive/route.ts` and `restore/route.ts` are replaced by `PATCH /api/staff/members/[slug]` with `{ tier: "alumni" }` / `{ tier: "staff" }` body. Both operations are a single field write on the same MDX file — two dedicated route files for a boolean-flip is over-engineering.

---

## Technical Approach

### Auth

- `ADMIN_PASSPHRASE` env var — compared timing-safely using `crypto.timingSafeEqual` (hash both to same length first)
- `SESSION_SECRET` env var — 32+ random bytes (hex); used to HMAC-sign session tokens
- **Use `iron-session` v8+** — handles cookie serialization, `httpOnly`, `secure`, and `maxAge` correctly with Next.js 16's `await cookies()` requirement
- Session cookie: `sameSite: "strict"`, `path: "/staff"` (scoped, not site-wide), 8-hour maxAge
- Middleware reads `req.cookies.get("admin_session")` (synchronous `NextRequest` cookies — NOT `await cookies()`)
- All API routes: `await getIronSession(await cookies(), sessionOptions)`
- Rate limiting: in-memory map `{ip: {count, resetAt}}`; 5 attempts / 15 min; 429 response on exceed (acceptable for login-only endpoint; in-memory is sufficient at this scale — document the per-instance reset behavior)

### Research Insights — Auth

**Session token must be cryptographically signed** (not the literal value `"1"`). A forgeable cookie gives anyone who intercepts or guesses it full admin access. Use `iron-session` which seals the session data with `SESSION_SECRET` using iron/AES:

```ts
// src/lib/staff/auth.ts
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const sessionOptions = {
  password: process.env.SESSION_SECRET!,  // 32+ char random string
  cookieName: "riccc_admin_session",
  ttl: 60 * 60 * 8,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/staff",  // scoped — not sent to public routes
  },
};

export async function requireAdmin() {
  const session = await getIronSession<{ authenticated: boolean }>(
    await cookies(),
    sessionOptions
  );
  if (!session.authenticated) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  return null;
}
```

**Passphrase comparison** (unchanged from plan, confirmed correct):
```ts
const bufA = createHash("sha256").update(passphrase).digest();
const bufB = createHash("sha256").update(process.env.ADMIN_PASSPHRASE!).digest();
return timingSafeEqual(bufA, bufB);
```

**Rate limiting** — in-memory Map is acceptable for the login endpoint only (not for public-facing forms). Vercel serverless instances each maintain their own counter, so the limit resets on cold starts — document this rather than routing around it with Redis:

```ts
// src/lib/staff/rate-limit.ts
const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, max = 5, windowMs = 15 * 60_000): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}
```

Get the client IP from Next.js 16 `headers()`:
```ts
const ip = (await headers()).get("x-forwarded-for")?.split(",")[0] ?? "unknown";
```

### GitHub Integration

- `@octokit/rest` only — **remove `@octokit/plugin-throttling` and `@octokit/plugin-retry`** (throttling plugin queues retries with exponential backoff up to 60s; Vercel hobby functions time out at 10s; retry causes function kill mid-write)
- Octokit instantiated as a **module-level singleton** (not per-request) — reused across warm Lambda invocations
- Repo coordinates hardcoded as constants (not env vars — this is a single-repo internal tool)
- All GitHub API calls **server-side only** (CSP has `connect-src 'self'`)
- Committer: `{ name: "RICCC Admin Bot", email: "info@riccc-lab.com" }`
- Call `revalidatePath("/team")` in every mutating route handler after successful GitHub write

**Read pattern (with `\n` stripping — required):**
```ts
// lib/staff/github.ts
const OWNER = "riccc-rush-lab";  // hardcoded constants, not env vars
const REPO  = "ricccsite";

const octokit = new Octokit({ auth: process.env.GITHUB_BOT_TOKEN });

export async function getFile(path: string): Promise<GitHubFileResult> {
  const { data } = await octokit.rest.repos.getContent({ owner: OWNER, repo: REPO, path });
  // Guard: getContent returns an array for directories
  if (Array.isArray(data) || data.type !== "file") {
    throw new Error(`Not a file: ${path}`);
  }
  // REQUIRED: data.content contains embedded \n chars — strip before decoding
  const content = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8");
  return { content, sha: data.sha };
}
```

**Write pattern (SHA fetched inside handler):**
```ts
// In PATCH /api/staff/members/[slug]/route.ts
const { content: current, sha } = await getFile(`content/team/${slug}.mdx`);
// ... apply changes ...
await upsertFile(`content/team/${slug}.mdx`, newContent, `admin: update ${slug}`, sha);
revalidatePath("/team");
// If GitHub returns 409: respond with HTTP 409, message: "Another edit was saved. Reload and try again."
```

**Cache revalidation** — must be called after every successful write or the public site stays stale:
```ts
import { revalidatePath } from "next/cache";
// After any successful GitHub commit:
revalidatePath("/team");
```

### MDX Round-trip

`gray-matter` is already installed. **Critical rules for serialize:**

```ts
// lib/staff/mdx-staff.ts
import matter from "gray-matter";
import type { MemberFrontmatter } from "./types";

const FIELD_ORDER: (keyof MemberFrontmatter)[] = [
  "name", "role", "tier", "email", "photo",
  "pubmed_name", "orcid", "scholar", "linkedin", "website", "github",
  "display_order",
];

export function serializeMember(bio: string, fields: MemberFrontmatter): string {
  // 1. Build data in canonical key order (prevents noisy git diffs)
  const data: Partial<MemberFrontmatter> = {};
  for (const key of FIELD_ORDER) {
    const v = fields[key];
    // Explicitly omit null/undefined/"" — but preserve 0 and false
    if (v !== null && v !== undefined && (typeof v !== "string" || v !== "")) {
      (data as Record<string, unknown>)[key] = v;
    }
  }
  // 2. Coerce display_order to integer (never allow string from form input)
  if (data.display_order !== undefined) {
    data.display_order = parseInt(String(data.display_order), 10) || 50;
  }
  return matter.stringify(bio.trim() || "Bio coming soon.", data);
}
```

**Note on field omission behavior:** js-yaml's `safeDump` silently drops `null`/`undefined` values. An optional field (e.g., `orcid`) that was previously set but is now `undefined` in the data object will be **deleted from the file**. The explicit omit loop above makes this intentional rather than accidental.

### Research Insights — MDX

**`matter.stringify(content, data)` — argument order is content-first.** (Confirmed: first arg is the content string, second is the frontmatter data object.)

**Snake_case keys are preserved as-is.** gray-matter passes frontmatter keys through without camelCase conversion. Write `pubmed_name`, `display_order` — they come back exactly as written.

**gray-matter round-trip does NOT preserve key order.** js-yaml's `safeDump` iterates `Object.keys()`. Use the explicit `FIELD_ORDER` array above to build the data object, ensuring consistent ordering across all saves (reduces diff noise in git history).

### Photo Pipeline

```ts
// lib/staff/photo.ts  (server-side only)
import sharp from "sharp";

// Validate magic bytes BEFORE passing to sharp (never trust Content-Type header)
const MAGIC: Record<string, number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png":  [0x89, 0x50, 0x4e, 0x47],
  "image/webp": [0x52, 0x49, 0x46, 0x46],
};

export function sniffMimeType(buf: Buffer): string | null {
  for (const [mime, magic] of Object.entries(MAGIC)) {
    if (magic.every((b, i) => buf[i] === b)) return mime;
  }
  return null;
}

export async function processPhoto(file: File): Promise<Buffer> {
  const buf = Buffer.from(await file.arrayBuffer());
  const mime = sniffMimeType(buf);
  if (!mime) throw new Error("Invalid file type");
  return sharp(buf)
    .resize(400, 400, { fit: "cover", position: "attention" })
    .jpeg({ quality: 80, failOnError: true })
    .toBuffer();
}
```

**Upload route must declare Node.js runtime** (Edge runtime cannot use sharp):
```ts
export const runtime = "nodejs";  // required — sharp uses Node.js native binaries
```

**Vercel body limit: 4.5 MB on all plans.** This is the hard limit for serverless functions across Hobby and Pro. Typical portrait photos (500 KB–2 MB) fit well within this. Add a client-side 4 MB warning and a server-side 4.5 MB rejection:

```ts
// In upload route, before formData():
const contentLength = request.headers.get("content-length");
if (contentLength && parseInt(contentLength, 10) > 4.5 * 1024 * 1024) {
  return NextResponse.json({ error: "File too large (max 4.5 MB)" }, { status: 413 });
}
```

**Install sharp linux binary for Vercel:**
```bash
npm install --os=linux --cpu=x64 --libc=glibc sharp
```
Or add to `package.json`:
```json
"optionalDependencies": { "@img/sharp-linux-x64": "^0.34.5" }
```

Photo path convention: `public/images/team/{slug}.jpg` → frontmatter value `/images/team/{slug}.jpg`

Photo upload is a **separate pre-commit** before the form save. The upload route returns the path; the form stores it. On form save the MDX references the already-committed photo.

### Research Insights — Photo

**`position: "attention"` is valid in sharp 0.34.5** (the version installed). It uses libvips saliency-based smart crop — the correct choice for portrait photos. Alternatives: `"entropy"` (faster, contrast-based), `"center"` (no smart crop).

**Processing time** for a 4 MB input at 400×400 with `attention` positioning: ~300–800ms on Vercel Lambda (dominated by saliency computation). This is acceptable for infrequent uploads.

**`@types/sharp` is deprecated** — types are bundled in `sharp` itself since v0.32.0. Do not install `@types/sharp`.

### Slugify

```ts
// lib/staff/mdx-staff.ts (inline — not a separate file)
import slug from "slug";  // proper Unicode transliteration library

export function nameToSlug(name: string): string {
  // Use 'slug' package for proper Unicode transliteration
  // "María García-López" → "maria-garcia-lopez" (not "mara-garca-lpez")
  return slug(name, { lower: true }).slice(0, 60);
}

export function validateSlug(s: string): boolean {
  return /^[a-z0-9-]+$/.test(s) && s.length > 0 && s.length <= 60;
}
```

**Slug is immutable after creation.** The edit form shows slug as read-only. Changing a member's display name does not change the filename.

### Research Insights — Slugify

**Unicode stripping causes silent data loss.** A simple `replace(/[^a-z0-9\s-]/g, "")` strips accented characters — `"María"` becomes `"mara"`. If two names collide after stripping, the second member's MDX file silently overwrites the first. Use the `slug` npm package which transliterates Unicode to ASCII correctly.

**Empty slug guard.** If after transliteration the slug is empty (e.g., name was all special characters), return HTTP 400 before any GitHub write:
```ts
const derivedSlug = nameToSlug(body.name);
if (!validateSlug(derivedSlug)) {
  return NextResponse.json({ error: "Cannot derive a valid slug from this name" }, { status: 400 });
}
```

### Conflict Handling

SHA is fetched within the same PUT handler invocation — never stored in a hidden form field. If GitHub returns 409 (SHA mismatch), the API responds with HTTP 409 and message: "Another edit was saved while you were working. Reload the form and re-apply your changes." The UI shows this as a non-dismissable error banner.

### Archive / Restore

**Archive** — `PATCH /api/staff/members/[slug]` with body `{ tier: "alumni", previous_tier: currentTier }`:
```ts
// Preserve the original tier before archiving
const { content, sha } = await getFile(`content/team/${slug}.mdx`);
const { data, body } = matter(content);
const previous_tier = data.tier;  // save original
const updated = serializeMember(body, { ...data, tier: "alumni", previous_tier });
await upsertFile(`content/team/${slug}.mdx`, updated, `admin: archive ${slug}`, sha);
```

**Restore** — reads `previous_tier` from frontmatter and restores to it (then removes `previous_tier`):
```ts
const restoredTier = data.previous_tier ?? "staff";  // fall back to "staff" if not stored
const { previous_tier: _, ...rest } = data;  // remove previous_tier from fields
const updated = serializeMember(body, { ...rest, tier: restoredTier });
```

### Research Insights — Archive/Restore

**Tier preservation is critical.** Without storing `previous_tier`, a PI archived and later restored comes back as `staff`, breaking the PI bio section and co-director display. The `previous_tier` frontmatter field is invisible to the public site (it is not read by `src/lib/team.ts`) and is a safe approach.

### Session Expiry on Active Forms

Any API route returning 401/403 → UI redirects to `/staff/login?returnTo=<current-path>`. After login, redirect back to `returnTo`. No localStorage draft persistence in v1.

### Admin-facing CRUD API Response Contract

All routes return a consistent envelope to support both browser UI and agent use:

```ts
// lib/staff/types.ts
export interface ApiError {
  error: string;   // machine-readable code: "forbidden", "not_found", "conflict", "validation_error"
  message: string; // human-readable
  field?: string;  // which field failed validation, if applicable
}

export interface ApiSuccess<T> {
  data: T;
  revalidated: boolean;
}
```

---

## TypeScript Types

### Research Insights — Type Definitions

**All shared types in `src/lib/staff/types.ts`:**

```ts
// src/lib/staff/types.ts
import type { TeamTier } from "@/lib/team";  // reuse existing type — do not duplicate

export interface MemberFrontmatter {
  name: string;
  role: string;
  tier: TeamTier;        // reuses existing union type
  email: string;
  photo?: string;
  pubmed_name?: string;
  display_order?: number;
  linkedin?: string;
  orcid?: string;
  scholar?: string;
  website?: string;
  github?: string;
  previous_tier?: TeamTier;  // set on archive, removed on restore
}

export interface GitHubFileResult {
  content: string;  // decoded UTF-8, NOT base64
  sha: string;
}

export type TeamFileEntry = {
  slug: string;  // filename without .mdx
  path: string;  // "content/team/foo.mdx"
  sha: string;   // blob SHA — needed for updates
};

export interface ApiError {
  error: string;
  message: string;
  field?: string;
}
```

**Next.js 16 route handler params** (params is now async):
```ts
type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
  if (!validateSlug(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  // ...
}
```

**Octokit `getContent` narrowing** (critical — `data` is a union of file/directory/symlink/submodule):
```ts
const { data } = await octokit.rest.repos.getContent({ owner: OWNER, repo: REPO, path });
if (Array.isArray(data) || data.type !== "file") {
  throw new Error(`Not a file: ${path}`);
}
// After narrowing: data.content and data.sha are both string
const content = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8");
```

---

## Frontend Race Condition Patterns

### Research Insights — Async State

All components must guard against these races:

**1. Concurrent photo upload (generation counter):**
```ts
const uploadGenRef = useRef(0);

async function handleUpload(file: File) {
  uploadGenRef.current += 1;
  const myGen = uploadGenRef.current;
  setUploadState("uploading");
  try {
    const path = await postFile(file);
    if (myGen !== uploadGenRef.current) return;  // superseded upload — discard
    setPhotoPath(path);
    setUploadState("done");
  } catch {
    if (myGen !== uploadGenRef.current) return;
    setUploadState("error");
  }
}
```

**2. Save disabled during upload:**
```ts
const canSave = uploadState !== "uploading";
// Hard guard in handleSubmit:
function handleSubmit(e: FormEvent) {
  e.preventDefault();
  if (!canSave || isSaving) return;
  // ...
}
```

**3. Double-submit guard:**
```ts
const [isSaving, setIsSaving] = useState(false);
async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  if (isSaving) return;
  setIsSaving(true);
  try {
    await saveMember(formData);
    isDirtyRef.current = false;  // clear BEFORE router.push
    router.push("/staff/members");
  } catch (err) {
    handleError(err);
  } finally {
    setIsSaving(false);  // always in finally, never split across try/catch
  }
}
```

**4. `beforeunload` with dirty ref (set baseline AFTER data fetch):**
```ts
const [initialValues, setInitialValues] = useState<FormValues | null>(null);
const isDirtyRef = useRef(false);

useEffect(() => {
  fetchMember(slug).then(data => {
    setFormValues(data);
    setInitialValues(data);  // baseline set AFTER fetch, not at mount
  });
}, [slug]);

useEffect(() => {
  const handler = (e: BeforeUnloadEvent) => {
    if (!isDirtyRef.current) return;
    e.preventDefault();
    e.returnValue = "";
  };
  window.addEventListener("beforeunload", handler);
  return () => window.removeEventListener("beforeunload", handler);
}, []);  // empty deps — stable listener reads ref
```

**5. Per-member archive loading state:**
```ts
const [archivingIds, setArchivingIds] = useState<Set<string>>(new Set());

async function archiveMember(slug: string) {
  if (archivingIds.has(slug)) return;
  setArchivingIds(prev => new Set(prev).add(slug));
  try {
    await patchArchive(slug);
    await refreshList();
  } finally {
    setArchivingIds(prev => { const n = new Set(prev); n.delete(slug); return n; });
  }
}
```

---

## Security Hardening

### Research Insights — Security Headers

Add to `next.config.ts` headers for `/staff/*`:
```ts
{
  source: "/staff/:path*",
  headers: [
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
    { key: "Cache-Control", value: "no-store, no-cache, private" },
    { key: "X-Robots-Tag", value: "noindex, nofollow" },
  ],
},
```

**CSRF** — `sameSite: strict` + Origin header check is sufficient for a same-origin admin panel (no CSRF token needed). OWASP 2025 cheat sheet confirms this is a complete defense for modern browsers:
```ts
// src/lib/staff/csrf.ts
export function checkOrigin(req: Request): Response | null {
  const origin = req.headers.get("origin");
  const expected = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${req.headers.get("host")}`;
  if (!origin) return null;  // absent Origin = same-origin request, allow
  if (origin !== expected) return Response.json({ error: "forbidden" }, { status: 403 });
  return null;
}
```

**Octokit error sanitization** — never proxy raw GitHub error messages to the client:
```ts
function handleGitHubError(err: unknown): NextResponse {
  if (err instanceof RequestError) {
    if (err.status === 404) return NextResponse.json({ error: "not_found", message: "Member not found" }, { status: 404 });
    if (err.status === 409) return NextResponse.json({ error: "conflict", message: "File was modified externally. Reload and retry." }, { status: 409 });
  }
  console.error("[staff-admin] GitHub error:", err);  // server-side only
  return NextResponse.json({ error: "server_error", message: "Internal error" }, { status: 500 });
}
```

**Validation with Zod** (prevents frontmatter key injection via user-supplied strings):
```ts
import { z } from "zod";
import type { TeamTier } from "@/lib/team";

const TIERS: [TeamTier, ...TeamTier[]] = ["pi", "staff", "student", "alumni", "collaborator"];

export const MemberSchema = z.object({
  name:         z.string().min(1).max(200).regex(/^[^\n\r]+$/),
  role:         z.string().min(1).max(300).regex(/^[^\n\r]+$/),
  tier:         z.enum(TIERS),
  email:        z.string().email().max(254),
  photo:        z.string().max(300).optional(),
  pubmed_name:  z.string().max(100).optional(),
  display_order: z.coerce.number().int().min(0).max(999).default(50),
  linkedin:     z.string().url().startsWith("https://").optional(),
  orcid:        z.string().regex(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/).optional(),
  scholar:      z.string().url().startsWith("https://").optional(),
  website:      z.string().url().startsWith("https://").optional(),
  github:       z.string().url().startsWith("https://").optional(),
  bio:          z.string().max(5000).optional(),
});
```

**Audit log** — one-liner in every mutating route:
```ts
// src/lib/staff/audit.ts
export function auditLog(action: "login" | "create" | "update" | "archive" | "restore" | "upload", slug: string | undefined, ip: string, success: boolean) {
  console.log(JSON.stringify({ action, slug, ip, success, ts: new Date().toISOString() }));
}
```

---

## Implementation Phases

### Phase 0 — Route Group Refactor (BLOCKER — must do first)

- [ ] Create `src/app/(public)/` route group
- [ ] Move existing `src/app/layout.tsx` Header/Footer rendering into `src/app/(public)/layout.tsx`
- [ ] Move all existing public pages (`page.tsx`, `team/`, `research/`, `publications/`, `news/`, `contact/`, `tools/`, `mission/`) into `(public)/`
- [ ] Verify public site still renders identically
- [ ] Create minimal `src/app/layout.tsx` with only fonts/metadata (no nav/footer)

### Phase 1 — Foundation (backend + middleware)

- [ ] `npm install iron-session @octokit/rest sharp slug zod`
- [ ] `npm install --os=linux --cpu=x64 --libc=glibc sharp` (Vercel Linux binary)
- [ ] Add `serverExternalPackages: ["sharp"]` to `next.config.ts` (top-level, not under `experimental`)
- [ ] Add HSTS + `Cache-Control: no-store` + `X-Robots-Tag: noindex` headers for `/staff/:path*` in `next.config.ts`
- [ ] Add `.env.local` entries: `ADMIN_PASSPHRASE`, `GITHUB_BOT_TOKEN`, `SESSION_SECRET`
- [ ] Create `src/lib/staff/types.ts` — `MemberFrontmatter`, `GitHubFileResult`, `TeamFileEntry`, `ApiError`
- [ ] Create `src/lib/staff/github.ts` — Octokit singleton (module-level), `getFile` (with `\n` stripping), `upsertFile`, `upsertBinaryFile`, `listTeamFiles`; hardcode `OWNER = "riccc-rush-lab"`, `REPO = "ricccsite"`
- [ ] Create `src/lib/staff/mdx-staff.ts` — `parseMember()`, `serializeMember()` (canonical key order, explicit omit, int coerce), `nameToSlug()` (using `slug` package), `validateSlug()`
- [ ] Create `src/lib/staff/auth.ts` — `iron-session` options, `requireAdmin()`, `verifyPassphrase()` (timingSafeEqual)
- [ ] Create `src/lib/staff/rate-limit.ts` — per-IP in-memory limiter (login only)
- [ ] Create `src/lib/staff/photo.ts` — `sniffMimeType()` (magic bytes), `processPhoto()` (sharp, `failOnError: true`)
- [ ] Create `src/lib/staff/csrf.ts` — `checkOrigin()`
- [ ] Create `src/lib/staff/audit.ts` — `auditLog()`
- [ ] Create `src/middleware.ts` — protect `/staff/*` (except `/staff/login`) and `/api/staff/*` using `req.cookies.get()` (synchronous `NextRequest` cookies)
- [ ] Create `src/app/api/staff/login/route.ts` — rate limit → passphrase check → iron-session save → audit log
- [ ] Create `src/app/api/staff/logout/route.ts` — iron-session destroy → audit log
- [ ] Create `src/app/api/staff/members/route.ts` — GET list + POST create (hoist `listTeamFiles` for slug uniqueness check)
- [ ] Create `src/app/api/staff/members/[slug]/route.ts` — GET one; PUT update (with sha fetch inside handler); PATCH tier (archive/restore with `previous_tier`)
- [ ] Create `src/app/api/staff/members/[slug]/exists/route.ts` — GET: `{ exists: boolean }` (agent-friendly, no side effects)
- [ ] Create `src/app/api/staff/upload/route.ts` — `export const runtime = "nodejs"`, `export const maxDuration = 30`, content-length check, magic byte validation, sharp, GitHub commit

### Phase 2 — UI

- [ ] Create `src/app/staff/layout.tsx` — admin shell (Rush brand, no public nav/footer, logout button, auth redirect centralized here)
- [ ] Create `src/app/staff/page.tsx` — session check redirect
- [ ] Create `src/app/staff/login/page.tsx` + `src/components/staff/LoginForm.tsx`
- [ ] Create `src/app/staff/members/page.tsx` + `src/components/staff/MemberList.tsx` (with per-member `archivingIds` Set, native `confirm()` for archive — no ConfirmDialog component)
- [ ] Create `src/app/staff/members/new/page.tsx` + `src/components/staff/MemberForm.tsx` (create mode — use discriminated union props)
- [ ] Create `src/app/staff/members/[slug]/edit/page.tsx` + `MemberForm.tsx` reuse (edit mode — photo field pre-populated from fetched data, baseline set AFTER fetch)
- [ ] `MemberForm.tsx` — `isSaving` flag + `finally` reset, `isDirtyRef` for beforeunload, `beforeunload` cleared before `router.push`
- [ ] `PhotoUpload.tsx` — `<input type="file">` (no drag-drop), generation counter for concurrent uploads, `canSave` gates Save button

### Phase 3 — Polish + Validation

- [ ] Zod schema validation on all API route mutation bodies (server-side, never trust client)
- [ ] MIME type check via magic bytes before sharp (enforced in `photo.ts`)
- [ ] File size limit: 4 MB client-side warning; 4.5 MB server-side rejection before `formData()`
- [ ] Dirty form warning: `beforeunload` event with `isDirtyRef` (cleared before navigation on save)
- [ ] Audit log verified in Vercel dashboard logs for: login attempts, creates, updates, archives, uploads
- [ ] `npm run build` — confirm zero TypeScript and lint errors
- [ ] Manual end-to-end test (see Verification section)

---

## New Environment Variables

| Variable | Purpose | Example |
|---|---|---|
| `ADMIN_PASSPHRASE` | Shared login passphrase for staff | `correct-horse-battery-staple` |
| `SESSION_SECRET` | 32+ char secret for iron-session cookie signing | `$(openssl rand -hex 32)` |
| `GITHUB_BOT_TOKEN` | Fine-grained PAT: contents write on `ricccsite` only | `github_pat_...` |

`GITHUB_OWNER` and `GITHUB_REPO` are removed from env vars — hardcoded as constants in `github.ts`.

Document in `CLAUDE.md`: token rotation process (Vercel env var → redeploy), who to contact if token expires.

---

## New Dependencies

```bash
npm install iron-session @octokit/rest sharp slug zod
npm install --os=linux --cpu=x64 --libc=glibc sharp  # Vercel Linux binary
```

**Removed from original plan:**
- `@octokit/plugin-throttling` — retry behavior causes Vercel function timeout (10s hobby limit)
- `@octokit/plugin-retry` — same issue; use plain Octokit + explicit 409 handling

`@types/sharp` — **do not install** (bundled in sharp since v0.32.0; `@types/sharp` is deprecated).

---

## Key Files Modified

| File | Change |
|---|---|
| `next.config.ts` | Add `serverExternalPackages: ["sharp"]` (top-level); add HSTS + no-store + noindex headers for `/staff/:path*` |
| `src/app/layout.tsx` | Strip Header/Footer; move to `(public)/layout.tsx` |
| `CLAUDE.md` | Document `SESSION_SECRET`, `ADMIN_PASSPHRASE`, `GITHUB_BOT_TOKEN` rotation |
| `public/admin/config.yml` | Add `collaborator` to tier select options |

---

## Acceptance Criteria

### Auth
- [ ] `GET /staff/members` without a session cookie → 302 redirect to `/staff/login`
- [ ] Login with wrong passphrase → HTTP 401, error message shown, no cookie set
- [ ] Login with correct passphrase → iron-session cookie set (httpOnly, sameSite: strict, path: /staff), redirect to `/staff/members`
- [ ] After 5 failed login attempts from same IP within 15 min → HTTP 429 response
- [ ] Logout clears session → redirect to `/staff/login`
- [ ] Session cookie carries signed iron-session seal, not a literal value

### List View
- [ ] All members shown, grouped by tier: PI, Staff, Student, Alumni
- [ ] Each row shows: photo thumbnail, name, role, tier badge
- [ ] "Add Member" button navigates to `/staff/members/new`
- [ ] Clicking a row navigates to `/staff/members/[slug]/edit`

### Edit Member
- [ ] Form pre-populated with all existing fields (including photo path)
- [ ] Slug shown as read-only — cannot be changed
- [ ] Saving updates `content/team/[slug].mdx` on GitHub with correct frontmatter
- [ ] Optional fields cleared in UI → omitted from frontmatter (not written as `""`)
- [ ] SHA conflict on save → HTTP 409 + non-dismissable error banner "Another edit was saved — reload and try again"
- [ ] Session expired on save → redirect to `/staff/login?returnTo=<current-url>`
- [ ] Navigating away with unsaved changes → browser `beforeunload` warning
- [ ] Save button disabled while photo upload is in progress

### Create Member
- [ ] Slug auto-derived from name input using `slug` package (proper Unicode transliteration)
- [ ] Submit blocked if derived slug already exists (checked server-side; `GET /exists` also available)
- [ ] Empty slug after derivation → 400 error before any GitHub write
- [ ] Submitting creates `content/team/[slug].mdx` on GitHub
- [ ] Redirects to edit page for the new member after creation

### Archive / Restore
- [ ] Archive stores `previous_tier` in frontmatter, sets `tier: alumni`
- [ ] Restore reads `previous_tier`, sets tier back to original value (not always `staff`)
- [ ] `previous_tier` field removed from frontmatter after restore
- [ ] Browser `confirm()` shown before archive (no custom dialog component)
- [ ] Archived member moves to Alumni section of list

### Photo Upload
- [ ] Accepted formats: JPEG, PNG, WebP — validated by magic bytes, not Content-Type header
- [ ] Max file size: 4 MB client-side warning; 4.5 MB server-side rejection (Vercel limit)
- [ ] Photo previewed before upload (client-side `FileReader` preview)
- [ ] On upload: resized to 400×400 JPEG, committed to `public/images/team/[slug].jpg`
- [ ] Concurrent upload → only the most recent response updates form state (generation counter)
- [ ] Upload path auto-filled in form
- [ ] MDX only commits when form is saved

### Security
- [ ] Session cookie carries iron-session sealed token, not literal "1"
- [ ] All GitHub API calls in server-side route handlers only
- [ ] Passphrase compared with `crypto.timingSafeEqual`
- [ ] `slug` URL parameter validated with `/^[a-z0-9-]+$/` before any GitHub path construction
- [ ] MIME type validated by magic bytes before sharp
- [ ] Origin header checked on all mutation routes
- [ ] HSTS + `Cache-Control: no-store` + `X-Robots-Tag: noindex` on all `/staff/*` responses
- [ ] Zod validation on all mutation request bodies
- [ ] Audit log emitted for all login attempts and mutations
- [ ] Octokit errors caught and sanitized (raw GitHub error messages never sent to client)

### Cache / Revalidation
- [ ] After every successful GitHub write: `revalidatePath("/team")` called
- [ ] Public `/team` page reflects changes within ~1 minute of save

### Validation
- [ ] Name: required, max 200 chars, no newlines
- [ ] Role: required, max 300 chars, no newlines
- [ ] Email: required, valid email format, max 254 chars
- [ ] Tier: required, one of `pi | staff | student | alumni | collaborator`
- [ ] ORCID: optional, must match `\d{4}-\d{4}-\d{4}-\d{3}[\dX]` if provided
- [ ] Scholar / LinkedIn / Website / GitHub: optional, must start with `https://` if provided
- [ ] Bio: optional, max 5000 chars
- [ ] Display order: integer 0–999, defaults to 50 (coerced, never left as string)
- [ ] Slug: `/^[a-z0-9-]+$/`, max 60 chars, enforced server-side before any GitHub path

---

## Verification (End-to-End Test Flow)

```bash
npm run dev
```

1. Visit `http://localhost:3000/staff` → should redirect to `/staff/login`
2. Check that public nav/footer do NOT appear on `/staff/*` pages
3. Enter wrong passphrase → error message, no redirect
4. Enter 5 wrong passphrases → rate limit message
5. Enter correct passphrase → lands on `/staff/members`
6. Verify all existing team members appear, grouped correctly
7. Click "Add Member" → fill form → save → verify new MDX file in `content/team/`
8. Upload a portrait photo → verify it appears in `public/images/team/` and is a 400×400 JPEG
9. Edit existing member → change bio → save → verify `revalidatePath` fired → check `/team` page updated
10. Archive a member → browser confirm dialog → verify `tier: alumni` + `previous_tier` in MDX → member moves to Alumni section
11. Restore archived member → verify original tier restored, `previous_tier` removed from frontmatter
12. Test SHA conflict: open same member in two tabs, save from both → second save shows 409 banner
13. `npm run build` → zero errors

```bash
npm run lint && npm run build
```

---

## References

### Internal
- `src/lib/team.ts` — existing team parser (gray-matter fields, camelCase mapping, `TeamTier` type to reuse)
- `src/app/api/revalidate/route.ts` — existing API route pattern; shows `Authorization: Bearer` + `revalidatePath`
- `content/team/juan-rojas.mdx` — full-featured MDX example (complex role strings with colons — relevant for js-yaml serialization)
- `content/team/mia-mcclintic.mdx` — minimal MDX example
- `public/admin/config.yml` — CMS field names (all snake_case)
- `next.config.ts` — existing CSP headers; add `serverExternalPackages` and `/staff/*` security headers here

### Key Docs
- Octokit REST: `createOrUpdateFileContents` — requires base64 content (no `\n`) + SHA for updates
- Next.js 16: `cookies()` is async — always `await cookies()` in route handlers
- Next.js 16: `params` is async — always `const { slug } = await params`
- Next.js 16: `serverExternalPackages` is top-level (not under `experimental`)
- `iron-session` v8+: first-class App Router support with `getIronSession(await cookies(), options)`
- `sharp` 0.34.5: `position: "attention"` valid; `@types/sharp` deprecated; types bundled
- `gray-matter`: `matter.stringify(content, data)` — content-first; snake_case keys preserved

### Known Gotchas
> In Next.js 16, calling `cookies().get(...)` without `await` silently returns a Promise, making every auth check evaluate to `true`. Always `await cookies()` in route handlers. In middleware, use `req.cookies.get(...)` (synchronous `NextRequest` API) instead.

> `getContent` returns `data.content` with embedded `\n` chars in the base64 string. Must strip before decoding: `Buffer.from(data.content.replace(/\n/g, ""), "base64")`.

> `@octokit/plugin-throttling` queues retries with 60-second exponential backoff. Vercel hobby functions time out at 10 seconds. This combination causes silent function kills on rate-limited GitHub responses. Use vanilla `@octokit/rest` and surface 429 as a user-facing error.

> `display_order` from a form `<input type="number">` arrives as a string in `req.json()` if the value passes through JSON without type coercion. Always `parseInt(String(data.display_order), 10) || 50` before serializing to frontmatter.

> gray-matter's `matter.stringify()` uses js-yaml's `safeDump`, which silently drops `null` and `undefined` values. A photo or ORCID field that was previously set will be **deleted from the file** if the form submits `undefined` for that field. Explicitly build the data object by iterating a canonical field list and omitting only keys where the value is intentionally empty.
