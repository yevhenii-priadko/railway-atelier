import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

const ELLIPSIS = "…" as const;
type PageToken = number | typeof ELLIPSIS;

/**
 * Compact page list: always shows page 1, the last page, the current
 * page, and its immediate neighbors — collapsing everything else into a
 * single "…". Below 8 pages this just returns every page (identical to
 * the old behavior), so today's 2-page archive is unaffected; it only
 * kicks in once there's enough content to need it. Without this, once
 * the archive grows past a handful of pages the number row would either
 * wrap unpredictably on mobile (see BUG-006 in bug-report-003.docx) or
 * just look absurd — 8+ little boxes in a row.
 */
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
 * Fully static pagination: every href below points at a route that was
 * pre-rendered by generateStaticParams at build time (/works/ for page 1,
 * /works/page/2/, /works/page/3/, ...). No API call, no client state.
 *
 * Deliberately using Next's default scroll-to-top on navigation (i.e. NOT
 * scroll={false}) here. An earlier version preserved the scroll offset to
 * avoid jumping to the top when clicking the bottom pagination, but pages
 * don't all have the same height — the last page of a set almost always
 * has fewer cards than a full page — so keeping the raw scroll position
 * left the viewport looking at the wrong part of the new page (the click
 * target visually "moved" out from under the cursor). Scrolling to the
 * top of the listing on every page change is what most paginated sites
 * do (search results, shops, blogs) — it's a hard jump, but it's the same
 * jump every time, from either pagination row, regardless of how many
 * cards the next page has.
 */
export default function Pagination({
  locale,
  dict,
  page,
  totalPages,
  variant = "bottom",
}: {
  locale: Locale;
  dict: Dictionary;
  page: number;
  totalPages: number;
  variant?: "top" | "bottom";
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => (p === 1 ? `/${locale}/works/` : `/${locale}/works/page/${p}/`);

  return (
    <nav
      className={variant === "top" ? "pagination pagination-top" : "pagination"}
      aria-label="Pagination"
    >
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="pagination-link">
          {dict.pagination.prev}
        </Link>
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
            <Link
              key={token}
              href={hrefFor(token)}
              className="pagination-page"
              aria-current={token === page}
            >
              {token}
            </Link>
          )
        )}
      </div>

      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className="pagination-link">
          {dict.pagination.next}
        </Link>
      ) : (
        <span className="pagination-disabled">{dict.pagination.next}</span>
      )}
    </nav>
  );
}
