import { useEffect, useState } from "react";
import { useAuth } from "../../../components/auth/AuthProvider";
import { getLeaderboard } from "../../../lib/gamificationService";

const MEDAL = ["#D4A574", "#A0A0A0", "#C28B6A"];

/**
 * Top 3 leaderboard preview + current user position.
 * Fetches from Firestore on mount.
 *
 * Props:
 *   onViewAll  () => void  — navigate to full leaderboard tab
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
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-light)",
        borderRadius: 12,
        padding: "18px 20px",
        marginBottom: 16,
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 14,
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10, color: "var(--text-tertiary)",
          textTransform: "uppercase", letterSpacing: "1.5px",
        }}>
          Top apprenants
        </div>
        {entries.length > 0 && (
          <button
            onClick={onViewAll}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11, color: "var(--accent-secondary)", fontWeight: 500,
              padding: 0,
            }}
          >
            Voir tout →
          </button>
        )}
      </div>

      {loading ? (
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 14, fontStyle: "italic", color: "var(--text-muted)",
          textAlign: "center", padding: "8px 0",
        }}>
          Chargement...
        </div>
      ) : entries.length === 0 ? (
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, color: "var(--text-tertiary)", fontStyle: "italic",
          textAlign: "center", padding: "8px 0",
        }}>
          Complétez un module pour apparaître au classement.
        </div>
      ) : (
        <>
          {/* Top 3 rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
            {top3.map((entry, i) => {
              const rank = i + 1;
              const isMe = entry.uid === user?.uid;
              const color = MEDAL[i];
              const initial = (entry.displayName || "?")[0].toUpperCase();

              return (
                <div key={entry.uid} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 10px", borderRadius: 8,
                  background: isMe ? "rgba(194,116,74,0.06)" : "var(--bg-primary)",
                  border: isMe ? "1px solid rgba(194,116,74,0.2)" : "1px solid var(--border-light)",
                }}>
                  {/* Rank */}
                  <div style={{
                    width: 20, textAlign: "center",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
                    color,
                  }}>
                    {rank}
                  </div>
                  {/* Avatar */}
                  <div style={{
                    width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                    background: isMe ? "rgba(194,116,74,0.12)" : `${color}20`,
                    border: `1.5px solid ${isMe ? "rgba(194,116,74,0.4)" : color + "60"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 12,
                    color: isMe ? "var(--accent-secondary)" : color,
                  }}>
                    {initial}
                  </div>
                  {/* Name */}
                  <div style={{
                    flex: 1, minWidth: 0,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                    fontWeight: isMe ? 600 : 500,
                    color: "var(--text-primary)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {entry.displayName}{isMe ? " (vous)" : ""}
                  </div>
                  {/* XP */}
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                    color: "var(--text-primary)", flexShrink: 0,
                  }}>
                    {entry.xp} XP
                  </div>
                </div>
              );
            })}
          </div>

          {/* User rank if outside top 3 */}
          {userRank >= 3 && entries[userRank] && (
            <div style={{
              padding: "8px 10px", borderRadius: 8,
              background: "rgba(194,116,74,0.06)",
              border: "1px solid rgba(194,116,74,0.18)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                color: "var(--text-secondary)",
              }}>
                Votre rang : #{userRank + 1}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                color: "var(--text-primary)",
              }}>
                {entries[userRank].xp} XP
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
