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

// ── Design tokens ──────────────────────────────────────────────────────────────
const SURFACE  = "#0d2832";
const BORDER   = "1px solid rgba(254,248,236,0.05)";
const R        = 14;   // border-radius
const LABEL_S  = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 10, fontWeight: 600,
  color: "rgba(254,248,236,0.3)",
  textTransform: "uppercase", letterSpacing: "2.5px",
};

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

  const totalModules = modulesData.length;
  const completedModules = eligibleParcours.reduce(
    (acc, p) => acc + getParcoursCompletedCount(p.id), 0
  );

  const dayOfWeek = new Intl.DateTimeFormat("fr-FR", { weekday: "long" }).format(new Date());
  const dayCapitalized = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

  return (
    <div style={{ padding: "0 18px" }}>

      {/* ── HERO — typographic, editorial, no card ───────────────────────── */}
      <div style={{ paddingTop: 36, paddingBottom: 30 }}>

        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11, fontWeight: 600,
          color: "rgba(254,248,236,0.3)",
          textTransform: "uppercase", letterSpacing: "3px",
          marginBottom: 16,
        }}>
          {dayCapitalized}
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 46, fontWeight: 600, fontStyle: "italic",
          color: "#fef8ec", margin: 0, lineHeight: 1.02,
        }}>
          {firstName}
        </h1>

        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, color: "rgba(254,248,236,0.38)",
          marginTop: 8, letterSpacing: "0.2px",
        }}>
          {ROLE_LABELS[role] || "Apprenant"} · Arduenna Academy
        </div>

        {/* Copper separator + progress context */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 26 }}>
          <div style={{
            height: 1, width: 48,
            background: "rgba(194,116,74,0.55)",
            flexShrink: 0,
          }} />
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, color: "rgba(254,248,236,0.36)",
            letterSpacing: "0.2px",
          }}>
            {completedModules > 0
              ? `${completedModules} module${completedModules > 1 ? "s" : ""} complété${completedModules > 1 ? "s" : ""} sur ${totalModules}`
              : "Prêt à commencer votre parcours"}
          </div>
        </div>
      </div>

      {/* ── KPI CARDS — clean surface, contextual helper text ────────────── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>

        {/* Streak */}
        <div style={{
          flex: 1, padding: "18px 16px",
          background: SURFACE, borderRadius: R, border: BORDER,
        }}>
          <div style={{ ...LABEL_S, marginBottom: 10 }}>Streak</div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 40, fontWeight: 800, lineHeight: 1,
            color: streak >= 4 ? "#D4A574" : "rgba(254,248,236,0.5)",
          }}>
            {streak}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, color: "rgba(254,248,236,0.28)",
            marginTop: 8, lineHeight: 1.4,
          }}>
            {streak === 0 ? "Commencez aujourd'hui"
              : streak === 1 ? "Bon début !"
              : `${streak} jours consécutifs`}
          </div>
        </div>

        {/* XP */}
        <div style={{
          flex: 1, padding: "18px 16px",
          background: SURFACE, borderRadius: R, border: BORDER,
        }}>
          <div style={{ ...LABEL_S, marginBottom: 10 }}>XP</div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 40, fontWeight: 800, lineHeight: 1,
            color: "#fef8ec",
          }}>
            {xp}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, color: "rgba(254,248,236,0.28)",
            marginTop: 8, lineHeight: 1.4,
          }}>
            {xp === 0 ? "Complétez un module"
              : `${xp} points accumulés`}
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
        <div style={{ background: SURFACE, borderRadius: R, border: BORDER, padding: "20px", marginBottom: 10 }}>
          <div style={{ ...LABEL_S, marginBottom: 10 }}>Prochain module</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 18, fontStyle: "italic",
            color: "rgba(254,248,236,0.45)",
          }}>
            {progressLoading ? "Chargement…" : "Tous vos parcours sont complétés 🎉"}
          </div>
        </div>
      )}

      {/* ── PARCOURS PROGRESS ───────────────────────────────────────────────── */}
      {parcoursProgress.some(p => p.done > 0) && (
        <div style={{ background: SURFACE, borderRadius: R, border: BORDER, padding: "20px", marginBottom: 10 }}>
          <div style={{ ...LABEL_S, marginBottom: 22 }}>Ma progression</div>
          {parcoursProgress.map(({ id, titleFr, done, total, percent, started, color }) => (
            <div key={id} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  color: started ? "rgba(254,248,236,0.8)" : "rgba(254,248,236,0.2)",
                  fontWeight: started ? 500 : 400,
                }}>
                  {titleFr}
                </span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
                  color: percent === 100 ? color : "rgba(254,248,236,0.25)",
                }}>
                  {done}/{total}
                </span>
              </div>
              <div style={{ height: 3, borderRadius: 999, background: "rgba(254,248,236,0.07)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 999,
                  width: `${percent}%`,
                  background: percent === 100 ? color : "rgba(194,116,74,0.65)",
                  transition: "width 0.5s ease-out",
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── RECENT ACTIVITY ─────────────────────────────────────────────────── */}
      <RecentActivity progress={progress} onOpenModule={onOpenModule} />

      {/* ── MINI LEADERBOARD ────────────────────────────────────────────────── */}
      <MiniLeaderboard onViewAll={() => onSwitchTab("classement")} />

    </div>
  );
};
