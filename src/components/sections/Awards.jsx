import { awardsData } from "../../data/cocktails";

const tierStyle = {
  gold:   { color: "#c9910a", bg: "rgba(212,165,116,0.08)", border: "rgba(212,165,116,0.25)" },
  silver: { color: "#7a8fa6", bg: "rgba(160,160,160,0.06)", border: "rgba(160,160,160,0.20)" },
  bronze: { color: "#a07040", bg: "rgba(194,139,106,0.06)", border: "rgba(194,139,106,0.20)" },
};

export const Awards = ({ t }) => (
  <section className="section">
    <div className="divider" />
    <div className="section-header reveal">
      <div className="section-overline">{t.awards.sectionLabel}</div>
      <h2 className="section-title">{t.awards.title}</h2>
    </div>

    <div className="grid-4 reveal">
      {awardsData.map((a, i) => {
        const tier = tierStyle[a.tier] ?? tierStyle.bronze;
        return (
          <div
            key={i}
            className={`card card--flat reveal reveal--delay-${(i % 3) + 1}`}
            style={{
              borderLeft: `3px solid ${tier.border}`,
              background: tier.bg,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            {/* Year circle */}
            <div style={{
              width: 48, height: 48,
              borderRadius: "50%",
              border: `1.5px solid ${tier.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: 15, fontWeight: 600,
                color: tier.color,
                lineHeight: 1,
              }}>
                {a.year}
              </span>
            </div>

            {/* Text */}
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: 14, fontWeight: 500,
                color: "var(--text-primary)",
                lineHeight: 1.25,
                marginBottom: 3,
              }}>
                {a.title}
              </div>
              <div style={{
                fontFamily: "var(--font-body)",
                fontSize: 11, fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: tier.color,
              }}>
                {a.detail}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);
