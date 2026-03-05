const PARCOURS_LABELS = {
  univers: "L'Univers Arduenna",
  gamme: "La Gamme",
  cocktail: "Le Cocktail Lab",
  vente: "Vendre Arduenna",
};

const BADGE_ICONS = {
  "first-lesson": "🌱", "master-botanist": "🌿", "cocktail-expert": "🍸",
  "speed-learner": "⚡", "perfect-score": "💯", "streak-7": "🔥",
  "streak-30": "🏆", "all-parcours": "🌟", "sales-champion": "💼",
  "mixology-master": "🎯",
};

const BADGE_LABELS = {
  "first-lesson": "Première Leçon", "master-botanist": "Maître Botaniste",
  "cocktail-expert": "Expert Cocktails", "speed-learner": "Apprenant Éclair",
  "perfect-score": "Score Parfait", "streak-7": "Flamme Ardennaise",
  "streak-30": "Feu Sacré", "all-parcours": "Ambassadeur Arduenna",
  "sales-champion": "Champion Vente", "mixology-master": "Maître Mixologue",
};

const ROLE_LABELS = { bartender: "Bartender", commercial: "Commercial", caviste: "Caviste" };

/**
 * User detail drilldown panel.
 * Props: user (enriched object with progress), onClose () => void
 */
export const UserDetail = ({ user, onClose }) => {
  const prog = user.progress;
  const initial = (user.displayName || user.firstName || "?")[0].toUpperCase();

  const lastLogin = user.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
    : "jamais";

  const badges = prog?.badges || [];

  // Compute per-module scores per parcours
  const parcoursBreakdown = Object.entries(PARCOURS_LABELS).map(([pid, label]) => {
    const parcoursData = prog?.parcours?.[pid];
    if (!parcoursData) return { pid, label, modules: [], completedAt: null };

    const modules = Object.entries(parcoursData.modules || {}).map(([mid, m]) => ({
      id: mid,
      score: m.score,
      completedAt: m.completedAt,
    }));

    return { pid, label, modules, completedAt: parcoursData.completedAt };
  });

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(8,31,35,0.85)",
        display: "flex", alignItems: "flex-end",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          width: "100%",
          maxHeight: "90vh",
          borderRadius: "16px 16px 0 0",
          overflowY: "auto",
          padding: "24px 20px 40px",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{
          width: 36, height: 4, borderRadius: 2,
          background: "var(--border-medium)",
          margin: "0 auto 20px",
        }} />

        {/* User header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 999,
            background: "rgba(194,116,74,0.12)",
            border: "1.5px solid rgba(194,116,74,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 20, fontStyle: "italic", color: "var(--accent-secondary)",
          }}>
            {initial}
          </div>
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 19, fontStyle: "italic", color: "var(--text-primary)",
            }}>
              {user.displayName || user.firstName || "—"}
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, color: "var(--text-tertiary)",
            }}>
              {ROLE_LABELS[user.role] || user.role || "—"} · {user.email || ""}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            ["⭐", `${prog?.xp || 0} XP`, "XP"],
            ["🔥", `${prog?.streak?.current || 0}j`, "Streak"],
            ["🏅", `${badges.length}`, "Badges"],
            ["📅", lastLogin, "Dernier login"],
          ].map(([icon, val, lbl]) => (
            <div key={lbl} style={{
              flex: 1, minWidth: 80,
              background: "var(--bg-primary)",
              border: "1px solid var(--border-light)",
              borderRadius: 8, padding: "10px 12px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{icon}</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                fontWeight: 600, color: "var(--text-primary)",
              }}>
                {val}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                color: "var(--text-muted)",
                textTransform: "uppercase", letterSpacing: "1px",
              }}>
                {lbl}
              </div>
            </div>
          ))}
        </div>

        {/* Parcours progress */}
        <div style={{
          background: "var(--bg-primary)",
          border: "1px solid var(--border-light)",
          borderRadius: 10, padding: "14px 16px", marginBottom: 16,
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, color: "var(--text-tertiary)",
            textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12,
          }}>
            Progression
          </div>
          {parcoursBreakdown.map(({ pid, label, modules, completedAt }) => {
            const doneCount = modules.filter(m => m.completedAt).length;
            const totalExpected = 4; // each parcours has 4 modules
            const pct = Math.round((doneCount / totalExpected) * 100);
            const scores = modules.filter(m => m.score != null).map(m => m.score);
            const avgScore = scores.length > 0
              ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
              : null;

            return (
              <div key={pid} style={{ marginBottom: 12 }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", marginBottom: 4,
                }}>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                    color: doneCount > 0 ? "var(--text-secondary)" : "var(--text-muted)",
                    fontWeight: doneCount > 0 ? 500 : 400,
                  }}>
                    {label}
                    {completedAt && <span style={{ color: "#3a7a6b", marginLeft: 6 }}>✓</span>}
                  </span>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                    color: "var(--text-tertiary)",
                  }}>
                    {doneCount}/{totalExpected}
                    {avgScore != null ? ` · ${avgScore}%` : ""}
                  </span>
                </div>
                <div style={{
                  height: 4, borderRadius: 999,
                  background: "var(--border-light)", overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: 999,
                    width: `${pct}%`, background: pct === 100 ? "#3a7a6b" : "#0b363d",
                    transition: "width 0.4s ease-out",
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Badges earned */}
        {badges.length > 0 && (
          <div style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-light)",
            borderRadius: 10, padding: "14px 16px",
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, color: "var(--text-tertiary)",
              textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12,
            }}>
              Badges ({badges.length})
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {badges.map(b => (
                <div key={b.id} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "5px 10px",
                  background: "rgba(194,116,74,0.08)",
                  border: "1px solid rgba(194,116,74,0.2)",
                  borderRadius: 6,
                }}>
                  <span style={{ fontSize: 14 }}>{BADGE_ICONS[b.id] || "🏅"}</span>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                    color: "var(--accent-secondary)",
                  }}>
                    {BADGE_LABELS[b.id] || b.id}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
