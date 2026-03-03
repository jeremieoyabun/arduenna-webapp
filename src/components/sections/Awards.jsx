import { awardsData } from "../../data/cocktails";

const tierStyle = {
  gold:   { color: "#c9910a", bg: "rgba(212,165,116,0.10)", border: "rgba(212,165,116,0.30)" },
  silver: { color: "#7a8fa6", bg: "rgba(160,160,160,0.08)",  border: "rgba(160,160,160,0.25)"  },
  bronze: { color: "#a07040", bg: "rgba(194,139,106,0.08)",  border: "rgba(194,139,106,0.25)"  },
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
        const tier = tierStyle[a.tier] ?? tierStyle.bronze;
        return (
          <div
            key={i}
            className="card card--flat award-card"
            style={{
              borderTop: `3px solid ${tier.border}`,
              background: tier.bg,
              textAlign: "center",
              padding: "var(--space-8) var(--space-4)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Leaf decorations */}
            <img
              src="/icons/leaf-left.svg"
              alt=""
              style={{
                position: "absolute",
                left: 6, top: "50%",
                transform: "translateY(-50%)",
                height: "50%",
                width: "auto",
                opacity: 0.22,
                pointerEvents: "none",
              }}
            />
            <img
              src="/icons/leaf-right.svg"
              alt=""
              style={{
                position: "absolute",
                right: 6, top: "50%",
                transform: "translateY(-50%)",
                height: "50%",
                width: "auto",
                opacity: 0.22,
                pointerEvents: "none",
              }}
            />

            {/* Year — large */}
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: 36, fontWeight: 700,
              color: tier.color,
              lineHeight: 1, marginBottom: 8,
              position: "relative",
            }}>
              {a.year}
            </div>

            {/* Medal detail (Gold / Silver / etc) */}
            <div style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: tier.color,
              marginBottom: 10,
              position: "relative",
            }}>
              {a.detail}
            </div>

            {/* Thin separator */}
            <div style={{
              width: 32, height: 1,
              background: tier.border,
              margin: "0 auto 10px",
              position: "relative",
            }} />

            {/* Award name */}
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-base)",
              fontWeight: 500,
              color: "var(--text-primary)",
              lineHeight: 1.3,
              position: "relative",
            }}>
              {a.title}
            </div>
          </div>
        );
      })}
    </div>
  </section>
);
