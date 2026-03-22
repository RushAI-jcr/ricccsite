"use client";

import { useMemo, useState } from "react";
import { type Publication } from "@/lib/types";
import { PubCard } from "./pub-card";

export function PubFilters({ publications }: { publications: Publication[] }) {
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  // Extract unique years
  const years = [...new Set(publications.map((p) => p.year).filter(Boolean))].sort(
    (a, b) => b.localeCompare(a)
  );

  const filtered = publications.filter((pub) => {
    const matchesSearch =
      !search ||
      pub.title.toLowerCase().includes(search.toLowerCase()) ||
      pub.authors.toLowerCase().includes(search.toLowerCase());
    const matchesYear = !yearFilter || pub.year === yearFilter;
    return matchesSearch && matchesYear;
  });

  // Group by year and sort within each group by citation count (non-mutating)
  const { grouped, sortedYears } = useMemo(() => {
    const g = filtered.reduce<Record<string, Publication[]>>((acc, pub) => {
      const year = pub.year || "Unknown";
      if (!acc[year]) acc[year] = [];
      acc[year].push(pub);
      return acc;
    }, {});

    // Sort within each year group by citation count descending
    for (const year of Object.keys(g)) {
      g[year] = [...g[year]].sort(
        (a, b) => (b.citationCount ?? 0) - (a.citationCount ?? 0)
      );
    }

    const sy = Object.keys(g).sort((a, b) => b.localeCompare(a));
    return { grouped: g, sortedYears: sy };
  }, [filtered]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rush-teal"
        />
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rush-teal"
        >
          <option value="">All years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {sortedYears.length === 0 && (
        <p className="text-rush-mid-gray text-center py-8">
          No publications match your search.
        </p>
      )}

      {sortedYears.map((year) => (
        <div key={year} className="mb-8">
          <h3 className="text-lg font-semibold text-rush-green mb-4">
            {year}
          </h3>
          <div className="space-y-3">
            {grouped[year].map((pub) => (
              <PubCard key={pub.doi || pub.pmid || pub.title} pub={pub} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
