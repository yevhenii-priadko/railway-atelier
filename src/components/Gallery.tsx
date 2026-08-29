import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getProjectsForPage, getTotalWorkPages } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import Pagination from "./Pagination";

/**
 * Homepage teaser: shows page 1 of the portfolio (the same static data
 * used for full pagination on /works/) with a link through to the full,
 * paginated archive. Pagination controls are repeated here (not just on
 * /works/) so visitors can jump straight to page 2+ without first
 * clicking through to the archive.
 */
export default function Gallery({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const featured = getProjectsForPage(1);
  const totalPages = getTotalWorkPages();
  return (
    <section className="gallery" id="work">
      <div className="gallery-header">
        <p className="section-label">{dict.work.label}</p>
        <h2 className="section-title">{dict.work.title}</h2>
      </div>
      <Pagination locale={locale} dict={dict} page={1} totalPages={totalPages} variant="top" />
      <div className="gallery-grid">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} dict={dict} />
        ))}
      </div>
      <Pagination locale={locale} dict={dict} page={1} totalPages={totalPages} />
      <Link href={`/${locale}/works/`} className="gallery-more">
        {dict.work.viewAll} →
      </Link>
    </section>
  );
}
