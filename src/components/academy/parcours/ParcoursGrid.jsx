import { parcoursData } from "../../../data/academy/parcours";
import { modulesData } from "../../../data/academy/modules";

const PARCOURS_ICONS = {
  univers: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 22" /><path d="M9.04 9.01s.38-4.21 4.96-5.01" />
      <path d="M13.83 14.54s3.75-1.74 5.17.46" /><path d="M16 4s3 0 4 3-2.5 4.5-2.5 4.5" />
      <path d="M20 9.5c1 .5 2 2 2 4" />
    </svg>
  ),
  gamme: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2h8l-2 7h4L10 22l2-9H8z" />
    </svg>
  ),
  cocktail: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 22h8" /><path d="M12 11v11" /><path d="M5 3l7 8 7-8" />
    </svg>
  ),
  vente: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 7.65l.78.77L12 20.64l7.64-7.64.78-.77a5.4 5.4 0 000-7.65z" />
    </svg>
  ),
};

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(11,54,61,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

export const ParcoursGrid = ({ onSelectParcours, getParcoursCompletedCount }) => {
  const cardStyle = {
    background: "#ffffff",
    borderRadius: 12,
    padding: "18px 20px",
    border: "1px solid rgba(11,54,61,0.08)",
    boxShadow: "0 2px 12px rgba(11,54,61,0.03)",
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    gap: 16,
  };

  return (
    <div style={{ padding: "28px 20px" }}>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 22, fontWeight: 400, fontStyle: "italic",
        color: "#0b363d", marginBottom: 6,
      }}>
        Parcours d'apprentissage
      </h2>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        color: "rgba(11,54,61,0.45)", marginBottom: 24,
      }}>
        Maîtrisez l'univers Arduenna étape par étape
      </p>

      {parcoursData.map((p, i) => {
        const isPlayable = p.id === "univers";
        const moduleCount = modulesData.filter(m => m.parcoursId === p.id).length;
        const completedCount = isPlayable ? (getParcoursCompletedCount?.(p.id) || 0) : 0;
        const percent = moduleCount > 0 ? Math.round((completedCount / moduleCount) * 100) : 0;

        return (
          <div
            key={p.id}
            onClick={isPlayable ? () => onSelectParcours(p.id) : undefined}
            style={{
              ...cardStyle,
              opacity: isPlayable ? 1 : 0.6,
              cursor: isPlayable ? "pointer" : "default",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Icon */}
            <div style={{
              width: 48, height: 48, borderRadius: 12, flexShrink: 0,
              background: isPlayable ? "rgba(194,116,74,0.08)" : "rgba(11,54,61,0.04)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: isPlayable ? "#c2744a" : "rgba(11,54,61,0.25)",
            }}>
              {PARCOURS_ICONS[p.id]}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 15,
                fontWeight: 600, color: "#0b363d", marginBottom: 3,
              }}>
                {p.titleFr}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                color: "rgba(11,54,61,0.5)", marginBottom: 6,
              }}>
                {p.descFr}
              </div>
              {isPlayable && percent > 0 ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    flex: 1, height: 4, borderRadius: 999,
                    background: "rgba(11,54,61,0.08)",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%", borderRadius: 999,
                      width: `${percent}%`,
                      background: percent === 100 ? "var(--accent-secondary, #c2744a)" : "var(--accent-primary, #0b363d)",
                      transition: "width 0.4s ease-out",
                    }} />
                  </div>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                    color: "rgba(11,54,61,0.4)", flexShrink: 0,
                  }}>
                    {completedCount}/{moduleCount}
                  </span>
                </div>
              ) : (
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                  color: "rgba(11,54,61,0.35)",
                }}>
                  {moduleCount} modules
                </div>
              )}
            </div>

            {/* Right side */}
            <div style={{ flexShrink: 0 }}>
              {isPlayable ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(11,54,61,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              ) : (
                <div>
                  <LockIcon />
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 10,
                    color: "rgba(11,54,61,0.35)", marginTop: 4,
                    textAlign: "center",
                  }}>
                    Bientôt
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
