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

// ── Micro-typography token ──────────────────────────────────────────────────
const CAP = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 10, fontWeight: 600,
  color: "var(--text-3)",
  textTransform: "uppercase", letterSpacing: "2.5px",
};

export const HomeDashboard = ({
  firstName, role, xp, streak, progress,
  getModulePercent, isLocked, isCompleted, getParcoursCompletedCount,
  progressLoading, onOpenModule, onSwitchTab,
}) => {
  // ── Next module ─────────────────────────────────────────────────────────
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

  // ── Parcours progress ───────────────────────────────────────────────────
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
    <div style={{ padding: "0 20px" }}>

      {/* ── HERO — editorial, typographic ──────────────────────────────────── */}
      <div style={{
        paddingTop: 40,
        paddingBottom: 32,
        background: "radial-gradient(ellipse 90% 120px at 35% -5%, rgba(74,155,138,0.06) 0%, transparent 100%)",
      }}>
        <div style={{ ...CAP, marginBottom: 18 }}>{dayCapitalized}</div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 50, fontWeight: 600, fontStyle: "italic",
          color: "var(--text-1)", margin: 0, lineHeight: 1,
          letterSpacing: "-0.5px",
        }}>
          {firstName}
        </h1>

        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, color: "var(--text-3)",
          marginTop: 9, letterSpacing: "0.2px",
        }}>
          {ROLE_LABELS[role] || "Apprenant"} · Arduenna Academy
        </div>

        {/* Copper hairline + progress context */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 26 }}>
          <div style={{
            height: 1, width: 40,
            background: "rgba(194,116,74,0.40)",
            flexShrink: 0,
          }} />
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, color: "var(--text-3)",
            letterSpacing: "0.2px",
          }}>
            {completedModules > 0
              ? `${completedModules} module${completedModules > 1 ? "s" : ""} complété${completedModules > 1 ? "s" : ""} sur ${totalModules}`
              : "Prêt à commencer votre parcours"}
          </div>
        </div>
      </div>

      {/* ── KPI STRIP — no cards, single hairline divider only ──────────────── */}
      <div style={{
        display: "flex",
        paddingBottom: 28,
        marginBottom: 24,
        borderBottom: "1px solid var(--border-subtle)",
      }}>
        {/* Streak */}
        <div style={{ flex: 1 }}>
          <div style={{ ...CAP, marginBottom: 10 }}>Streak</div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 46, fontWeight: 800, lineHeight: 1,
            color: streak >= 4 ? "#D4A574" : "var(--text-3)",
            letterSpacing: "-1.5px",
          }}>
            {streak}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, color: "var(--text-4)",
            marginTop: 7, lineHeight: 1.4,
          }}>
            {streak === 0 ? "Commencez aujourd'hui"
              : streak === 1 ? "Bon début !"
              : `${streak} jours`}
          </div>
        </div>

        {/* Vertical hairline */}
        <div style={{
          width: 1,
          background: "var(--border-subtle)",
          margin: "4px 28px 0",
          alignSelf: "stretch",
        }} />

        {/* XP */}
        <div style={{ flex: 1 }}>
          <div style={{ ...CAP, marginBottom: 10 }}>XP</div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 46, fontWeight: 800, lineHeight: 1,
            color: "var(--text-1)",
            letterSpacing: "-1.5px",
          }}>
            {xp}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, color: "var(--text-4)",
            marginTop: 7, lineHeight: 1.4,
          }}>
            {xp === 0 ? "Complétez un module" : "points accumulés"}
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
        <div style={{
          background: "var(--surface)",
          borderRadius: 8,
          border: "1px solid var(--border-subtle)",
          padding: "20px",
          marginBottom: 10,
        }}>
          <div style={{ ...CAP, marginBottom: 10 }}>Prochain module</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 18, fontStyle: "italic",
            color: "var(--text-3)",
          }}>
            {progressLoading ? "Chargement…" : "Tous vos parcours sont complétés 🎉"}
          </div>
        </div>
      )}

      {/* ── PARCOURS PROGRESS ───────────────────────────────────────────────── */}
      {parcoursProgress.some(p => p.done > 0) && (
        <div style={{
          background: "var(--surface)",
          borderRadius: 8,
          border: "1px solid var(--border-subtle)",
          padding: "20px",
          marginBottom: 10,
        }}>
          <div style={{ ...CAP, marginBottom: 22 }}>Ma progression</div>
          {parcoursProgress.map(({ id, titleFr, done, total, percent, started, color }) => (
            <div key={id} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 9 }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  color: started ? "var(--text-2)" : "var(--text-4)",
                  fontWeight: started ? 500 : 400,
                }}>
                  {titleFr}
                </span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
                  color: percent === 100 ? color : "var(--text-4)",
                }}>
                  {done}/{total}
                </span>
              </div>
              <div style={{ height: 2, borderRadius: 999, background: "var(--border-subtle)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 999,
                  width: `${percent}%`,
                  background: percent === 100 ? color : "rgba(194,116,74,0.55)",
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
