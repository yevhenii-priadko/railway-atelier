import type { Locale } from "@/i18n/config";

// Same shape as before the migration to MongoDB (src/data/projects.ts) —
// kept identical on purpose so none of the rendering components (Gallery,
// ProjectCard, WorksListing, the project detail page) had to change their
// prop shapes, only where the data comes from.

export interface WorkTranslation {
  title: string;
  type: string;
  worksList: string[];
  summary: string;
  photoAlts: [string, string, string];
}

export interface Work {
  /** Mongo _id, as a string. */
  id: string;
  /** URL slug, also used as the stable sort key for prev/next navigation. */
  slug: string;
  maker: string;
  article: string;
  scale: string;
  /**
   * Exactly 3 photo URLs. Either a static path into /public (for the
   * originally-migrated projects, e.g. "/images/hero-engine.jpg") or
   * "/api/images/<id>" for anything uploaded later through /admin.
   */
  photos: [string, string, string];
  translations: Record<Locale, WorkTranslation>;
  /** Ascending sort order shown in the archive; set/changed only from /admin. */
  sortOrder: number;
}

/** Fields the admin form edits. `id` is absent for a new work. */
export interface WorkInput {
  slug: string;
  maker: string;
  article: string;
  scale: string;
  photos: [string, string, string];
  translations: Record<Locale, WorkTranslation>;
}
