import { modulesData } from "../../../data/academy/modules";

/**
 * Last N completed modules from progress data.
 *
 * Props:
 *   progress     raw Firestore progress object (or null)
 *   onOpenModule (parcoursId, moduleId) => void
 *   maxItems     number (default 3)
 */
export const RecentActivity = ({ progress, onOpenModule, maxItems = 3 }) => {
  if (!progress?.parcours) return null;

  // Gather all completed modules with their timestamps
  const completed = [];
  for (const [parcoursId, parcoursData] of Object.entries(progress.parcours)) {
    for (const [moduleId, modData] of Object.entries(parcoursData.modules || {})) {
      if (modData.completedAt) {
        const modMeta = modulesData.find(m => m.id === moduleId);
        if (modMeta) {
          completed.push({
            parcoursId,
            moduleId,
            titleFr: modMeta.titleFr,
            completedAt: modData.completedAt,
            score: modData.score,
          });
        }
      }
    }
  }

  if (completed.length === 0) return null;

  // Sort by most recent first
  completed.sort((a, b) => b.completedAt - a.completedAt);
  const recent = completed.slice(0, maxItems);

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
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12, color: "var(--text-tertiary)",
        textTransform: "uppercase", letterSpacing: "1.5px",
        marginBottom: 14,
      }}>
        Activité récente
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {recent.map(({ parcoursId, moduleId, titleFr, completedAt, score }) => {
          const dateStr = new Date(completedAt).toLocaleDateString("fr-FR", {
            day: "numeric", month: "short",
          });

          return (
            <div
              key={moduleId}
              onClick={() => onOpenModule(parcoursId, moduleId)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 8,
                background: "var(--bg-primary)",
                border: "1px solid var(--border-light)",
                cursor: "pointer",
              }}
            >
              {/* Check icon */}
              <div style={{
                width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                background: "rgba(58,122,107,0.12)",
                border: "1.5px solid rgba(58,122,107,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13,
              }}>
                ✓
              </div>
              {/* Module name */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                  color: "var(--text-primary)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {titleFr}
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                  color: "var(--text-tertiary)",
                }}>
                  {dateStr}
                </div>
              </div>
              {/* Score */}
              {score != null && (
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                  color: score >= 80 ? "#3a7a6b" : score >= 60 ? "var(--accent-secondary)" : "var(--text-muted)",
                  flexShrink: 0,
                }}>
                  {score}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
