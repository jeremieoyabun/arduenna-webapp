import { awardsData } from "../../data/cocktails";

export const Awards = ({ t }) => (
  <section className="section">
    <div className="divider" />
    <div className="section-header reveal">
      <div className="section-overline">{t.awards.sectionLabel}</div>
      <h2 className="section-title">{t.awards.title}</h2>
    </div>

    <div className="grid-3 reveal">
      {awardsData.map((a, i) => (
        <div key={i} className="card card--flat award-card">
          <div className="award-card__year">{a.year}</div>
          <div className="award-card__title">{a.title}</div>
          <div className="award-card__detail">{a.detail}</div>
        </div>
      ))}
    </div>
  </section>
);
