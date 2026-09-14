import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

// Same address as the header and the Contact section's mailto button. The
// footer has room to show it in full at any width, so — unlike the header —
// it's just always the visible link text here: a real mailto link that
// visitors can also select/copy without needing a mail client configured.
const CONTACT_EMAIL = 'service@railway-atelier.studio';

export default function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <>
      <div className="tiffany-rule" />
      <footer>
        <div className="footer-logo">
          {/* Same reasoning as Nav's logo: it's a small SVG, so it skips
              Next's raster optimizer (unoptimized) instead of needing
              dangerouslyAllowSVG. 160×40 keeps the logo's actual 4:1 ratio
              (280×70 viewBox) at the same visible size as before. */}
          <Image
            src="/images/logo.svg"
            alt="Railway Atelier"
            width={160}
            height={40}
            unoptimized
          />
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
              <a href={`mailto:${CONTACT_EMAIL}`} className="footer-email">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
          <span className="footer-copy">{dict.footer.copy}</span>
        </div>
      </footer>
    </>
  );
}
