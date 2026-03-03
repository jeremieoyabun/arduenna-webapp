import { useState } from "react";

export const Newsletter = ({ t }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire up to Mailchimp / Klaviyo / etc.
    setSubmitted(true);
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-section__inner">
        <h3 className="newsletter-section__title">{t.footer.newsletter}</h3>
        <p className="newsletter-section__desc">{t.footer.newsletterDesc}</p>

        {submitted ? (
          <p className="newsletter-section__success">{t.footer.newsletterSuccess}</p>
        ) : (
          <form className="newsletter-section__form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="newsletter-section__input"
              placeholder={t.footer.newsletterPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label={t.footer.newsletterPlaceholder}
            />
            <button type="submit" className="btn-primary newsletter-section__btn">
              {t.footer.newsletterCta}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
