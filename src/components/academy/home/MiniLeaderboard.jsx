import { useEffect, useState } from "react";
import { useAuth } from "../../../components/auth/AuthProvider";
import { getLeaderboard } from "../../../lib/gamificationService";

const MEDAL = ["#D4A574", "#A0A0A0", "#C28B6A"];

const LEVELS = [
  { level: 1, xpStart: 0,    xpNeeded: 300 },
  { level: 2, xpStart: 300,  xpNeeded: 400 },
  { level: 3, xpStart: 700,  xpNeeded: 600 },
  { level: 4, xpStart: 1300, xpNeeded: 900 },
  { level: 5, xpStart: 2200, xpNeeded: null },
];

const CAP = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 12, fontWeight: 600,
  color: "var(--text-3)",
  textTransform: "uppercase", letterSpacing: "2.5px",
};

const getLevelForXP = (xp) =>
  [...LEVELS].reverse().find(l => xp >= l.xpStart) || LEVELS[0];

const getLevelPercent = (xp, lvl) => {
  const inLevel = xp - lvl.xpStart;
  return lvl.xpNeeded ? Math.min(100, Math.round((inLevel / lvl.xpNeeded) * 100)) : 100;
};

/**
 * Top 3 leaderboard preview + current user position.
 * Each row: rank · avatar · name + level chip · mini XP bar · badge dots · XP total
 */
export const MiniLeaderboard = ({ onViewAll }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard(30)
      .then(data => setEntries(data))
      .finally(() => setLoading(false));
  }, []);

  const top3 = entries.slice(0, 3);
  const userRank = entries.findIndex(e => e.uid === user?.uid);

  return (
    <div className="a-card" style={{ marginBottom: 12, padding: "18px 20px" }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 14,
      }}>
        <div style={CAP}>Top Apprentis</div>
        {entries.length > 0 && (
          <button
            onClick={onViewAll}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, color: "#c2744a", fontWeight: 500,
              padding: 0, display: "flex", alignItems: "center", gap: 3,
            }}
          >
            Voir tout
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {loading ? (
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 14, fontStyle: "italic", color: "var(--text-3)",
          textAlign: "center", padding: "8px 0",
        }}>
          Chargement...
        </div>
      ) : entries.length === 0 ? (
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, color: "var(--text-4)", fontStyle: "italic",
          textAlign: "center", padding: "8px 0",
        }}>
          Complétez un module pour apparaître au classement.
        </div>
      ) : (
        <>
          {/* Top 3 rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
            {top3.map((entry, i) => {
              const isMe = entry.uid === user?.uid;
              const color = MEDAL[i];
              const initial = (entry.displayName || "?")[0].toUpperCase();
              const lvl = getLevelForXP(entry.xp || 0);
              const lvlPercent = getLevelPercent(entry.xp || 0, lvl);
              // Badge dots: 1 dot per 200 XP, max 3
              const badgeDots = Math.min(3, Math.floor((entry.xp || 0) / 200));

              return (
                <div key={entry.uid} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 10px", borderRadius: 8,
                  background: i === 0
                    ? "rgba(212,165,116,0.07)"
                    : isMe ? "rgba(194,116,74,0.06)" : "var(--elevated)",
                  border: i === 0
                    ? "1px solid rgba(212,165,116,0.28)"
                    : isMe ? "1px solid rgba(194,116,74,0.22)" : "1px solid var(--border-subtle)",
                }}>
                  {/* Rank */}
                  <div style={{
                    width: 18, textAlign: "center", flexShrink: 0,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
                    color,
                  }}>
                    {i + 1}
                  </div>

                  {/* Avatar */}
                  {entry.avatarUrl ? (
                    <img src={entry.avatarUrl} alt="" style={{
                      width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                      objectFit: "cover",
                      border: `1.5px solid ${isMe ? "rgba(194,116,74,0.4)" : color + "60"}`,
                    }} />
                  ) : (
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                      background: isMe ? "rgba(194,116,74,0.12)" : `${color}20`,
                      border: `1.5px solid ${isMe ? "rgba(194,116,74,0.4)" : color + "60"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12,
                      color: isMe ? "#c2744a" : color,
                    }}>
                      {initial}
                    </div>
                  )}

                  {/* Name + level chip + mini XP bar */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                        fontWeight: isMe ? 600 : 500,
                        color: "var(--text-1)",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {entry.displayName}{isMe ? " (vous)" : ""}
                      </span>
                      {/* Level chip */}
                      <span style={{
                        flexShrink: 0,
                        fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700,
                        color: "#c2744a",
                        background: "rgba(194,116,74,0.12)",
                        border: "1px solid rgba(194,116,74,0.22)",
                        borderRadius: 4,
                        padding: "1px 5px",
                        letterSpacing: "0.3px",
                      }}>
                        Niv {lvl.level}
                      </span>
                    </div>
                    {/* Mini XP bar within level */}
                    <div style={{ height: 2, borderRadius: 999, background: "var(--border-subtle)", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 999,
                        width: `${lvlPercent}%`,
                        background: "rgba(194,116,74,0.55)",
                      }} />
                    </div>
                  </div>

                  {/* Badge count + XP total */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                    {badgeDots > 0 && (
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                        color: "var(--text-4)",
                      }}>
                        {badgeDots} badge{badgeDots > 1 ? "s" : ""}
                      </div>
                    )}
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
                      color: "var(--text-2)",
                    }}>
                      {entry.xp} XP
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* XP gap — how far the user is from the rank just above */}
          {userRank >= 3 && entries[userRank] && entries[userRank - 1] && (
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12,
              color: "var(--text-4)", textAlign: "center",
              fontStyle: "italic", paddingBottom: 6,
            }}>
              encore {entries[userRank - 1].xp - entries[userRank].xp} XP pour le rang #{userRank}
            </div>
          )}

          {/* User rank row if outside top 3 */}
          {userRank >= 3 && entries[userRank] && (() => {
            const entry = entries[userRank];
            const lvl = getLevelForXP(entry.xp || 0);
            return (
              <div style={{
                padding: "10px 10px", borderRadius: 8,
                background: "rgba(194,116,74,0.06)",
                border: "1px solid rgba(194,116,74,0.18)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
                    color: "var(--text-3)",
                  }}>
                    #{userRank + 1}
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--text-2)" }}>
                    Vous
                  </div>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700,
                    color: "#c2744a",
                    background: "rgba(194,116,74,0.12)",
                    border: "1px solid rgba(194,116,74,0.22)",
                    borderRadius: 4,
                    padding: "1px 5px",
                  }}>
                    Niv {lvl.level}
                  </span>
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
                  color: "var(--text-1)",
                }}>
                  {entry.xp} XP
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
};
