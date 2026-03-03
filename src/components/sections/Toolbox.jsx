import { IconDownload } from "../ui/Icons";

export const Toolbox = ({ t, sectionRefs }) => (
  <section id="toolbox" ref={(el) => (sectionRefs.current.toolbox = el)} className="section">
    <div className="divider" />
    <div className="section-header reveal">
      <div className="section-overline">{t.toolbox.sectionLabel}</div>
      <h2 className="section-title">{t.toolbox.title}</h2>
      <p className="section-subtitle">{t.toolbox.subtitle}</p>
    </div>

    <div className="grid-3 reveal">
      {[
        { title: t.toolbox.logos,         desc: t.toolbox.logosDesc,         ready: true  },
        { title: t.toolbox.photos,        desc: t.toolbox.photosDesc,        ready: true  },
        { title: t.toolbox.sheets,        desc: t.toolbox.sheetsDesc,        ready: true  },
        { title: t.toolbox.salesKit,      desc: t.toolbox.salesKitDesc,      ready: false },
        { title: t.toolbox.videos,        desc: t.toolbox.videosDesc,        ready: false },
        { title: t.toolbox.staffTraining, desc: t.toolbox.staffTrainingDesc, ready: false },
      ].map((item, i) => (
        <div key={i} className="card toolbox-card">
          <div className="toolbox-card__icon" aria-hidden="true"><IconDownload /></div>
          <h4 className="toolbox-card__title">{item.title}</h4>
          <p className="toolbox-card__desc">{item.desc}</p>
          <button className={`${item.ready ? "btn-primary" : "btn-ghost"} btn-sm btn-full`}>
            {item.ready ? t.toolbox.download : t.toolbox.comingSoon}
          </button>
        </div>
      ))}
    </div>

    <p className="caption reveal" style={{ textAlign: "center", marginTop: "var(--space-6)" }}>
      {t.toolbox.contact}
    </p>
  </section>
);
