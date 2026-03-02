import { BotanicalDeco } from "../ui/BotanicalDeco";

export const Hero = ({ t, sectionRefs, scrollTo }) => (
  <section id="hero" ref={(el) => (sectionRefs.current.hero = el)} className="hero">
    <BotanicalDeco style={{ top: "10%", left: "-5%", width: 200, transform: "rotate(-15deg)" }} />
    <BotanicalDeco style={{ top: "15%", right: "-3%", width: 160, transform: "rotate(20deg) scaleX(-1)" }} />

    <div className="hero__content">
      <div className="hero__text">
        <h1 className="hero__heading">
          <span style={{ display: "block" }}>{t.hero.tagline}</span>
          <span style={{ display: "block", fontStyle: "italic" }}>
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
