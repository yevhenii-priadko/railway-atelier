import Link from "next/link";
import { locales, type Locale } from "@/i18n/config";

// Flags instead of text labels (UA/EN/DE) — an experiment Eugene asked for:
// small semi-transparent circular badges that go fully opaque on hover/
// active, rather than mono/uppercase text links. Full language names are
// kept for screen readers and the hover tooltip via aria-label/title.
const LOCALE_FLAG: Record<Locale, string> = { uk: "🇺🇦", en: "🇬🇧", de: "🇩🇪" };
const LOCALE_FULL_NAME: Record<Locale, string> = { uk: "Українська", en: "English", de: "Deutsch" };

/**
 * Swaps only the locale segment of the current path, so switching
 * language from a project page or a paginated works page keeps you on
 * the equivalent page in the other language.
 */
export default function LocaleSwitcher({
  locale,
  pathWithoutLocale,
}: {
  locale: Locale;
  pathWithoutLocale: string;
}) {
  return (
    <div className="locale-switcher">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${pathWithoutLocale}`}
          className="locale-link"
          aria-current={l === locale}
          aria-label={LOCALE_FULL_NAME[l]}
          title={LOCALE_FULL_NAME[l]}
        >
          <span aria-hidden="true">{LOCALE_FLAG[l]}</span>
        </Link>
      ))}
    </div>
  );
}
