import Image from 'next/image';
import type { Dictionary } from '@/i18n/dictionaries';

export default function About({ dict }: { dict: Dictionary }) {
  return (
    <section className="about" id="about">
      <div className="about-text">
        <p className="section-label">{dict.about.label}</p>
        <h2 className="section-title">{dict.about.title}</h2>
        <p className="section-tagline">{dict.about.tagline}</p>
        <p className="section-body">{dict.about.body1}</p>
        <p className="section-body">{dict.about.body2}</p>
        <div className="about-stats">
          {dict.about.stats.map((stat, i) => (
            <div key={i}>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="about-visual">
        {/* .about-visual sizes itself by aspect-ratio (changes per
            breakpoint — see globals.css), not a fixed pixel box, so `fill`
            fits better than a fixed width/height. Below the fold, so it
            keeps the default lazy loading (no `priority`). */}
        <Image
          src="/images/hero-engine.jpg"
          alt=""
          fill
          sizes="(min-width: 768px) 45vw, 100vw"
        />
      </div>
    </section>
  );
}
