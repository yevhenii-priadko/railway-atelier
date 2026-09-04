import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getWorksForPage } from "@/lib/works";
import ProjectCard from "./ProjectCard";

/**
 * Homepage teaser: a static grid of page 1 of the portfolio (up to
 * WORKS_PER_PAGE works, read from MongoDB so a work Anton adds in /admin
 * shows up here immediately) with a single link through to the full,
 * paginated archive at /works/. No pagination controls here — Eugene
 * asked for the homepage to stay a static showcase rather than repeat
 * the archive's pagination, since jumping straight from the homepage to
 * page 2+ felt like a jarring "yank" to a different page rather than a
 * natural next step.
 */
export default async function Gallery({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const featured = await getWorksForPage(1);
  return (
    <section className="gallery" id="work">
      <div className="gallery-header">
        <p className="section-label">{dict.work.label}</p>
        <h2 className="section-title">{dict.work.title}</h2>
      </div>
      <div className="gallery-grid">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} dict={dict} />
        ))}
      </div>
      <Link href={`/${locale}/works/`} className="gallery-more">
        {dict.work.viewAll} →
      </Link>
    </section>
  );
}
