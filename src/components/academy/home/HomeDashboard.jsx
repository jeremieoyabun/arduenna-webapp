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
    <div style={{ paddingBottom: 48 }}>

      {/* ── HERO — immersive, full-bleed typographic ──────────────────────── */}
      <div style={{
        padding: "52px 24px 44px",
        background: "linear-gradient(170deg, var(--module-tint) 0%, var(--bg) 65%)",
        borderBottom: "1px solid var(--border-subtle)",
      }}>
        <div style={{ ...CAP, marginBottom: 20 }}>{dayCapitalized}</div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 62, fontWeight: 600, fontStyle: "italic",
          color: "var(--text-1)", margin: 0, lineHeight: 1,
          letterSpacing: "-0.5px",
        }}>
          {firstName}
        </h1>

        {/* Poetic subtitle — Cormorant italic, not DM Sans */}
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 17, fontStyle: "italic",
          color: "var(--text-3)", marginTop: 10, lineHeight: 1.5,
        }}>
          {completedModules > 0
            ? `${completedModules} module${completedModules > 1 ? "s" : ""} maîtrisé${completedModules > 1 ? "s" : ""} sur ${totalModules}`
            : "Le parcours commence ici"}
        </div>

        {/* Copper hairline + role context */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
          <div style={{
            height: 1, width: 32,
            background: "rgba(194,116,74,0.50)",
            flexShrink: 0,
          }} />
          <div style={{ ...CAP }}>
            {ROLE_LABELS[role] || "Apprenant"} · Arduenna Academy
          </div>
        </div>
      </div>

      {/* ── KPI STRIP — bare numbers, no card chrome ──────────────────────── */}
      <div style={{
        display: "flex",
        padding: "28px 24px 28px",
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
          margin: "4px 32px 0",
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

      {/* ── NEXT MODULE — tonal band, editorial featured ───────────────────── */}
      <div style={{
        background: "var(--module-tint)",
        padding: "28px 24px 36px",
        borderBottom: "1px solid var(--border-subtle)",
      }}>
        <div style={{ ...CAP, marginBottom: 22 }}>Prochain module</div>
        {nextModule ? (
          <NextModuleCard
            module={nextModule}
            parcoursId={nextParcoursId}
            percent={getModulePercent(nextParcoursId, nextModule.id)}
            onStart={() => onOpenModule(nextParcoursId, nextModule.id)}
          />
        ) : (
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 19, fontStyle: "italic",
            color: "var(--text-3)",
          }}>
            {progressLoading ? "Chargement…" : "Tous vos parcours sont complétés 🎉"}
          </div>
        )}
      </div>

      {/* ── PARCOURS PROGRESS ────────────────────────────────────────────────── */}
      {parcoursProgress.some(p => p.done > 0) && (
        <div style={{ padding: "28px 24px 8px" }}>
          <div style={{ ...CAP, marginBottom: 22 }}>Ma progression</div>
          {parcoursProgress.map(({ id, titleFr, done, total, percent, started, color }) => (
            <div key={id} style={{ marginBottom: 22 }}>
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

      {/* ── RECENT ACTIVITY ──────────────────────────────────────────────────── */}
      <div style={{ padding: "0 24px" }}>
        <RecentActivity progress={progress} onOpenModule={onOpenModule} />
      </div>

      {/* ── MINI LEADERBOARD ─────────────────────────────────────────────────── */}
      <div style={{ padding: "0 24px" }}>
        <MiniLeaderboard onViewAll={() => onSwitchTab("classement")} />
      </div>

    </div>
  );
};
