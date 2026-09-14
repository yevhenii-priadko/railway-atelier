import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getWorkBySlug, getWorkNeighbors } from '@/lib/works';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { imageSrc } from '@/lib/image-url';

// Rendered dynamically now (data lives in MongoDB, editable from /admin —
// no build-time list of slugs to pre-render). The prev/next chain below is
// still derived from stored order (sortOrder in Mongo, edited via the
// reorder buttons in /admin), so it still can't desync the way the old
// hand-edited HTML links did (BUG-001 / BUG-002 in bug-report-002.docx).
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const project = await getWorkBySlug(slug);
  if (!project) return {};
  const t = project.translations[locale];
  return {
    title: `${t.title} · Railway Atelier`,
    description: t.summary,
    alternates: { canonical: `/${locale}/works/${slug}/` },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();

  const project = await getWorkBySlug(slug);
  if (!project) notFound();

  const dict = await getDictionary(locale);
  const t = project.translations[locale];
  const { prev, next } = await getWorkNeighbors(slug);

  return (
    <>
      <Nav locale={locale} dict={dict} pathWithoutLocale={`/works/${slug}/`} />
      <section className="project">
        <div className="project-inner">
          {/* /works/ (the standalone archive listing) is gone — the archive
              now lives on the homepage itself, so "back"/"all projects"
              point at its #work section instead. */}
          <Link href={`/${locale}/#work`} className="project-back">
            {dict.projectDetail.back}
          </Link>

          <div className="project-header">
            <h1 className="project-title">{t.title}</h1>
            <p className="project-meta">
              {project.maker} · {project.article} · {project.scale}
            </p>
          </div>

          {/* Photos are admin-uploaded (arbitrary real dimensions), and each
              box's aspect ratio/height is CSS-driven and changes per
              breakpoint (see .project-photo in globals.css) — `fill` sizes
              to whatever that box turns out to be instead of guessing a
              width/height. object-fit has to move to each Image's own
              `style` now that .project-photo is the wrapper div, not the
              img. The main photo is this page's LCP candidate. */}
          <div className="project-photos">
            <div className="project-photo project-photo-main">
              <Image
                src={imageSrc(project.photos[0])}
                alt={t.photoAlts[0]}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
            </div>
            <div className="project-photo">
              <Image
                src={imageSrc(project.photos[1])}
                alt={t.photoAlts[1]}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(min-width: 768px) 25vw, 100vw"
              />
            </div>
            <div className="project-photo">
              <Image
                src={imageSrc(project.photos[2])}
                alt={t.photoAlts[2]}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(min-width: 768px) 25vw, 100vw"
              />
            </div>
          </div>

          <div className="project-works">
            <h2 className="project-works-title">
              {dict.projectDetail.worksTitle}
            </h2>
            <ul className="project-works-list">
              {t.worksList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <p className="project-summary">{t.summary}</p>

          <div className="project-navigation">
            {prev ? (
              <Link
                href={`/${locale}/works/${prev.slug}/`}
                className="project-nav-link"
              >
                {dict.projectDetail.prevProject}
              </Link>
            ) : (
              <span className="project-nav-disabled">
                {dict.projectDetail.prevProject}
              </span>
            )}
            <Link href={`/${locale}/#work`} className="project-nav-link">
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
              <span className="project-nav-disabled">
                {dict.projectDetail.nextProject}
              </span>
            )}
          </div>
        </div>
      </section>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
