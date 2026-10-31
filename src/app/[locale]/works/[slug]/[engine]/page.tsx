import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { hasLocale } from '@/i18n/config';
import { getWorkBySlug } from '@/lib/works';
import { engineSegment, workPath } from '@/lib/engines';
import ProjectDetail, { projectMetadata } from '@/components/ProjectDetail';

// Canonical work URL once an engine is set: /[locale]/works/[slug]/[engine]/,
// e.g. /uk/works/lilliput-131-302/maxon-electric-motor-conversion/. The segment is derived from
// the work's stored engine on every request (src/lib/engines.ts) — it isn't
// stored separately, so changing the engine in /admin moves the page with
// no record being recreated.
export const dynamic = 'force-dynamic';

type Params = Promise<{ locale: string; slug: string; engine: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const project = await getWorkBySlug(slug);
  if (!project) return {};
  return projectMetadata(locale, project);
}

export default async function ProjectEnginePage({ params }: { params: Params }) {
  const { locale, slug, engine } = await params;
  if (!hasLocale(locale)) notFound();

  const project = await getWorkBySlug(slug);
  if (!project) notFound();

  // No engine picked yet: this URL doesn't exist for the work.
  if (!project.engine) notFound();

  // Engine changed since a link was published (or a wrong/uppercase
  // segment like "Maxon-Engine"): send it to the current address.
  if (engine !== engineSegment(project.engine)) {
    permanentRedirect(workPath(locale, project));
  }

  return <ProjectDetail locale={locale} project={project} />;
}
