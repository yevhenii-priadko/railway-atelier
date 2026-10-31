import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getAllWorkUrlParts } from "@/lib/works";
import { workPath } from "@/lib/engines";

// Was force-static (data used to be a build-time array); now the archive
// changes whenever Anton adds/removes a work in /admin, so the sitemap is
// regenerated per request instead of frozen at the last build.
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const works = await getAllWorkUrlParts();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${SITE_URL}/${locale}/`,
      changeFrequency: "monthly",
      priority: 1.0,
    });

    // The paginated archive listing (/works/, /works/page/2/, ...) is gone
    // — it's the homepage's #work section now, already covered above.

    // Same URL builder as the gallery links and canonical tags, so the
    // sitemap always lists each work's current address (with its
    // "<engine>-electric-motor-conversion" segment once one is set in /admin).
    for (const work of works) {
      entries.push({
        url: `${SITE_URL}${workPath(locale, work)}`,
        changeFrequency: "yearly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
