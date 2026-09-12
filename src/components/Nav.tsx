import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import LocaleSwitcher from './LocaleSwitcher';

// Same address as the Contact section's mailto button. Kept as one real
// mailto link (not a "#contact" scroll-to anchor) so it's usable even on
// pages without a Contact section, and so its visible text on larger
// screens is the actual address — selectable/copyable for visitors who
// don't have a mail client configured, not just clickable.
const CONTACT_EMAIL = 'service@railway-atelier.studio';

// Plain inline envelope icon (currentColor, so it follows .nav-contact's
// color/hover) instead of another image asset.
function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="M3.5 5.5l8.5 7 8.5-7" />
    </svg>
  );
}

export default function Nav({
  locale,
  dict,
  pathWithoutLocale = '/',
}: {
  locale: Locale;
  dict: Dictionary;
  pathWithoutLocale?: string;
}) {
  return (
    <nav className="site-nav">
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* The full address doesn't fit next to the logo + locale switcher
              on phones (see .nav-contact-full in globals.css), so this is an
              icon there and switches to the real, visible email address from
              the tablet breakpoint up. Accessible name is the sr-only span
              below at every width, so screen readers announce the same
              thing regardless of which visual variant is showing. */}
          <a href={`mailto:${CONTACT_EMAIL}`} className="nav-contact">
            <span className="sr-only">{`${dict.contact.ctaEmail}: ${CONTACT_EMAIL}`}</span>
            <span className="nav-contact-icon" aria-hidden="true">
              <MailIcon />
            </span>
            <span className="nav-contact-full" aria-hidden="true">
              {CONTACT_EMAIL}
            </span>
          </a>
          <LocaleSwitcher
            locale={locale}
            pathWithoutLocale={pathWithoutLocale}
          />
        </div>
      </div>
    </nav>
  );
}
