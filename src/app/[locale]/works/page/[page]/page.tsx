import { notFound } from "next/navigation";
import { locales, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getTotalWorkPages } from "@/data/projects";
import WorksListing from "@/components/WorksListing";

// Pre-render one static route per locale for every page number from 2 up
// to the last page (page 1 has its own route at /[locale]/works/). This
// is the "pagination without a backend" piece: the page list is computed
// once at build time from the static `projects` array in src/data.
export function generateStaticParams() {
  const totalPages = getTotalWorkPages();
  const pages = Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => String(i + 2));
  return locales.flatMap((locale) => pages.map((page) => ({ locale, page })));
}

export default async function WorksPaginatedPage({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale, page: pageParam } = await params;
  if (!hasLocale(locale)) notFound();

  const totalPages = getTotalWorkPages();
  const page = Number(pageParam);
  if (!Number.isInteger(page) || page < 2 || page > totalPages) notFound();

  const dict = await getDictionary(locale);

  return <WorksListing locale={locale} dict={dict} page={page} />;
}
