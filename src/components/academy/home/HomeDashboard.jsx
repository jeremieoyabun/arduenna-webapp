import { NextModuleCard } from "./NextModuleCard";
import { MiniLeaderboard } from "./MiniLeaderboard";
import { RecentActivity } from "./RecentActivity";
import { parcoursData } from "../../../data/academy/parcours";
import { modulesData } from "../../../data/academy/modules";

const label = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 10, color: "var(--text-tertiary)",
  textTransform: "uppercase", letterSpacing: "1.5px",
};

const card = {
  background: "var(--bg-surface)",
  borderRadius: 12,
  border: "1px solid var(--border-light)",
  boxShadow: "0 2px 12px rgba(11,54,61,0.03)",
};

/**
 * Academy home tab — full dashboard with real data.
 *
 * Props:
 *   firstName       string
 *   role            string  (bartender | commercial | caviste)
 *   xp              number
 *   streak          number
 *   progress        object  raw Firestore progress data
 *   getModulePercent (parcoursId, moduleId) => number
 *   isLocked        (parcoursId, order) => boolean
 *   isCompleted     (parcoursId, moduleId) => boolean
 *   getParcoursCompletedCount (parcoursId) => number
 *   progressLoading boolean
 *   onOpenModule    (parcoursId, moduleId) => void
 *   onSwitchTab     (tabId) => void
 */
export const HomeDashboard = ({
  firstName, role, xp, streak, progress,
  getModulePercent, isLocked, isCompleted, getParcoursCompletedCount,
  progressLoading, onOpenModule, onSwitchTab,
}) => {
  // ── Find next module across role-appropriate parcours ──────────────────────
  const eligibleParcours = parcoursData.filter(p =>
    p.targetRoles === "all" || (Array.isArray(p.targetRoles) && p.targetRoles.includes(role))
  );

  let nextModule = null;
  let nextParcoursId = null;

  for (const parcours of eligibleParcours) {
    const modules = modulesData
      .filter(m => m.parcoursId === parcours.id)
      .sort((a, b) => a.order - b.order);

    for (const m of modules) {
      if (!isLocked(parcours.id, m.order) && !isCompleted(parcours.id, m.id)) {
        nextModule = m;
        nextParcoursId = parcours.id;
        break;
      }
    }
    if (nextModule) break;
  }

  // ── Parcours progress bars (all eligible) ─────────────────────────────────
  const parcoursProgress = eligibleParcours.map(p => {
    const total = modulesData.filter(m => m.parcoursId === p.id).length;
    const done = getParcoursCompletedCount(p.id);
    const started = done > 0 || !!progress?.parcours?.[p.id]?.started;
    return { ...p, total, done, started, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  });

  // ── Streak flame color ─────────────────────────────────────────────────────
  const streakColor = streak >= 7 ? "#D4A574" : streak >= 4 ? "#c2744a" : "var(--text-muted)";

  const dayOfWeek = new Intl.DateTimeFormat("fr-FR", { weekday: "long" }).format(new Date());
  const dayCapitalized = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

  return (
    <div style={{ padding: "24px 20px" }}>
      {/* Greeting */}
      <div style={{ marginBottom: 22 }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11,
          color: "var(--text-tertiary)", textTransform: "uppercase",
          letterSpacing: "1.5px", marginBottom: 4,
        }}>
          {dayCapitalized}
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 28, fontWeight: 600, fontStyle: "italic",
          color: "var(--text-primary)", margin: 0, lineHeight: 1.15,
        }}>
          Bonjour, {firstName}
        </h2>
      </div>

      {/* Streak + XP — big stat cards */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {/* Streak */}
        <div style={{
          flex: 1, padding: "20px 16px",
          borderRadius: 16,
          background: streak >= 7
            ? "linear-gradient(135deg, rgba(212,165,116,0.18), rgba(194,116,74,0.08))"
            : streak >= 4 ? "rgba(194,116,74,0.07)" : "var(--bg-surface)",
          border: `1px solid ${streak >= 4 ? "rgba(194,116,74,0.22)" : "var(--border-light)"}`,
          boxShadow: streak >= 4 ? "0 4px 16px rgba(194,116,74,0.08)" : "0 2px 8px rgba(11,54,61,0.03)",
        }}>
          <div style={{
            fontSize: 30, marginBottom: 10,
            filter: streak >= 7 ? "saturate(1.8) drop-shadow(0 2px 4px rgba(194,116,74,0.4))"
              : streak >= 4 ? "saturate(1.3)" : "saturate(0.35) opacity(0.6)",
          }}>🔥</div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 32,
            fontWeight: 700, color: streakColor, lineHeight: 1,
          }}>
            {streak}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 10,
            color: "var(--text-tertiary)", textTransform: "uppercase",
            letterSpacing: "1.2px", marginTop: 5,
          }}>
            Jour{streak !== 1 ? "s" : ""} de suite
          </div>
        </div>

        {/* XP */}
        <div style={{
          flex: 1, padding: "20px 16px",
          borderRadius: 16,
          background: "rgba(11,54,61,0.04)",
          border: "1px solid rgba(11,54,61,0.09)",
          boxShadow: "0 2px 8px rgba(11,54,61,0.03)",
        }}>
          <div style={{ fontSize: 30, marginBottom: 10 }}>⭐</div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 32,
            fontWeight: 700, color: "#0b363d", lineHeight: 1,
          }}>
            {xp}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 10,
            color: "var(--text-tertiary)", textTransform: "uppercase",
            letterSpacing: "1.2px", marginTop: 5,
          }}>
            Points XP
          </div>
        </div>
      </div>

      {/* Next module card — primary action */}
      {nextModule ? (
        <NextModuleCard
          module={nextModule}
          parcoursId={nextParcoursId}
          percent={getModulePercent(nextParcoursId, nextModule.id)}
          onStart={() => onOpenModule(nextParcoursId, nextModule.id)}
        />
      ) : (
        <div style={{ ...card, padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ ...label, marginBottom: 8 }}>Prochain module</div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
            color: "var(--text-tertiary)", fontStyle: "italic",
          }}>
            {progressLoading ? "Chargement..." : "Tous vos parcours sont complétés 🎉"}
          </div>
        </div>
      )}

      {/* Parcours progress bars */}
      {parcoursProgress.some(p => p.done > 0) && (
        <div style={{
          ...card, padding: "18px 20px", marginBottom: 16,
          boxShadow: "0 2px 12px rgba(11,54,61,0.05)",
        }}>
          <div style={{ ...label, marginBottom: 16 }}>Ma progression</div>
          {parcoursProgress.map(({ id, titleFr, done, total, percent, started, color }) => (
            <div key={id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  color: started ? "var(--text-secondary)" : "var(--text-muted)",
                  fontWeight: started ? 500 : 400,
                }}>
                  {titleFr}
                </span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
                  color: percent === 100 ? color : "var(--text-tertiary)",
                }}>
                  {done}/{total} {percent === 100 ? "✓" : ""}
                </span>
              </div>
              <div style={{
                height: 7, borderRadius: 999,
                background: "rgba(11,54,61,0.07)", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: 999,
                  width: `${percent}%`,
                  background: percent === 100 ? color : "#0b363d",
                  transition: "width 0.5s cubic-bezier(0.34,1.2,0.64,1)",
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent activity */}
      <RecentActivity
        progress={progress}
        onOpenModule={onOpenModule}
      />

      {/* Mini leaderboard */}
      <MiniLeaderboard onViewAll={() => onSwitchTab("classement")} />
    </div>
  );
};
