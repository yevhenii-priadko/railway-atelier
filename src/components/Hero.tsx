import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export default function Hero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="hero">
      <div className="hero-left">
        <p className="hero-eyebrow">{dict.hero.eyebrow}</p>
        <h1 className="hero-title">
          {dict.hero.titleLine1}
          <br />
          {dict.hero.titleLine2}
          <br />
          {dict.hero.titleLine3}
        </h1>
        <p className="hero-desc">{dict.hero.desc}</p>
        <a href={`/${locale}/#services`} className="hero-cta">
          {dict.hero.cta}
        </a>
        <blockquote className="hero-quote">{dict.hero.quote}</blockquote>
      </div>
      <div className="hero-right">
        {/* .hero-right's own height is viewport-relative (60vw on mobile,
            fluid on desktop — see globals.css), not a fixed pixel box, so
            `fill` (sizing to whatever that box turns out to be) fits better
            here than a fixed width/height. It's the LCP candidate on every
            page load, hence `priority` instead of the default lazy load. */}
        <Image
          src="/images/photo_hero_with.webp"
          alt=""
          fill
          className="hero-img"
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
        />
      </div>
    </section>
  );
}
