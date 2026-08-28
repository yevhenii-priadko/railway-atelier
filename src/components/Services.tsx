import type { Dictionary } from "@/i18n/dictionaries";

export default function Services({ dict }: { dict: Dictionary }) {
  return (
    <section className="services" id="services">
      <div className="services-inner">
        <div className="services-header">
          <div>
            <p className="section-label">{dict.services.label}</p>
            <h2 className="section-title">{dict.services.title}</h2>
          </div>
        </div>
        <div className="services-list">
          {dict.services.items.map((item, i) => (
            <div className="service-card" key={i}>
              <p className="service-num">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="service-title">{item.title}</h3>
              <p className="service-desc">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="services-note">{dict.services.note}</p>
      </div>
    </section>
  );
}
