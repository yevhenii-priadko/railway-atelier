import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getWorksForPage, getTotalWorkPages } from "@/lib/works";
import Nav from "./Nav";
import Footer from "./Footer";
import ProjectCard from "./ProjectCard";
import Pagination from "./Pagination";

export default async function WorksListing({
  locale,
  dict,
  page,
}: {
  locale: Locale;
  dict: Dictionary;
  page: number;
}) {
  const [totalPages, items] = await Promise.all([getTotalWorkPages(), getWorksForPage(page)]);
  const pathWithoutLocale = page === 1 ? "/works/" : `/works/page/${page}/`;

  return (
    <>
      <Nav locale={locale} dict={dict} pathWithoutLocale={pathWithoutLocale} />
      <section className="works-page">
        <Link href={`/${locale}/`} className="works-page-back">
          {dict.worksPage.back}
        </Link>
        <div className="works-page-header">
          <p className="section-label">{dict.work.label}</p>
          <h1 className="section-title">{dict.worksPage.title}</h1>
        </div>
        <Pagination locale={locale} dict={dict} page={page} totalPages={totalPages} variant="top" />
        <div className="works-grid">
          {items.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} dict={dict} />
          ))}
        </div>
        <Pagination locale={locale} dict={dict} page={page} totalPages={totalPages} />
      </section>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
