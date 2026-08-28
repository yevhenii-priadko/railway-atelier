import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export default function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
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
        <img src="/images/photo_hero_with.jpg" alt="" className="hero-img" />
      </div>
    </section>
  );
}
