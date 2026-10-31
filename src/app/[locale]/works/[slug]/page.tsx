import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { hasLocale } from '@/i18n/config';
import { getWorkBySlug } from '@/lib/works';
import { workPath } from '@/lib/engines';
import ProjectDetail, { projectMetadata } from '@/components/ProjectDetail';

// The pre-engine URL, /[locale]/works/[slug]/. Once a work has an engine
// set in /admin, its real address gains a "<engine>-electric-motor-conversion" segment
// (/[locale]/works/[slug]/[engine]/) and this one permanently redirects
// there, so old links and indexed pages carry over. Works with no engine
// picked yet are still served here as before — nothing is guessed.
// Rendered dynamically (data lives in MongoDB, editable from /admin).
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
  return projectMetadata(locale, project);
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
  if (project.engine) permanentRedirect(workPath(locale, project));

  return <ProjectDetail locale={locale} project={project} />;
}
