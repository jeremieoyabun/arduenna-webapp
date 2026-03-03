import { badgesData } from "../../../data/academy/badges";
import { BadgeGlyph, PadlockSVG } from "../gamification/BadgeGlyph";

const CAP = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 10, fontWeight: 600,
  color: "var(--text-3)",
  textTransform: "uppercase", letterSpacing: "2.5px",
};

export const BadgesRow = ({ earnedBadgeIds = [], onViewAll, newBadgeId }) => {
  const displayed = badgesData.slice(0, 6);

  return (
    <div className="a-card" style={{ marginBottom: 12, padding: "18px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={CAP}>Badges</div>
        <button
          onClick={onViewAll}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
            color: "#c2744a",
            display: "flex", alignItems: "center", gap: 3,
          }}
        >
          Voir tous ({earnedBadgeIds.length}/10)
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* 6 badge slots */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
        {displayed.map((badge) => {
          const earned = earnedBadgeIds.includes(badge.id);
          return (
            <div
              key={badge.id}
              title={earned ? badge.descFr : "Non débloqué"}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
            >
              {/* Badge circle */}
              <div style={{
                width: 54, height: 54, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: earned ? "rgba(194,116,74,0.10)" : "var(--elevated)",
                border: earned
                  ? "1.5px solid rgba(194,116,74,0.45)"
                  : "1.5px solid var(--border-subtle)",
                color: earned ? "#c2744a" : "var(--text-4)",
                boxShadow: earned ? "0 0 12px rgba(194,116,74,0.15)" : "none",
                animation: badge.id === newBadgeId
                  ? "badge-unlock 0.55s cubic-bezier(0.34,1.56,0.64,1) both"
                  : earned ? "badge-pop 0.4s ease-out" : "none",
                transition: "box-shadow 0.3s ease",
                flexShrink: 0,
                overflow: "hidden",
              }}>
                {earned ? <BadgeGlyph id={badge.id} size={32} /> : <PadlockSVG size={35} />}
              </div>

              {/* Badge label */}
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 9, fontWeight: 500, lineHeight: 1.3,
                color: earned ? "#c2744a" : "var(--text-4)",
                textAlign: "center",
                maxWidth: 54, overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}>
                {badge.nameFr}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
