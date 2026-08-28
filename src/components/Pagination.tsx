import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Fully static pagination: every href below points at a route that was
 * pre-rendered by generateStaticParams at build time (/works/ for page 1,
 * /works/page/2/, /works/page/3/, ...). No API call, no client state.
 */
export default function Pagination({
  locale,
  dict,
  page,
  totalPages,
}: {
  locale: Locale;
  dict: Dictionary;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => (p === 1 ? `/${locale}/works/` : `/${locale}/works/page/${p}/`);

  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="pagination-link">
          {dict.pagination.prev}
        </Link>
      ) : (
        <span className="pagination-disabled">{dict.pagination.prev}</span>
      )}

      <div className="pagination-pages">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={hrefFor(p)}
            className="pagination-page"
            aria-current={p === page}
          >
            {p}
          </Link>
        ))}
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
