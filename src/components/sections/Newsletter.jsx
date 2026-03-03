import { useState } from "react";

export const Newsletter = ({ t }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error("error");
      setSubmitted(true);
    } catch {
      setError(t.footer.newsletterError ?? "Une erreur est survenue, réessayez.");
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
              aria-label={t.footer.newsletterPlaceholder}
            />
            <button
              type="submit"
              className="btn-primary newsletter-section__btn"
              disabled={loading}
            >
              {loading ? "…" : t.footer.newsletterCta}
            </button>
          </form>
        )}
        {error && <p className="newsletter-section__error">{error}</p>}
      </div>
    </section>
  );
};
