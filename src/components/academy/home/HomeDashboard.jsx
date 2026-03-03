import { NextModuleCard } from "./NextModuleCard";
import { MiniLeaderboard } from "./MiniLeaderboard";
import { RecentActivity } from "./RecentActivity";
import { parcoursData } from "../../../data/academy/parcours";
import { modulesData } from "../../../data/academy/modules";

const ROLE_LABELS = {
  bartender: "Bartender",
  commercial: "Commercial",
  caviste: "Caviste / Distributeur",
};

// ── Shared dark-glass card ──────────────────────────────────────────────────
const glassCard = {
  background: "rgba(255,255,255,0.04)",
  borderRadius: 18,
  border: "1px solid rgba(254,248,236,0.07)",
  boxShadow: "8px 8px 24px rgba(0,0,0,0.38), -2px -2px 8px rgba(255,255,255,0.02)",
};

/**
 * Academy home tab — dark premium dashboard.
 *
 * Props:
 *   firstName       string
 *   role            string  (bartender | commercial | caviste)
 *   xp              number
 *   streak          number
 *   progress        object
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
  // ── Next module ─────────────────────────────────────────────────────────────
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
        nextModule = m; nextParcoursId = parcours.id; break;
      }
    }
    if (nextModule) break;
  }

  // ── Parcours progress ───────────────────────────────────────────────────────
  const parcoursProgress = eligibleParcours.map(p => {
    const total = modulesData.filter(m => m.parcoursId === p.id).length;
    const done = getParcoursCompletedCount(p.id);
    const started = done > 0 || !!progress?.parcours?.[p.id]?.started;
    return { ...p, total, done, started, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  });

  const dayOfWeek = new Intl.DateTimeFormat("fr-FR", { weekday: "long" }).format(new Date());
  const dayCapitalized = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

  const streakWarm = streak >= 4;
  const streakFire = streak >= 7;

  return (
    <div style={{ padding: "20px 18px" }}>

      {/* ── COPPER HERO GREETING CARD ─────────────────────────────────────── */}
      <div style={{
        position: "relative",
        background: "linear-gradient(140deg, #3d1200 0%, #7d2e00 50%, #c2744a 100%)",
        borderRadius: 24,
        padding: "30px 24px 26px",
        marginBottom: 14,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(194,116,74,0.4), 0 6px 20px rgba(0,0,0,0.5)",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", right: -55, top: -55, width: 220, height: 220, borderRadius: "50%", background: "rgba(254,248,236,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 50, top: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(254,248,236,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: -30, bottom: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(0,0,0,0.22)", pointerEvents: "none" }} />

        {/* Day label */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11, fontWeight: 500,
          color: "rgba(254,248,236,0.4)",
          textTransform: "uppercase", letterSpacing: "3px",
          marginBottom: 10,
        }}>
          {dayCapitalized}
        </div>

        {/* Name */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 42, fontWeight: 700, fontStyle: "italic",
          color: "#fef8ec", margin: "0 0 8px",
          lineHeight: 1.05,
          textShadow: "0 2px 24px rgba(0,0,0,0.3)",
        }}>
          Bonjour, {firstName}
        </h2>

        {/* Role */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, color: "rgba(254,248,236,0.5)",
          letterSpacing: "0.5px",
        }}>
          {ROLE_LABELS[role] || "Apprenant Arduenna"}
        </div>
      </div>

      {/* ── STAT CARDS: Streak + XP (dark neomorphism) ──────────────────── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>

        {/* Streak */}
        <div style={{
          flex: 1, padding: "20px 16px",
          background: "#0c2830",
          borderRadius: 20,
          boxShadow: streakWarm
            ? "8px 8px 22px rgba(0,0,0,0.55), -3px -3px 9px rgba(255,255,255,0.025), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 28px rgba(194,116,74,0.1)"
            : "8px 8px 22px rgba(0,0,0,0.55), -3px -3px 9px rgba(255,255,255,0.025), inset 0 1px 0 rgba(255,255,255,0.04)",
          border: `1px solid ${streakWarm ? "rgba(194,116,74,0.2)" : "rgba(255,255,255,0.05)"}`,
          position: "relative", overflow: "hidden",
        }}>
          {streakFire && (
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 80%, rgba(194,116,74,0.14), transparent 65%)", pointerEvents: "none" }} />
          )}
          <div style={{
            fontSize: 30, marginBottom: 12,
            filter: streakFire
              ? "drop-shadow(0 0 12px rgba(194,116,74,1)) drop-shadow(0 0 24px rgba(194,116,74,0.5))"
              : streakWarm ? "drop-shadow(0 0 6px rgba(194,116,74,0.7))"
              : "saturate(0.1) brightness(0.5)",
          }}>🔥</div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 42, fontWeight: 800, lineHeight: 1,
            color: streakWarm ? "#D4A574" : "rgba(254,248,236,0.3)",
            textShadow: streakFire
              ? "0 0 24px rgba(212,165,116,0.8), 0 0 48px rgba(212,165,116,0.4)"
              : streakWarm ? "0 0 16px rgba(212,165,116,0.4)" : "none",
          }}>
            {streak}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10, color: "rgba(254,248,236,0.32)",
            textTransform: "uppercase", letterSpacing: "1.8px", marginTop: 8,
          }}>
            Jours de suite
          </div>
        </div>

        {/* XP */}
        <div style={{
          flex: 1, padding: "20px 16px",
          background: "#0c2830",
          borderRadius: 20,
          boxShadow: "8px 8px 22px rgba(0,0,0,0.55), -3px -3px 9px rgba(255,255,255,0.025), inset 0 1px 0 rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.05)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 10%, rgba(20,80,100,0.4), transparent 60%)", pointerEvents: "none" }} />
          <div style={{ fontSize: 30, marginBottom: 12, filter: "drop-shadow(0 0 8px rgba(100,215,235,0.6))" }}>⭐</div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 42, fontWeight: 800, lineHeight: 1,
            color: "#fef8ec",
            textShadow: "0 0 28px rgba(100,215,235,0.28)",
          }}>
            {xp}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10, color: "rgba(254,248,236,0.32)",
            textTransform: "uppercase", letterSpacing: "1.8px", marginTop: 8,
          }}>
            Points XP
          </div>
        </div>
      </div>

      {/* ── NEXT MODULE ─────────────────────────────────────────────────────── */}
      {nextModule ? (
        <NextModuleCard
          module={nextModule}
          parcoursId={nextParcoursId}
          percent={getModulePercent(nextParcoursId, nextModule.id)}
          onStart={() => onOpenModule(nextParcoursId, nextModule.id)}
        />
      ) : (
        <div style={{ ...glassCard, padding: "20px 22px", marginBottom: 14 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(254,248,236,0.38)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 }}>
            Prochain module
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(254,248,236,0.45)", fontStyle: "italic" }}>
            {progressLoading ? "Chargement..." : "Tous vos parcours sont complétés 🎉"}
          </div>
        </div>
      )}

      {/* ── PARCOURS PROGRESS ───────────────────────────────────────────────── */}
      {parcoursProgress.some(p => p.done > 0) && (
        <div style={{ ...glassCard, padding: "20px 22px", marginBottom: 14 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(254,248,236,0.38)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 20 }}>
            Ma progression
          </div>
          {parcoursProgress.map(({ id, titleFr, done, total, percent, started, color }) => (
            <div key={id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                  color: started ? "rgba(254,248,236,0.85)" : "rgba(254,248,236,0.25)",
                }}>
                  {titleFr}
                </span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
                  color: percent === 100 ? color : "rgba(254,248,236,0.3)",
                }}>
                  {done}/{total} {percent === 100 ? "✓" : ""}
                </span>
              </div>
              <div style={{ height: 7, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 999,
                  width: `${percent}%`,
                  background: percent === 100 ? color : "#2a8fa0",
                  boxShadow: percent > 0 ? `0 0 10px ${percent === 100 ? color : "#2a8fa0"}99` : "none",
                  transition: "width 0.55s cubic-bezier(0.34,1.2,0.64,1)",
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── RECENT ACTIVITY + LEADERBOARD ───────────────────────────────────── */}
      <RecentActivity progress={progress} onOpenModule={onOpenModule} />
      <MiniLeaderboard onViewAll={() => onSwitchTab("classement")} />
    </div>
  );
};
