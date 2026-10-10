"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Guide } from "@/lib/content";

export function GuidesList({
  guides,
  filters,
}: {
  guides: Guide[];
  filters: string[];
}) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guides.filter((g) => {
      const matchesTag = filter === "All" || g.tag === filter;
      const matchesQuery =
        !q || g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q);
      return matchesTag && matchesQuery;
    });
  }, [guides, filter, query]);

  return (
    <>
      <div className="filter-bar">
        <div className="filter-inner">
          <div className="filter-row">
            <span className="filter-label">Filter by topic</span>
            <div className="filter-chips">
              {filters.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`filter-chip${filter === tag ? " filter-chip--active" : ""}`}
                  onClick={() => setFilter(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-row">
            <span className="filter-label">Search guides</span>
            <input
              className="filter-search"
              type="search"
              placeholder="Search by title or description…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search guides"
            />
          </div>
          <p className="filter-count">
            <b>{filtered.length}</b> {filtered.length === 1 ? "guide" : "guides"}
            {filter !== "All" ? ` in ${filter}` : ""}
            {query ? ` matching “${query}”` : ""}
          </p>
        </div>
      </div>

      <div className="guide-list">
        {filtered.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="guide-row">
            <div className="guide-row__body">
              <span className="guide-row__tag">
                {g.tag} · {g.readTime}
              </span>
              <h2 className="guide-row__title">{g.title}</h2>
              <p className="guide-row__desc">{g.desc}</p>
            </div>
            <span className="guide-row__arrow" aria-hidden="true">→</span>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="guide-list__empty">
            No guides match your filters yet — try clearing the search.
          </div>
        )}
      </div>
    </>
  );
}
