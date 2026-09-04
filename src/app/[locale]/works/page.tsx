import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import WorksListing from "@/components/WorksListing";

// Page 1 of the works archive lives at /[locale]/works/ (no page number in
// the URL). Pages 2+ live at /[locale]/works/page/[page]/.
//
// Reads from MongoDB (via WorksListing -> src/lib/works.ts) — rendered
// per-request, not pre-rendered at build time.
export const dynamic = "force-dynamic";

export default async function WorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return <WorksListing locale={locale} dict={dict} page={1} />;
}
