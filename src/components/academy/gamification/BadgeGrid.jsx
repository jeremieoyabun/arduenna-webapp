import { badgesData } from "../../../data/academy/badges";

const BADGE_ICONS = {
  "first-lesson": "🌱",
  "master-botanist": "🌿",
  "cocktail-expert": "🍸",
  "speed-learner": "⚡",
  "perfect-score": "💯",
  "streak-7": "🔥",
  "streak-30": "🏆",
  "all-parcours": "🌟",
  "sales-champion": "💼",
  "mixology-master": "🎯",
};

/**
 * 2-row grid of all 10 badges. Earned = colored, locked = greyed.
 * earnedBadges: array of { id, earnedAt } objects (from Firestore) or plain strings.
 */
export const BadgeGrid = ({ earnedBadges = [] }) => {
  const earnedIds = earnedBadges.map(b => (typeof b === "string" ? b : b.id));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
      {badgesData.map(badge => {
        const earned = earnedIds.includes(badge.id);
        return (
          <div key={badge.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 999,
              background: earned ? "rgba(194,116,74,0.12)" : "rgba(11,54,61,0.04)",
              border: earned ? "2px solid rgba(194,116,74,0.3)" : "2px dashed rgba(11,54,61,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
              opacity: earned ? 1 : 0.28,
              transition: "all 0.2s ease-out",
            }}>
              {BADGE_ICONS[badge.id] || "🏅"}
            </div>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9, textAlign: "center",
              color: earned ? "var(--accent-secondary)" : "var(--text-muted)",
              lineHeight: 1.2,
              maxWidth: 50,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {badge.nameFr}
            </span>
          </div>
        );
      })}
    </div>
  );
};
