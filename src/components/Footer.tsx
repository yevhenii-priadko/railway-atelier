import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <>
      <div className="tiffany-rule" />
      <footer>
        <div className="footer-logo">
          <img src="/images/logo.svg" alt="Railway Atelier" height={40} />
        </div>
        <div className="footer-bottom-row">
          <ul className="footer-links">
            <li>
              <Link href={`/${locale}/#about`}>{dict.footer.about}</Link>
            </li>
            <li>
              <Link href={`/${locale}/#services`}>{dict.footer.services}</Link>
            </li>
            <li>
              <Link href={`/${locale}/#work`}>{dict.footer.work}</Link>
            </li>
            <li>
              <Link href={`/${locale}/#contact`}>{dict.footer.contact}</Link>
            </li>
          </ul>
          <span className="footer-copy">{dict.footer.copy}</span>
        </div>
      </footer>
    </>
  );
}
