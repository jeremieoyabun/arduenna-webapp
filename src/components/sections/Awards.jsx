import { awardsData } from "../../data/cocktails";

const tierIcon = {
  gold:   { emoji: "🥇", color: "#c9910a", bg: "rgba(212,165,116,0.12)", border: "rgba(212,165,116,0.35)" },
  silver: { emoji: "🥈", color: "#7a8fa6", bg: "rgba(160,160,160,0.1)",  border: "rgba(160,160,160,0.3)"  },
  bronze: { emoji: "🥉", color: "#a07040", bg: "rgba(194,139,106,0.1)",  border: "rgba(194,139,106,0.3)"  },
};

export const Awards = ({ t }) => (
  <section className="section">
    <div className="divider" />
    <div className="section-header reveal">
      <div className="section-overline">{t.awards.sectionLabel}</div>
      <h2 className="section-title">{t.awards.title}</h2>
    </div>

    <div className="grid-3 reveal">
      {awardsData.map((a, i) => {
        const tier = tierIcon[a.tier] ?? tierIcon.bronze;
        return (
          <div
            key={i}
            className="card card--flat award-card"
            style={{
              borderTop: `3px solid ${tier.border}`,
              background: tier.bg,
              textAlign: "center",
              padding: "var(--space-8) var(--space-6)",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: "var(--space-3)", lineHeight: 1 }}>
              {tier.emoji}
            </div>
            <div className="award-card__detail" style={{ color: tier.color, fontWeight: 700, fontSize: "var(--text-sm)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "var(--space-2)" }}>
              {a.detail}
            </div>
            <div className="award-card__title" style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 500, color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>
              {a.title}
            </div>
            <div className="award-card__year" style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", fontFamily: "var(--font-body)", letterSpacing: "0.1em" }}>
              {a.year}
            </div>
          </div>
        );
      })}
    </div>
  </section>
);
