import { useEffect, useState } from "react";
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
 * Full-screen overlay shown when a badge is newly unlocked.
 * badgeId: string ID of the badge
 * onDismiss: called when user taps "Super !" or outside the card
 */
export const BadgeUnlockModal = ({ badgeId, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const badge = badgesData.find(b => b.id === badgeId);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!badge) return null;

  return (
    <div
      onClick={onDismiss}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(11,54,61,0.72)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 24,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease-out",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--bg-surface)",
          borderRadius: 20, padding: "36px 28px",
          textAlign: "center", maxWidth: 300, width: "100%",
          transform: visible ? "scale(1)" : "scale(0.85)",
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: "0 20px 60px rgba(11,54,61,0.2)",
        }}
      >
        {/* Badge circle */}
        <div style={{
          width: 96, height: 96, borderRadius: 999,
          background: "rgba(194,116,74,0.1)",
          border: "3px solid rgba(194,116,74,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 44, margin: "0 auto 20px",
          animation: visible ? "badge-pop 0.5s cubic-bezier(0.34,1.56,0.64,1)" : "none",
        }}>
          {BADGE_ICONS[badgeId] || "🏅"}
        </div>

        {/* Eyebrow */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11,
          fontWeight: 700, textTransform: "uppercase",
          letterSpacing: 2, color: "var(--accent-secondary)",
          marginBottom: 8,
        }}>
          Badge débloqué !
        </div>

        {/* Name */}
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 22, fontWeight: 600, fontStyle: "italic",
          color: "var(--text-primary)", marginBottom: 8,
        }}>
          {badge.nameFr}
        </div>

        {/* Description */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          color: "var(--text-secondary)", lineHeight: 1.55,
          margin: "0 0 24px",
        }}>
          {badge.descFr}
        </p>

        <button
          onClick={onDismiss}
          style={{
            padding: "12px 32px",
            background: "#0b363d", color: "var(--text-on-dark)",
            border: "none", borderRadius: 10,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Super !
        </button>
      </div>
    </div>
  );
};
