import { SustainIcon } from "../ui/BotanicalDeco";

export const Sustainability = ({ t, sectionRefs }) => (
  <section id="sustainability" ref={(el) => (sectionRefs.current.sustainability = el)} className="section">
    <div className="divider" />
    <div className="section-header reveal">
      <div className="section-overline">{t.sustainability.sectionLabel}</div>
      <h2 className="section-title">{t.sustainability.title}</h2>
      <p className="section-subtitle">{t.sustainability.subtitle}</p>
    </div>

    <div className="grid-3 reveal">
      {[
        { icon: "bcorp",   title: t.sustainability.bcorp,   desc: t.sustainability.bcorpDesc },
        { icon: "organic", title: t.sustainability.organic, desc: t.sustainability.organicDesc },
        { icon: "oldest",  title: t.sustainability.oldest,  desc: t.sustainability.oldestDesc },
        { icon: "bottle",  title: t.sustainability.bottle,  desc: t.sustainability.bottleDesc },
        { icon: "local",   title: t.sustainability.local,   desc: t.sustainability.localDesc },
        { icon: "leaf",    title: t.sustainability.gastro,  desc: t.sustainability.gastroDesc },
      ].map((item, i) => (
        <div key={i} className="card sustain-card">
          <div className="sustain-card__icon" aria-hidden="true"><SustainIcon type={item.icon} /></div>
          <h4 className="sustain-card__title">{item.title}</h4>
          <p className="sustain-card__desc">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
