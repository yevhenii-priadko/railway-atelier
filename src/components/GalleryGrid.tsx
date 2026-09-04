"use client";

import { useState, useTransition } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Work } from "@/lib/work-types";
import { getWorksPageAction } from "@/app/actions/gallery";
import ProjectCard from "./ProjectCard";

const ELLIPSIS = "…" as const;
type PageToken = number | typeof ELLIPSIS;

// Same collapsing rule the old route-based Pagination component used:
// always show page 1, the last page, the current page and its neighbors,
// collapsing everything else into a single "…".
function getPageTokens(current: number, total: number): PageToken[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current]);
  if (current - 1 >= 1) pages.add(current - 1);
  if (current + 1 <= total) pages.add(current + 1);

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const tokens: PageToken[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) tokens.push(ELLIPSIS);
    tokens.push(sorted[i]);
  }
  return tokens;
}

/**
 * The homepage works section: grid + pagination together, paging in
 * place. This replaces the old page-1 teaser + "view all" link out to a
 * separate /works/ archive page — Anton asked to drop that extra page
 * once he'd used /admin for a bit ("просто щоб пагінація була прямо на
 * головній"). Paging re-fetches just the next page's items via a server
 * action and swaps the grid, so there's no navigation and no lost scroll
 * position — you stay right where you were looking.
 */
export default function GalleryGrid({
  locale,
  dict,
  initialItems,
  totalPages,
}: {
  locale: Locale;
  dict: Dictionary;
  initialItems: Work[];
  totalPages: number;
}) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();

  function goTo(target: number) {
    if (target < 1 || target > totalPages || target === page || isPending) return;
    startTransition(async () => {
      const next = await getWorksPageAction(target);
      setItems(next);
      setPage(target);
    });
  }

  return (
    <>
      <div className={isPending ? "gallery-grid gallery-grid-loading" : "gallery-grid"}>
        {items.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} dict={dict} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="pagination" aria-label="Pagination">
          {page > 1 ? (
            <button type="button" className="pagination-link" onClick={() => goTo(page - 1)}>
              {dict.pagination.prev}
            </button>
          ) : (
            <span className="pagination-disabled">{dict.pagination.prev}</span>
          )}

          <div className="pagination-pages">
            {getPageTokens(page, totalPages).map((token, i) =>
              token === ELLIPSIS ? (
                <span key={`ellipsis-${i}`} className="pagination-ellipsis" aria-hidden="true">
                  {ELLIPSIS}
                </span>
              ) : (
                <button
                  key={token}
                  type="button"
                  className="pagination-page"
                  aria-current={token === page}
                  onClick={() => goTo(token)}
                >
                  {token}
                </button>
              )
            )}
          </div>

          {page < totalPages ? (
            <button type="button" className="pagination-link" onClick={() => goTo(page + 1)}>
              {dict.pagination.next}
            </button>
          ) : (
            <span className="pagination-disabled">{dict.pagination.next}</span>
          )}
        </nav>
      )}
    </>
  );
}
