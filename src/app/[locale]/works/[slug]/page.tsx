import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { projects, getProjectBySlug, getProjectNeighbors } from "@/data/projects";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// One static page per project x per locale. The prev/next chain below is
// derived from the order of `projects` in src/data/projects.ts, so it can
// never desync the way the old hand-edited HTML links did (BUG-001 /
// BUG-002 in bug-report-002.docx): reordering or adding a project just
// means editing that one array.
export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const t = project.translations[locale];
  return { title: `${t.title} · Railway Atelier` };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();

  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const dict = await getDictionary(locale);
  const t = project.translations[locale];
  const { prev, next } = getProjectNeighbors(slug);

  return (
    <>
      <Nav locale={locale} dict={dict} pathWithoutLocale={`/works/${slug}/`} />
      <section className="project">
        <div className="project-inner">
          <Link href={`/${locale}/works/`} className="project-back">
            {dict.projectDetail.back}
          </Link>

          <div className="project-header">
            <h1 className="project-title">{t.title}</h1>
            <p className="project-meta">
              {project.maker} · {project.article} · {project.scale}
            </p>
          </div>

          <div className="project-photos">
            <img
              src={project.images[0]}
              alt={t.photoAlts[0]}
              className="project-photo project-photo-main"
            />
            <img src={project.images[1]} alt={t.photoAlts[1]} className="project-photo" />
            <img src={project.images[2]} alt={t.photoAlts[2]} className="project-photo" />
          </div>

          <div className="project-works">
            <h2 className="project-works-title">{dict.projectDetail.worksTitle}</h2>
            <ul className="project-works-list">
              {t.worksList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <p className="project-summary">{t.summary}</p>

          <div className="project-navigation">
            {prev ? (
              <Link href={`/${locale}/works/${prev.slug}/`} className="project-nav-link">
                {dict.projectDetail.prevProject}
              </Link>
            ) : (
              <span className="project-nav-disabled">{dict.projectDetail.prevProject}</span>
            )}
            <Link href={`/${locale}/works/`} className="project-nav-link">
              {dict.projectDetail.allProjects}
            </Link>
            {next ? (
              <Link
                href={`/${locale}/works/${next.slug}/`}
                className="project-nav-link project-nav-next"
              >
                {dict.projectDetail.nextProject}
              </Link>
            ) : (
              <span className="project-nav-disabled">{dict.projectDetail.nextProject}</span>
            )}
          </div>
        </div>
      </section>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
