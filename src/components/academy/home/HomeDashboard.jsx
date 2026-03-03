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

// ── Signature: botanical tally marks for streak ─────────────────────────────
// Groups of 5 with 8px gap between groups. Max 10 marks shown.
const StreakTally = ({ count }) => {
  const copper = "#c2744a";
  const capped = Math.min(Math.abs(count || 0), 10);
  const getX = (i) => i * 7 + Math.floor(i / 5) * 8 + 3;
  const svgW = capped > 0 ? getX(capped - 1) + 8 : 10;

  return (
    <svg width={svgW} height="22" viewBox={`0 0 ${svgW} 22`} fill="none" aria-label={`Streak: ${count} jours`}>
      {capped === 0 ? (
        <line x1="3" y1="4" x2="3" y2="18" stroke={copper} strokeWidth="1.5" strokeLinecap="round" opacity="0.20" />
      ) : (
        Array.from({ length: capped }, (_, i) => (
          <line key={i}
            x1={getX(i)} y1="4"
            x2={getX(i)} y2="18"
            stroke={copper} strokeWidth="1.5" strokeLinecap="round"
          />
        ))
      )}
    </svg>
  );
};

// ── Signature: botanical leaf-vein watermark ────────────────────────────────
// Placed absolute inside a position:relative / overflow:hidden container.
const LeafVein = ({ style }) => (
  <svg
    width="130" height="84"
    viewBox="0 0 130 84"
    fill="none"
    aria-hidden="true"
    style={{ position: "absolute", pointerEvents: "none", color: "var(--text-1)", ...style }}
  >
    {/* Central rib */}
    <path d="M 6 78 C 35 58 72 34 124 6" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" />
    {/* Lateral veins */}
    <path d="M 18 70 Q 40 62 58 52" stroke="currentColor" strokeWidth="0.60" strokeLinecap="round" />
    <path d="M 33 62 Q 52 54 68 44" stroke="currentColor" strokeWidth="0.55" strokeLinecap="round" />
    <path d="M 48 52 Q 66 44 80 36" stroke="currentColor" strokeWidth="0.50" strokeLinecap="round" />
    <path d="M 66 42 Q 82 36 94 28" stroke="currentColor" strokeWidth="0.45" strokeLinecap="round" />
    <path d="M 84 32 Q 98 26 108 20" stroke="currentColor" strokeWidth="0.40" strokeLinecap="round" />
    <path d="M 20 74 Q 42 70 56 60" stroke="currentColor" strokeWidth="0.55" strokeLinecap="round" />
    <path d="M 37 65 Q 58 62 72 52" stroke="currentColor" strokeWidth="0.50" strokeLinecap="round" />
  </svg>
);

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

      {/* ── HERO — immersive typographic ──────────────────────────────────── */}
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

        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 17, fontStyle: "italic",
          color: "var(--text-3)", marginTop: 10, lineHeight: 1.5,
        }}>
          {completedModules > 0
            ? `${completedModules} module${completedModules > 1 ? "s" : ""} maîtrisé${completedModules > 1 ? "s" : ""} sur ${totalModules}`
            : "Le parcours commence ici"}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
          <div style={{ height: 1, width: 32, background: "rgba(194,116,74,0.50)", flexShrink: 0 }} />
          <div style={{ ...CAP }}>
            {ROLE_LABELS[role] || "Apprenant"} · Arduenna Academy
          </div>
        </div>
      </div>

      {/* ── KPI STRIP — tally marks + serif XP ────────────────────────────── */}
      <div style={{
        display: "flex",
        padding: "28px 24px 28px",
        borderBottom: "1px solid var(--border-subtle)",
      }}>
        {/* Streak — botanical tally marks */}
        <div style={{ flex: 1 }}>
          <div style={{ ...CAP, marginBottom: 12 }}>Série</div>
          <div style={{ marginBottom: 8 }}>
            <StreakTally count={streak} />
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, color: "var(--text-4)", lineHeight: 1.4,
          }}>
            {streak === 0 ? "Commencez aujourd'hui"
              : streak === 1 ? "1 jour — bon début"
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

        {/* XP — gem prefix + Cormorant italic */}
        <div style={{ flex: 1 }}>
          <div style={{ ...CAP, marginBottom: 12 }}>XP</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 8 }}>
            <span style={{
              color: "#c2744a", fontSize: 15, lineHeight: 1,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            }}>◆</span>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 42, fontWeight: 500, fontStyle: "italic", lineHeight: 1,
              color: "var(--text-1)", letterSpacing: "-0.5px",
            }}>
              {xp}
            </div>
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, color: "var(--text-4)", lineHeight: 1.4,
          }}>
            {xp === 0 ? "Complétez un module" : "points accumulés"}
          </div>
        </div>
      </div>

      {/* ── NEXT MODULE — tonal band + leaf watermark ─────────────────────── */}
      <div style={{
        background: "var(--module-tint)",
        padding: "28px 24px 36px",
        borderBottom: "1px solid var(--border-subtle)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Botanical watermark — bottom-right */}
        <LeafVein style={{ right: -6, bottom: -6, opacity: 0.055 }} />

        <div style={{ ...CAP, marginBottom: 22, position: "relative" }}>Prochain module</div>
        <div style={{ position: "relative" }}>
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
      </div>

      {/* ── PARCOURS PROGRESS — leaf terminus on bars ─────────────────────── */}
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
              {/* Progress bar with leaf-diamond terminus */}
              <div style={{
                position: "relative", height: 2,
                borderRadius: 999, background: "var(--border-subtle)",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0,
                  height: "100%", borderRadius: 999,
                  width: `${percent}%`,
                  background: percent === 100 ? color : "rgba(194,116,74,0.55)",
                  transition: "width 0.5s ease-out",
                }} />
                {/* Leaf terminus dot — visible if started but not complete */}
                {percent > 3 && percent < 100 && (
                  <div style={{
                    position: "absolute",
                    left: `${percent}%`,
                    top: "50%",
                    transform: "translate(-50%, -50%) rotate(45deg)",
                    width: 7, height: 7,
                    background: "rgba(194,116,74,0.65)",
                    borderRadius: "0 2px 0 2px",
                    transition: "left 0.5s ease-out",
                  }} />
                )}
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
