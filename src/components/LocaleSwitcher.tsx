import Link from "next/link";
import { locales, localeNames, type Locale } from "@/i18n/config";

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
      {locales.map((l, i) => (
        <span key={l} style={{ display: "contents" }}>
          {i > 0 && <span className="locale-sep">/</span>}
          <Link
            href={`/${l}${pathWithoutLocale}`}
            className="locale-link"
            aria-current={l === locale}
          >
            {localeNames[l]}
          </Link>
        </span>
      ))}
    </div>
  );
}
