"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PhotoUpload } from "./PhotoUpload";
import { nameToSlug } from "@/lib/staff/mdx-staff";
import type { MemberFrontmatter } from "@/lib/staff/types";

// Discriminated union — TypeScript enforces slug in edit mode
type MemberFormProps =
  | {
      mode: "create";
      initialValues?: Partial<MemberFrontmatter & { bio: string }>;
    }
  | {
      mode: "edit";
      slug: string;
      initialValues: MemberFrontmatter & { bio: string };
    };

const TIERS = ["pi", "staff", "student", "alumni", "collaborator"] as const;

export function MemberForm(props: MemberFormProps) {
  const router = useRouter();
  const isEdit = props.mode === "edit";
  const slug = isEdit ? props.slug : null;

  // Form state — initialized after data is available
  const [name, setName] = useState(props.initialValues?.name ?? "");
  const [role, setRole] = useState(props.initialValues?.role ?? "");
  const [tier, setTier] = useState<string>(props.initialValues?.tier ?? "staff");
  const [email, setEmail] = useState(props.initialValues?.email ?? "");
  const [photo, setPhoto] = useState(props.initialValues?.photo ?? "");
  const [bio, setBio] = useState(props.initialValues?.bio ?? "");
  const [pubmedName, setPubmedName] = useState(props.initialValues?.pubmed_name ?? "");
  const [orcid, setOrcid] = useState(props.initialValues?.orcid ?? "");
  const [scholar, setScholar] = useState(props.initialValues?.scholar ?? "");
  const [linkedin, setLinkedin] = useState(props.initialValues?.linkedin ?? "");
  const [website, setWebsite] = useState(props.initialValues?.website ?? "");
  const [github, setGithub] = useState(props.initialValues?.github ?? "");
  const [displayOrder, setDisplayOrder] = useState(
    String(props.initialValues?.display_order ?? 50)
  );

  // Derived slug (create mode only)
  const [derivedSlug, setDerivedSlug] = useState(
    props.mode === "create" ? nameToSlug(props.initialValues?.name ?? "") : ""
  );

  // Async state guards
  const [isSaving, setIsSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [error, setError] = useState("");
  const [conflictError, setConflictError] = useState(false);

  // Dirty tracking for beforeunload
  const isDirtyRef = useRef(false);
  // Baseline: set after initial values are loaded (not at mount — avoids empty-form false positive)
  const [baselineSet, setBaselineSet] = useState(false);

  useEffect(() => {
    if (!baselineSet && props.initialValues) {
      setBaselineSet(true);
      isDirtyRef.current = false;
    }
  }, [baselineSet, props.initialValues]);

  // Stable beforeunload listener using ref
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirtyRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  function markDirty() {
    isDirtyRef.current = true;
  }

  function handleNameChange(v: string) {
    setName(v);
    markDirty();
    if (!isEdit) {
      setDerivedSlug(nameToSlug(v));
    }
  }

  const canSave = !isSaving && !photoUploading;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    setError("");
    setConflictError(false);
    setIsSaving(true);

    const payload = {
      name,
      role,
      tier,
      email,
      photo: photo || undefined,
      bio,
      pubmed_name: pubmedName || undefined,
      orcid: orcid || undefined,
      scholar: scholar || undefined,
      linkedin: linkedin || undefined,
      website: website || undefined,
      github: github || undefined,
      display_order: parseInt(displayOrder, 10) || 50,
      // Include derived slug for create mode
      ...(props.mode === "create" ? { slug: derivedSlug } : {}),
    };

    try {
      const url = isEdit ? `/api/staff/members/${slug}` : "/api/staff/members";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        setConflictError(true);
        return;
      }

      if (res.status === 401 || res.status === 403) {
        // Session expired — redirect without triggering beforeunload
        isDirtyRef.current = false;
        const returnTo = isEdit ? `/staff/members/${slug}/edit` : "/staff/members/new";
        router.push(`/staff/login?returnTo=${encodeURIComponent(returnTo)}`);
        return;
      }

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.message ?? "Save failed. Please try again.");
        return;
      }

      // Clear dirty flag BEFORE navigating to avoid false beforeunload
      isDirtyRef.current = false;

      if (!isEdit) {
        const { data } = await res.json();
        router.push(`/staff/members/${data.slug}/edit`);
      } else {
        router.push("/staff/members");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const inputCls =
    "w-full px-3 py-2.5 border border-rush-outline-variant/40 rounded-sm bg-white text-rush-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-rush-teal";
  const labelCls = "block text-sm font-medium text-rush-on-surface mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Conflict error */}
      {conflictError && (
        <div className="bg-orange-50 border border-orange-300 rounded-sm px-4 py-3 text-sm text-orange-800">
          <strong>Edit conflict:</strong> Another edit was saved while you were working. Reload the
          form to see the latest version before re-applying your changes.
        </div>
      )}

      {/* General error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
          {error}
        </p>
      )}

      {/* Core fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelCls}>
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            maxLength={200}
            className={inputCls}
          />
          {!isEdit && derivedSlug && (
            <p className="text-xs text-rush-on-surface-variant mt-1 font-mono">
              Slug: {derivedSlug}
            </p>
          )}
          {isEdit && (
            <p className="text-xs text-rush-on-surface-variant mt-1 font-mono">
              Slug: {slug} <span className="text-rush-on-surface-variant/50">(cannot change)</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="role" className={labelCls}>
            Role <span className="text-red-500">*</span>
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => { setRole(e.target.value); markDirty(); }}
            required
            maxLength={300}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="tier" className={labelCls}>
            Tier <span className="text-red-500">*</span>
          </label>
          <select
            id="tier"
            value={tier}
            onChange={(e) => { setTier(e.target.value); markDirty(); }}
            required
            className={inputCls}
          >
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="email" className={labelCls}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); markDirty(); }}
            required
            maxLength={254}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="display_order" className={labelCls}>
            Display Order
          </label>
          <input
            id="display_order"
            type="number"
            value={displayOrder}
            onChange={(e) => { setDisplayOrder(e.target.value); markDirty(); }}
            min={0}
            max={999}
            className={inputCls}
          />
          <p className="text-xs text-rush-on-surface-variant mt-1">Lower number = listed first</p>
        </div>

        <div>
          <label htmlFor="pubmed_name" className={labelCls}>
            PubMed Name
          </label>
          <input
            id="pubmed_name"
            type="text"
            value={pubmedName}
            onChange={(e) => { setPubmedName(e.target.value); markDirty(); }}
            maxLength={100}
            placeholder="Last FM"
            className={inputCls}
          />
        </div>
      </div>

      {/* Photo */}
      <PhotoUpload
        slug={isEdit ? slug! : derivedSlug}
        currentUrl={photo || undefined}
        onUploaded={(url) => { setPhoto(url); markDirty(); }}
        onUploadStateChange={setPhotoUploading}
      />

      {/* Bio */}
      <div>
        <label htmlFor="bio" className={labelCls}>
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => { setBio(e.target.value); markDirty(); }}
          maxLength={5000}
          rows={6}
          className={inputCls + " resize-y"}
          placeholder="Short biography…"
        />
      </div>

      {/* Social links */}
      <div>
        <h3 className="text-sm font-semibold text-rush-on-surface mb-3">Social &amp; Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: "orcid", label: "ORCID", value: orcid, setter: setOrcid, placeholder: "0000-0000-0000-0000" },
            { id: "linkedin", label: "LinkedIn", value: linkedin, setter: setLinkedin, placeholder: "https://linkedin.com/in/…" },
            { id: "scholar", label: "Google Scholar", value: scholar, setter: setScholar, placeholder: "https://scholar.google.com/…" },
            { id: "website", label: "Website", value: website, setter: setWebsite, placeholder: "https://…" },
            { id: "github", label: "GitHub", value: github, setter: setGithub, placeholder: "https://github.com/…" },
          ].map(({ id, label, value, setter, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className={labelCls}>
                {label}
              </label>
              <input
                id={id}
                type={id === "orcid" ? "text" : "url"}
                value={value}
                onChange={(e) => { setter(e.target.value); markDirty(); }}
                placeholder={placeholder}
                className={inputCls}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-rush-outline-variant/20">
        <button
          type="button"
          onClick={() => router.push("/staff/members")}
          className="text-sm text-rush-on-surface-variant hover:text-rush-on-surface transition-colors"
        >
          ← Cancel
        </button>

        <button
          type="submit"
          disabled={!canSave}
          className="bg-rush-dark-green text-white px-6 py-2.5 rounded-sm font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving…" : photoUploading ? "Waiting for upload…" : isEdit ? "Save changes" : "Create member"}
        </button>
      </div>
    </form>
  );
}
