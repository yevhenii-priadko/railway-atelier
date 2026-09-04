import Link from "next/link";
import type { ComponentType } from "react";
import { locales, type Locale } from "@/i18n/config";

const LOCALE_FULL_NAME: Record<Locale, string> = { uk: "Українська", en: "English", de: "Deutsch" };

// Small inline SVGs instead of Unicode flag emoji (🇺🇦/🇬🇧/🇩🇪). Windows
// doesn't ship the regional-indicator flag glyphs its emoji font would
// need, so Chrome/Edge there fell back to plain two-letter text (UA/GB/DE)
// instead of an actual flag — these render identically on every platform.
// preserveAspectRatio="xMidYMid slice" makes each flag (all wider than the
// 1:1 circle it sits in) fill the whole circle and crop the overflow,
// instead of the SVG default (letterbox "meet", which left bare strips of
// the page background above and below the flag — Anton flagged this).
function FlagUA() {
  return (
    <svg viewBox="0 0 3 2" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="3" height="1" fill="#0057B7" />
      <rect width="3" height="1" y="1" fill="#FFD700" />
    </svg>
  );
}

function FlagGB() {
  return (
    <svg viewBox="0 0 60 30" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30,0 V30 M0,15 H60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function FlagDE() {
  return (
    <svg viewBox="0 0 3 2" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="3" height="0.667" fill="#000000" />
      <rect width="3" height="0.667" y="0.667" fill="#DD0000" />
      <rect width="3" height="0.667" y="1.333" fill="#FFCE00" />
    </svg>
  );
}

const LOCALE_FLAG: Record<Locale, ComponentType> = { uk: FlagUA, en: FlagGB, de: FlagDE };

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
      {locales.map((l) => {
        const Flag = LOCALE_FLAG[l];
        return (
          <Link
            key={l}
            href={`/${l}${pathWithoutLocale}`}
            className="locale-link"
            aria-current={l === locale}
            aria-label={LOCALE_FULL_NAME[l]}
            title={LOCALE_FULL_NAME[l]}
          >
            <Flag />
          </Link>
        );
      })}
    </div>
  );
}
