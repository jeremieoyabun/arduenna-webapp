import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { getLeaderboard } from "../../../lib/gamificationService";

const ROLE_LABELS = {
  bartender: "Bartender",
  commercial: "Commercial",
  caviste: "Caviste",
};

// Gold / Silver / Bronze
const MEDAL = ["#D4A574", "#A0A0A0", "#C28B6A"];

/**
 * Full leaderboard tab — podium top 3 + scrollable ranked list.
 * Highlights current user's row. Fetches from Firestore on mount.
 */
export const LeaderboardView = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard(30)
      .then(data => setEntries(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 20, fontStyle: "italic", color: "var(--accent-secondary)",
        }}>
          Chargement...
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div style={{ padding: "32px 20px", textAlign: "center" }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 22, fontWeight: 400, fontStyle: "italic",
          color: "var(--text-primary)", marginBottom: 8,
        }}>
          Classement
        </h2>

        {/* Empty podium visual */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 8, marginBottom: 24, height: 140 }}>
          {[{ rank: 2, h: 90 }, { rank: 1, h: 120 }, { rank: 3, h: 65 }].map(({ rank, h }) => (
            <div key={rank} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: rank === 1 ? 40 : 34, height: rank === 1 ? 40 : 34, borderRadius: 999,
                background: "var(--border-light)", marginBottom: 6,
              }} />
              <div style={{
                width: 72, height: h, borderRadius: "8px 8px 0 0",
                background: rank === 1 ? "rgba(194,116,74,0.08)" : "var(--border-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700,
                color: rank === 1 ? "rgba(194,116,74,0.25)" : "var(--border-medium)",
              }}>
                {rank}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          color: "var(--text-tertiary)", lineHeight: 1.6,
        }}>
          Le classement sera disponible dès que les premiers<br />
          modules seront complétés. Soyez le premier sur le podium !
        </p>
      </div>
    );
  }

  const top3 = entries.slice(0, 3);
  const userRank = entries.findIndex(e => e.uid === user?.uid);

  // Podium order: 2nd — 1st — 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumRanks = [2, 1, 3];
  const podiumHeights = [90, 120, 65];

  return (
    <div style={{ padding: "20px 20px 32px" }}>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 22, fontWeight: 400, fontStyle: "italic",
        color: "var(--text-primary)", marginBottom: 2, textAlign: "center",
      }}>
        Classement
      </h2>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 12,
        color: "var(--text-tertiary)", textAlign: "center", marginBottom: 32,
      }}>
        Les meilleurs apprentis Arduenna
      </p>

      {/* Podium */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        gap: 8, marginBottom: 28, height: 160,
      }}>
        {podiumOrder.map((entry, i) => {
          if (!entry) return <div key={i} style={{ width: 72 }} />;
          const rank = podiumRanks[i];
          const h = podiumHeights[i];
          const color = MEDAL[rank - 1];
          const isMe = entry.uid === user?.uid;
          const initial = (entry.displayName || "?")[0].toUpperCase();
          const size = rank === 1 ? 44 : 36;

          return (
            <div key={entry.uid} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {entry.avatarUrl ? (
                <img src={entry.avatarUrl} alt="" style={{
                  width: size, height: size, borderRadius: 999, objectFit: "cover",
                  border: `2px solid ${isMe ? "rgba(194,116,74,0.5)" : color}`,
                  marginBottom: 6,
                }} />
              ) : (
                <div style={{
                  width: size, height: size, borderRadius: 999,
                  background: isMe ? "rgba(194,116,74,0.15)" : `${color}22`,
                  border: `2px solid ${isMe ? "rgba(194,116,74,0.5)" : color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600, fontSize: rank === 1 ? 16 : 13,
                  color: isMe ? "var(--accent-secondary)" : color,
                  marginBottom: 6,
                }}>
                  {initial}
                </div>
              )}
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 10,
                color: "var(--text-secondary)", marginBottom: 4,
                maxWidth: 68, textAlign: "center",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {entry.displayName}
              </div>
              <div style={{
                width: 72, height: h, borderRadius: "8px 8px 0 0",
                background: `${color}18`,
                border: `1px solid ${color}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700,
                color: `${color}88`,
              }}>
                {rank}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ranked rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {entries.map((entry, i) => {
          const rank = i + 1;
          const isMe = entry.uid === user?.uid;
          const initial = (entry.displayName || "?")[0].toUpperCase();

          return (
            <div key={entry.uid} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px", borderRadius: 10,
              background: isMe ? "rgba(194,116,74,0.06)" : "var(--bg-surface)",
              border: isMe
                ? "1px solid rgba(194,116,74,0.22)"
                : "1px solid var(--border-light)",
            }}>
              {/* Rank */}
              <div style={{
                width: 24, textAlign: "center",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                color: rank <= 3 ? MEDAL[rank - 1] : "var(--text-tertiary)",
              }}>
                {rank}
              </div>

              {/* Avatar */}
              {entry.avatarUrl ? (
                <img src={entry.avatarUrl} alt="" style={{
                  width: 32, height: 32, borderRadius: 999, flexShrink: 0,
                  objectFit: "cover",
                  border: isMe ? "2px solid rgba(194,116,74,0.4)" : "none",
                }} />
              ) : (
                <div style={{
                  width: 32, height: 32, borderRadius: 999, flexShrink: 0,
                  background: isMe ? "rgba(194,116,74,0.12)" : "var(--border-light)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                  color: isMe ? "var(--accent-secondary)" : "var(--text-secondary)",
                }}>
                  {initial}
                </div>
              )}

              {/* Name + role */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  fontWeight: isMe ? 600 : 500,
                  color: "var(--text-primary)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {entry.displayName}{isMe ? " (vous)" : ""}
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                  color: "var(--text-tertiary)",
                }}>
                  {ROLE_LABELS[entry.role] || entry.role || "—"}
                </div>
              </div>

              {/* XP */}
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                color: "var(--text-primary)", flexShrink: 0,
              }}>
                {entry.xp} XP
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky own rank if outside top 30 */}
      {userRank >= 30 && (
        <div style={{
          marginTop: 8, padding: "10px 16px", borderRadius: 10,
          background: "rgba(194,116,74,0.06)",
          border: "1px solid rgba(194,116,74,0.2)",
          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          color: "var(--text-secondary)", textAlign: "center",
        }}>
          Votre rang : #{userRank + 1} · {entries[userRank]?.xp || 0} XP
        </div>
      )}
    </div>
  );
};
