import type { Locale } from "@/i18n/config";

// The motor a conversion was fitted with. Shown to Anton exactly as listed
// here (the "Двигун" select in /admin); turned into a lowercase
// "<name>-engine" URL segment only when building the work's public URL.
export const ENGINES = ["Maxon", "Faulhaber", "SBM"] as const;
export type Engine = (typeof ENGINES)[number];

export function isEngine(value: unknown): value is Engine {
  return typeof value === "string" && (ENGINES as readonly string[]).includes(value);
}

/** "Maxon" → "maxon-engine", "SBM" → "sbm-engine". */
export function engineSegment(engine: Engine): string {
  return `${engine.toLowerCase()}-engine`;
}

/** Path of a work's page after the locale, e.g. "/works/lilliput-131-302/maxon-engine/".
 *  Works whose engine hasn't been picked yet keep their old URL (no segment)
 *  until Anton sets one in /admin — nothing is guessed. */
export function workPathWithoutLocale(work: { slug: string; engine: Engine | null }): string {
  const base = `/works/${work.slug}/`;
  return work.engine ? `${base}${engineSegment(work.engine)}/` : base;
}

/** Full site-relative URL of a work's page, e.g. "/uk/works/lilliput-131-302/maxon-engine/". */
export function workPath(locale: Locale, work: { slug: string; engine: Engine | null }): string {
  return `/${locale}${workPathWithoutLocale(work)}`;
}
