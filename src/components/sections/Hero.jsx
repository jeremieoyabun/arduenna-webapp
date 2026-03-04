export const Hero = ({ t, sectionRefs, scrollTo }) => {
  return (
    <section id="hero" ref={(el) => (sectionRefs.current.hero = el)} className="hero">
      <div className="hero__inner">
        <div className="hero__text">
          <h1 className="hero__heading">
            <span className="hero__heading-main">{t.hero.tagline}</span>
            <span className="hero__heading-italic">
              <span className="hero__dash" aria-hidden="true">—</span>
              <em>{t.hero.tagline2}</em>
              <span className="hero__dash" aria-hidden="true">—</span>
            </span>
          </h1>
          <p className="hero__subtitle">{t.hero.subtitle}</p>
        </div>

        <div className="hero__visual">
          <img
            src="/Arduenna_Bouteille_50CL-V2.avif"
            alt="Arduenna Gin bottle"
            className="hero__bottle"
            width="260"
            height="780"
          />
        </div>

        <button className="hero__cta btn-primary" onClick={() => scrollTo("products")}>
          {t.hero.cta}
        </button>
      </div>
    </section>
  );
};
