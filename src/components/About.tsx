import type { Dictionary } from "@/i18n/dictionaries";

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
        <img src="/images/hero-engine.jpg" alt="" />
      </div>
    </section>
  );
}
