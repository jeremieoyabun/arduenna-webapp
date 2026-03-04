import { parcoursData } from "../../../data/academy/parcours";
import { modulesData } from "../../../data/academy/modules";

const PARCOURS_ICONS = {
  univers: <img src="/icons/Univers-Arduenna.webp" alt="" width="56" height="56" style={{ objectFit: "contain", display: "block" }} />,
  gamme: <img src="/icons/La-gamme.svg" alt="" width="56" height="56" style={{ objectFit: "contain", display: "block" }} />,
  cocktail: <img src="/icons/Cocktails-Lab.svg" alt="" width="56" height="56" style={{ objectFit: "contain", display: "block" }} />,
  vente: <img src="/icons/Vendre-Arduenna.svg" alt="" width="56" height="56" style={{ objectFit: "contain", display: "block" }} />,
};

export const ParcoursGrid = ({ onSelectParcours, getParcoursCompletedCount }) => {
  const cardStyle = {
    background: "var(--bg-surface)",
    borderRadius: 12,
    padding: "18px 20px",
    border: "1px solid var(--border-light)",
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
        color: "var(--text-primary)", marginBottom: 6,
      }}>
        Parcours d'apprentissage
      </h2>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        color: "var(--text-tertiary)", marginBottom: 24,
      }}>
        Maîtrisez l'univers Arduenna étape par étape
      </p>

      {parcoursData.map((p, i) => {
        const moduleCount = modulesData.filter(m => m.parcoursId === p.id).length;
        const completedCount = getParcoursCompletedCount?.(p.id) || 0;
        const percent = moduleCount > 0 ? Math.round((completedCount / moduleCount) * 100) : 0;

        return (
          <div
            key={p.id}
            onClick={() => onSelectParcours(p.id)}
            style={{
              ...cardStyle,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Icon */}
            <div style={{
              width: 60, height: 60, borderRadius: 14, flexShrink: 0,
              background: "rgba(194,116,74,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#c2744a",
            }}>
              {PARCOURS_ICONS[p.id]}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 15,
                fontWeight: 600, color: "var(--text-primary)", marginBottom: 3,
              }}>
                {p.titleFr}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                color: "var(--text-tertiary)", marginBottom: 6,
              }}>
                {p.descFr}
              </div>
              {percent > 0 ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    flex: 1, height: 4, borderRadius: 999,
                    background: "var(--border-light)",
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
                    color: "var(--text-tertiary)", flexShrink: 0,
                  }}>
                    {completedCount}/{moduleCount}
                  </span>
                </div>
              ) : (
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                  color: "var(--text-muted)",
                }}>
                  {moduleCount} modules
                </div>
              )}
            </div>

            {/* Right side */}
            <div style={{ flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(11,54,61,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};
