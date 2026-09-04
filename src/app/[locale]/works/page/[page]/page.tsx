import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getTotalWorkPages } from "@/lib/works";
import WorksListing from "@/components/WorksListing";

// Rendered dynamically now (data lives in MongoDB and changes whenever
// Anton adds/edits/removes a work in /admin — no rebuild, so no
// generateStaticParams / pre-rendering here anymore).
export const dynamic = "force-dynamic";

export default async function WorksPaginatedPage({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale, page: pageParam } = await params;
  if (!hasLocale(locale)) notFound();

  const totalPages = await getTotalWorkPages();
  const page = Number(pageParam);
  if (!Number.isInteger(page) || page < 2 || page > totalPages) notFound();

  const dict = await getDictionary(locale);

  return <WorksListing locale={locale} dict={dict} page={page} />;
}
