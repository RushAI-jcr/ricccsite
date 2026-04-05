"use client";

import { useState, useRef, type ChangeEvent } from "react";

interface PhotoUploadProps {
  slug: string;
  currentUrl?: string;
  onUploaded: (url: string) => void;
  onUploadStateChange?: (uploading: boolean) => void;
}

export function PhotoUpload({ slug, currentUrl, onUploaded, onUploadStateChange }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  // Generation counter — ensures only the most recent upload response is used
  const uploadGenRef = useRef(0);

  async function handleFile(file: File) {
    // Client-side size guard (4 MB warning)
    if (file.size > 4 * 1024 * 1024) {
      setError("Photo must be under 4 MB. Please compress or resize it first.");
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    uploadGenRef.current += 1;
    const myGen = uploadGenRef.current;

    setUploading(true);
    onUploadStateChange?.(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("slug", slug);

      const res = await fetch("/api/staff/upload", { method: "POST", body: formData });

      // Stale response from a superseded upload — discard
      if (myGen !== uploadGenRef.current) return;

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.message ?? "Upload failed");
        return;
      }

      const { data } = await res.json();
      onUploaded(data.url);
    } catch {
      if (myGen !== uploadGenRef.current) return;
      setError("Network error during upload.");
    } finally {
      if (myGen === uploadGenRef.current) {
        setUploading(false);
        onUploadStateChange?.(false);
      }
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-rush-on-surface">Photo</label>

      {/* Preview */}
      {preview && (
        <div className="w-24 h-24 rounded-sm overflow-hidden bg-rush-surface-container-high border border-rush-outline-variant/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}

      {/* File input */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="photo-input"
          className={`cursor-pointer inline-block border border-rush-outline-variant/40 rounded-sm px-4 py-2 text-sm text-rush-on-surface bg-white hover:bg-rush-surface-container-low transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {uploading ? "Uploading…" : preview ? "Change photo" : "Choose photo"}
        </label>
        <input
          id="photo-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={uploading}
          onChange={handleChange}
          className="sr-only"
        />
        <span className="text-xs text-rush-on-surface-variant">JPEG, PNG, or WebP · max 4 MB</span>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
