import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { isPlaceholder, type WorksItem } from "@/data/projects";

export default function ProjectCard({
  project,
  locale,
  dict,
}: {
  project: WorksItem;
  locale: Locale;
  dict: Dictionary;
}) {
  if (isPlaceholder(project)) {
    return (
      <div className="gallery-card gallery-card-placeholder" aria-hidden="true">
        <div className="gallery-card-img gallery-card-placeholder-img">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <rect x="4" y="8" width="16" height="10" rx="2" />
            <circle cx="8" cy="19.5" r="1.5" />
            <circle cx="16" cy="19.5" r="1.5" />
            <path d="M8 8V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3" />
          </svg>
        </div>
        <div className="gallery-card-info">
          <span className="gallery-card-placeholder-text">{dict.work.comingSoon}</span>
        </div>
      </div>
    );
  }

  const t = project.translations[locale];
  return (
    <Link href={`/${locale}/works/${project.slug}/`} className="gallery-card">
      <div className="gallery-card-img">
        <img src={project.images[0]} alt={t.title} />
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
