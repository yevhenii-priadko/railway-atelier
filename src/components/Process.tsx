import type { Dictionary } from "@/i18n/dictionaries";

export default function Process({ dict }: { dict: Dictionary }) {
  return (
    <section className="process" id="process">
      <div className="process-header">
        <p className="section-label">{dict.process.label}</p>
        <h2 className="section-title">{dict.process.title}</h2>
      </div>
      <div className="process-steps">
        {dict.process.steps.map((step, i) => (
          <div className="process-step" key={i}>
            <div className="step-dot">
              <span className="step-dot-num">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="step-content">
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
