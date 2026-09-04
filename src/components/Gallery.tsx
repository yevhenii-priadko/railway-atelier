import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getWorksForPage, getTotalWorkPages } from "@/lib/works";
import GalleryGrid from "./GalleryGrid";

/**
 * The homepage works section: the full paginated archive lives right
 * here now. Used to be a static page-1 teaser with a "view all" link out
 * to a separate /works/ archive page — Anton asked to drop that extra
 * page after using /admin for a bit, so scrolling to this section and
 * paging through it is now the whole experience (see GalleryGrid for the
 * in-place paging).
 */
export default async function Gallery({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [items, totalPages] = await Promise.all([getWorksForPage(1), getTotalWorkPages()]);
  return (
    <section className="gallery" id="work">
      <div className="gallery-header">
        <p className="section-label">{dict.work.label}</p>
        <h2 className="section-title">{dict.work.title}</h2>
      </div>
      <GalleryGrid locale={locale} dict={dict} initialItems={items} totalPages={totalPages} />
    </section>
  );
}
