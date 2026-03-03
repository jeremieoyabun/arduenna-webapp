export const Hero = ({ t, sectionRefs, scrollTo }) => (
  <section id="hero" ref={(el) => (sectionRefs.current.hero = el)} className="hero">
    {/* Pine illustrations — decorative background */}
    <img
      src="/Sapin-illu.webp"
      alt=""
      aria-hidden="true"
      className="hero__pine hero__pine--left"
    />
    <img
      src="/Sapin-illu-02.webp"
      alt=""
      aria-hidden="true"
      className="hero__pine hero__pine--right"
    />
    <img
      src="/pin-illu-01.webp"
      alt=""
      aria-hidden="true"
      className="hero__pine hero__pine--topleft"
    />

    <div className="hero__content">
      <div className="hero__text">
        <div className="hero__brand-mark">ARDUENNA</div>
        <h1 className="hero__heading">
          <span className="hero__heading-main">{t.hero.tagline}</span>
          <span className="hero__heading-italic">
            — <em>{t.hero.tagline2}</em> —
          </span>
        </h1>

        <p className="hero__subtitle">{t.hero.subtitle}</p>

        <button className="btn-primary" onClick={() => scrollTo("products")} style={{ padding: "16px 40px" }}>
          {t.hero.cta}
        </button>
      </div>

      <div className="hero__visual">
        <img
          src="/Arduenna_Bouteille_50CL-V2.avif"
          alt="Arduenna Gin bottle"
          className="hero__bottle"
        />
      </div>
    </div>
  </section>
);
