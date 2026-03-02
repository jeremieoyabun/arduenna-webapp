import { IconLock, IconBell } from "../ui/Icons";

export const Teasers = ({ t, teaserNotifs, setTeaserNotifs }) => (
  <section className="section">
    <div className="divider" />
    <div className="section-header reveal">
      <div className="section-overline">{t.teasers.sectionLabel}</div>
    </div>

    <div className="grid-4 reveal">
      {[
        { key: "academy", title: t.teasers.academyTitle, desc: t.teasers.academyDesc },
        { key: "finder", title: t.teasers.finderTitle, desc: t.teasers.finderDesc },
        { key: "cellar", title: t.teasers.cellarTitle, desc: t.teasers.cellarDesc },
        { key: "events", title: t.teasers.eventsTitle, desc: t.teasers.eventsDesc },
      ].map((item) => (
        <div key={item.key} className="card teaser-card">
          <div className="teaser-card__lock" aria-hidden="true"><IconLock /></div>
          <h4 className="teaser-card__title">{item.title}</h4>
          <p className="teaser-card__desc">{item.desc}</p>
          <button
            className={`${teaserNotifs[item.key] ? "btn-ghost" : "btn-primary"} btn-sm btn-full`}
            onClick={() => setTeaserNotifs((prev) => ({ ...prev, [item.key]: true }))}
          >
            {teaserNotifs[item.key] ? t.teasers.notified : (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)" }}>
                <IconBell /> {t.teasers.notifyMe}
              </span>
            )}
          </button>
        </div>
      ))}
    </div>
  </section>
);
