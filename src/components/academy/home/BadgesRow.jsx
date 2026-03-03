import { badgesData } from "../../../data/academy/badges";

// ── Badge glyphs — illustrated assets where available, inline SVG fallback ────
const Glyph = ({ id, size = 36 }) => {
  const ASSET = {
    "first-lesson":    "/icons/First-lesson.svg",
    "master-botanist": "/icons/master-botanist-badge-glyph.svg",
    "cocktail-expert": "/icons/cocktail-expert-badge-glyph.svg",
    "speed-learner":   "/icons/speed-learner-badge-glyph.webp",
    "perfect-score":   "/icons/perfect-score-badge-glyph.svg",
    "streak-7":        "/icons/streak-7-badge-glyph.svg",
  };
  if (ASSET[id]) {
    return <img src={ASSET[id]} alt="" width={size} height={size} style={{ objectFit: "contain", display: "block" }} />;
  }
  // Inline SVG fallbacks for badges without assets yet
  const FALLBACK = {
    "first-lesson": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
      </svg>
    ),
    "speed-learner": (
      <svg width={size - 2} height={size} viewBox="0 0 14 20" fill="currentColor">
        <path d="M8 0L1 11h5l-2 9 10-13H8L10 0z" />
      </svg>
    ),
    "streak-30": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C12 2 8 9 11 13c0-4 3-6 3-6s2 4-2 7c3-2 5-1 5-1s2 6-5 9c-4 2-9 1-9-5 0-3 2.5-4.5 2.5-4.5S8 15.5 9 15.5c0-4 2-7-1-11 1.5 0 4 0 4-2.5z" />
      </svg>
    ),
    "all-parcours": (
      <svg width={size} height={size - 2} viewBox="0 0 24 20" fill="currentColor">
        <path d="M12 0l3 6h7l-5.5 4 2 6.5L12 13l-6.5 3.5 2-6.5L2 6h7z" />
      </svg>
    ),
    "sales-champion": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22M18 2H6v7a6 6 0 0012 0V2z" />
      </svg>
    ),
    "mixology-master": (
      <svg width={size - 2} height={size} viewBox="0 0 14 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 1h6M5 5l-4 8h12L9 5H5zM7 13v6M4 19h6" />
      </svg>
    ),
  };
  return FALLBACK[id] || <span style={{ fontSize: size - 2 }}>✦</span>;
};

const PadlockIcon = () => (
  <img src="/icons/Better-Lock-Icon.webp" alt="" width="12" height="12" style={{ objectFit: "contain", display: "block", opacity: 0.6 }} />
);

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
                {earned ? <Glyph id={badge.id} /> : <PadlockIcon />}
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
