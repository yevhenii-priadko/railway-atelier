import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Nav({
  locale,
  dict,
  pathWithoutLocale = "/",
}: {
  locale: Locale;
  dict: Dictionary;
  pathWithoutLocale?: string;
}) {
  return (
    <nav>
      <div className="nav-inner">
        <Link href={`/${locale}/`} className="nav-logo">
          <img src="/images/logo.svg" width={220} alt="Railway Atelier" />
        </Link>
        <ul className="nav-links">
          <li>
            <Link href={`/${locale}/#about`}>{dict.nav.about}</Link>
          </li>
          <li>
            <Link href={`/${locale}/#services`}>{dict.nav.services}</Link>
          </li>
          <li>
            <Link href={`/${locale}/#process`}>{dict.nav.process}</Link>
          </li>
          <li>
            <Link href={`/${locale}/#work`}>{dict.nav.work}</Link>
          </li>
        </ul>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link href={`/${locale}/#contact`} className="nav-contact">
            {dict.nav.contact}
          </Link>
          <LocaleSwitcher locale={locale} pathWithoutLocale={pathWithoutLocale} />
        </div>
      </div>
    </nav>
  );
}
