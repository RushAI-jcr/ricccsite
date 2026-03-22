"use client";

import { useState } from "react";
import { type Publication } from "@/lib/pubmed";
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

  // Group by year
  const grouped = filtered.reduce<Record<string, Publication[]>>((acc, pub) => {
    const year = pub.year || "Unknown";
    if (!acc[year]) acc[year] = [];
    acc[year].push(pub);
    return acc;
  }, {});

  const sortedYears = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rush-deep-blue"
        />
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rush-deep-blue"
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
          <h3 className="text-lg font-semibold text-rush-indigo mb-4">
            {year}
          </h3>
          <div className="space-y-3">
            {grouped[year].map((pub) => (
              <PubCard key={pub.pmid || pub.doi || pub.title} pub={pub} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
