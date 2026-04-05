"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { TIER_DISPLAY_ORDER, TIER_LABELS } from "@/lib/team-constants";

interface MemberRow {
  slug: string;
  name: string;
  role: string;
  tier: string;
  photo?: string;
}

export function MemberList() {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [archivingIds, setArchivingIds] = useState<Set<string>>(new Set());

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/staff/members?detail=true");
      if (!res.ok) throw new Error("Failed to load members");
      const { data } = (await res.json()) as { data: MemberRow[] };
      setMembers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error loading members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  async function handleToggleTier(slug: string, name: string, action: "archive" | "restore") {
    if (archivingIds.has(slug)) return;
    const msg = action === "archive"
      ? `Archive ${name}? They will be moved to the Alumni section.`
      : `Restore ${name} to active member?`;
    if (!confirm(msg)) return;

    setArchivingIds((prev) => new Set(prev).add(slug));
    try {
      const res = await fetch(`/api/staff/members/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(d.message ?? `${action} failed`);
        return;
      }
      // Optimistic UI update — avoids full refetch
      setMembers((prev) =>
        prev.map((m) =>
          m.slug === slug
            ? { ...m, tier: action === "archive" ? "alumni" : "staff" }
            : m
        )
      );
    } finally {
      setArchivingIds((prev) => {
        const n = new Set(prev);
        n.delete(slug);
        return n;
      });
    }
  }

  const grouped = TIER_DISPLAY_ORDER.reduce(
    (acc, tier) => {
      acc[tier] = members.filter((m) => m.tier === tier);
      return acc;
    },
    {} as Record<string, MemberRow[]>
  );

  if (loading) {
    return (
      <div className="py-16 text-center text-rush-on-surface-variant font-mono text-sm">
        Loading members…
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-600 text-sm">{error}</div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-rush-on-surface">Team Members</h1>
        <Link
          href="/staff/members/new"
          className="bg-rush-dark-green text-white px-5 py-2.5 rounded-sm text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          + Add Member
        </Link>
      </div>

      <div className="space-y-8">
        {TIER_DISPLAY_ORDER.map((tier) => {
          const list = grouped[tier];
          if (list.length === 0) return null;
          return (
            <section key={tier}>
              <h2 className="font-mono text-xs uppercase tracking-widest text-rush-on-surface-variant mb-3">
                {TIER_LABELS[tier]} ({list.length})
              </h2>
              <div className="bg-white rounded-sm shadow-card-sm divide-y divide-rush-outline-variant/20">
                {list.map((m) => (
                  <div key={m.slug} className="flex items-center gap-4 px-5 py-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-sm bg-rush-surface-container-high overflow-hidden shrink-0">
                      {m.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-rush-on-surface-variant/50 font-mono text-xs font-bold">
                          {m.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Name / role */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-rush-on-surface text-sm truncate">{m.name}</p>
                      <p className="text-rush-on-surface-variant text-xs truncate">{m.role}</p>
                    </div>

                    {/* Tier badge */}
                    <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-rush-on-surface-variant/60 border border-rush-outline-variant/30 px-2 py-1 rounded-sm">
                      {m.tier}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/staff/members/${m.slug}/edit`}
                        className="text-rush-dark-green text-xs font-semibold hover:underline"
                      >
                        Edit
                      </Link>
                      {m.tier === "alumni" ? (
                        <button
                          onClick={() => handleToggleTier(m.slug, m.name, "restore")}
                          disabled={archivingIds.has(m.slug)}
                          className="text-rush-teal text-xs font-semibold hover:underline disabled:opacity-40"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleTier(m.slug, m.name, "archive")}
                          disabled={archivingIds.has(m.slug)}
                          className="text-rush-on-surface-variant/50 text-xs hover:text-red-500 transition-colors disabled:opacity-40"
                        >
                          Archive
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
