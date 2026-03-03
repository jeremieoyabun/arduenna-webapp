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

  return (
    <div style={{ padding: "28px 20px" }}>
      {/* Greeting */}
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 26, fontWeight: 400, fontStyle: "italic",
        color: "var(--text-primary)", marginBottom: 24,
      }}>
        Bonjour {firstName} 👋
      </h2>

      {/* Streak + XP */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ ...card, flex: 1, padding: "16px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22, filter: streak >= 7 ? "saturate(1.8)" : streak >= 4 ? "saturate(1.2)" : "saturate(0.5)" }}>🔥</span>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 600, color: streakColor }}>
              {streak} jour{streak !== 1 ? "s" : ""}
            </div>
            <div style={{ ...label }}>Streak</div>
          </div>
        </div>
        <div style={{ ...card, flex: 1, padding: "16px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>⭐</span>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>
              {xp} XP
            </div>
            <div style={{ ...label }}>Total</div>
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
        <div style={{ ...card, padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ ...label, marginBottom: 14 }}>Ma progression</div>
          {parcoursProgress.map(({ id, titleFr, done, total, percent, started, color }) => (
            <div key={id} style={{ marginBottom: 12 }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5,
              }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                  color: started ? "var(--text-secondary)" : "var(--text-muted)",
                  fontWeight: started ? 500 : 400,
                }}>
                  {titleFr}
                </span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                  color: "var(--text-tertiary)",
                }}>
                  {done}/{total}
                </span>
              </div>
              <div style={{ height: 5, borderRadius: 999, background: "var(--border-light)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 999,
                  width: `${percent}%`,
                  background: percent === 100 ? color : "#0b363d",
                  transition: "width 0.4s ease-out",
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
