import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getProjectsForPage } from "@/data/projects";
import ProjectCard from "./ProjectCard";

/**
 * Homepage teaser: shows page 1 of the portfolio (the same static data
 * used for full pagination on /works/) with a link through to the full,
 * paginated archive.
 */
export default function Gallery({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const featured = getProjectsForPage(1);
  return (
    <section className="gallery" id="work">
      <div className="gallery-header">
        <p className="section-label">{dict.work.label}</p>
        <h2 className="section-title">{dict.work.title}</h2>
      </div>
      <div className="gallery-grid">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} />
        ))}
      </div>
      <Link href={`/${locale}/works/`} className="gallery-more">
        {dict.work.viewAll} →
      </Link>
    </section>
  );
}
