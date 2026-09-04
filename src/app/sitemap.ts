import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getAllWorkSlugs, getTotalWorkPages } from "@/lib/works";

// Was force-static (data used to be a build-time array); now the archive
// changes whenever Anton adds/removes a work in /admin, so the sitemap is
// regenerated per request instead of frozen at the last build.
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [totalPages, slugs] = await Promise.all([getTotalWorkPages(), getAllWorkSlugs()]);
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${SITE_URL}/${locale}/`,
      changeFrequency: "monthly",
      priority: 1.0,
    });

    for (let page = 1; page <= totalPages; page++) {
      entries.push({
        url: page === 1 ? `${SITE_URL}/${locale}/works/` : `${SITE_URL}/${locale}/works/page/${page}/`,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const slug of slugs) {
      entries.push({
        url: `${SITE_URL}/${locale}/works/${slug}/`,
        changeFrequency: "yearly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
