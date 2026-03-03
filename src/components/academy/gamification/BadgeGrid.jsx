import { badgesData } from "../../../data/academy/badges";
import { BadgeGlyph, PadlockSVG } from "./BadgeGlyph";

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
              width: 56, height: 56, borderRadius: 999,
              background: earned ? "rgba(194,116,74,0.12)" : "var(--elevated)",
              border: earned
                ? "2px solid rgba(194,116,74,0.3)"
                : "2px dashed var(--border-subtle)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: earned ? "#c2744a" : "var(--text-4)",
              opacity: earned ? 1 : 0.45,
              transition: "all 0.2s ease-out",
            }}>
              {earned ? <BadgeGlyph id={badge.id} size={34} /> : <PadlockSVG size={48} />}
            </div>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9, textAlign: "center",
              color: earned ? "#c2744a" : "var(--text-4)",
              lineHeight: 1.2,
              maxWidth: 56,
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
