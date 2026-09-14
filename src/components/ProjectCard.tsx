import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Work } from '@/lib/work-types';
import { imageSrc } from '@/lib/image-url';

export default function ProjectCard({
  project,
  locale,
}: {
  project: Work;
  locale: Locale;
  dict: Dictionary;
}) {
  const t = project.translations[locale];
  return (
    <Link href={`/${locale}/works/${project.slug}/`} className="gallery-card">
      <div className="gallery-card-img">
        {/* Photos are admin-uploaded, so their real dimensions vary — fill
            the fixed-aspect-ratio box (see .gallery-card-img in globals.css)
            rather than guessing a width/height. Below the fold, so this
            keeps the default lazy loading. */}
        <Image
          src={imageSrc(project.photos[0])}
          alt={t.title}
          fill
          sizes="(min-width: 1025px) 370px, 50vw"
        />
      </div>
      <div className="gallery-card-info">
        <div className="gallery-card-maker">
          {project.maker} · {project.article}
        </div>
        <span className="gallery-card-title">{t.title}</span>
        <div className="gallery-card-meta">
          <span className="gallery-card-type">{t.type}</span>
          <span className="gallery-card-scale">{project.scale}</span>
        </div>
      </div>
    </Link>
  );
}
