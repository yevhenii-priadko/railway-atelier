import type { Dictionary } from "@/i18n/dictionaries";

export default function Contact({ dict }: { dict: Dictionary }) {
  return (
    <section className="contact" id="contact">
      <p className="section-label">{dict.contact.label}</p>
      <h2 className="section-title">{dict.contact.title}</h2>
      <p className="section-body">
        {dict.contact.bodyLine1}
        <br />
        {dict.contact.bodyLine2}
      </p>
      <p className="contact-quote">{dict.contact.quote}</p>
      <div className="contact-links">
        <a href="mailto:workshop@ironandmotion.com" className="btn-primary">
          {dict.contact.ctaEmail}
        </a>
        <a href="tel:+380000000000" className="btn-outline">
          {dict.contact.ctaPhone}
        </a>
      </div>
    </section>
  );
}
