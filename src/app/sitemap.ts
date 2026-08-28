import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { projects, getTotalWorkPages } from "@/data/projects";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const totalPages = getTotalWorkPages();
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

    for (const project of projects) {
      entries.push({
        url: `${SITE_URL}/${locale}/works/${project.slug}/`,
        changeFrequency: "yearly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
