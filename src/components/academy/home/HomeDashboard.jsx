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

// ── Botanical level hierarchy ───────────────────────────────────────────────
const LEVELS = [
  { level: 1, title: "Apprenti Botaniste",   xpStart: 0,    xpNeeded: 300 },
  { level: 2, title: "Herboriste",           xpStart: 300,  xpNeeded: 400 },
  { level: 3, title: "Distillateur",         xpStart: 700,  xpNeeded: 600 },
  { level: 4, title: "Maître de Gin",        xpStart: 1300, xpNeeded: 900 },
  { level: 5, title: "Ambassadeur Arduenna", xpStart: 2200, xpNeeded: null },
];

// ── Circular SVG progress ring ──────────────────────────────────────────────
// Center shows level number. Copper arc shows % to next level.
const ProgressRing = ({ level, percent }) => {
  const R = 33;
  const C = parseFloat((2 * Math.PI * R).toFixed(2)); // ~207.3
  const offset = parseFloat((C * (1 - percent / 100)).toFixed(2));

  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      {/* Track */}
      <circle
        cx="40" cy="40" r={R}
        stroke="var(--border-subtle)" strokeWidth="2.5"
      />
      {/* Progress arc — starts from 12 o'clock */}
      <circle
        cx="40" cy="40" r={R}
        stroke="#c2744a" strokeWidth="2.5"
        strokeDasharray={C}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
      />
      {/* Level number — Cormorant italic, large */}
      <text
        x="40" y="45"
        textAnchor="middle" dominantBaseline="auto"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="30" fontStyle="italic" fontWeight="500"
        fill="var(--text-1)"
      >
        {level}
      </text>
    </svg>
  );
};

// ── Botanical tally marks for streak ───────────────────────────────────────
// Vertical lines, groups of 5 with wider spacing.
const StreakTally = ({ count }) => {
  const copper = "#c2744a";
  const capped = Math.min(Math.abs(count || 0), 10);
  const getX = (i) => i * 7 + Math.floor(i / 5) * 8 + 3;
  const svgW = capped > 0 ? getX(capped - 1) + 8 : 10;

  return (
    <svg width={svgW} height="20" viewBox={`0 0 ${svgW} 20`} fill="none" aria-hidden="true">
      {capped === 0 ? (
        <line x1="3" y1="4" x2="3" y2="16" stroke={copper} strokeWidth="1.5" strokeLinecap="round" opacity="0.20" />
      ) : (
        Array.from({ length: capped }, (_, i) => (
          <line key={i}
            x1={getX(i)} y1="4" x2={getX(i)} y2="16"
            stroke={copper} strokeWidth="1.5" strokeLinecap="round"
          />
        ))
      )}
    </svg>
  );
};

// ── Botanical leaf-vein watermark ───────────────────────────────────────────
const LeafVein = ({ style }) => (
  <svg
    width="130" height="84" viewBox="0 0 130 84" fill="none"
    aria-hidden="true"
    style={{ position: "absolute", pointerEvents: "none", color: "var(--text-1)", ...style }}
  >
    <path d="M 6 78 C 35 58 72 34 124 6" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" />
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
  // ── Level computation ────────────────────────────────────────────────────
  const currentLevel = [...LEVELS].reverse().find(l => xp >= l.xpStart) || LEVELS[0];
  const xpInLevel = xp - currentLevel.xpStart;
  const levelPercent = currentLevel.xpNeeded
    ? Math.min(100, Math.round((xpInLevel / currentLevel.xpNeeded) * 100))
    : 100;
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);

  // ── Next module ──────────────────────────────────────────────────────────
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

  // ── Parcours progress ────────────────────────────────────────────────────
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

      {/* ── IDENTITY HEADER — compact, orienting ──────────────────────────── */}
      <div style={{
        padding: "32px 24px 24px",
        borderBottom: "1px solid var(--border-subtle)",
      }}>
        <div style={{ ...CAP, marginBottom: 10 }}>{dayCapitalized}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 42, fontWeight: 600, fontStyle: "italic",
            color: "var(--text-1)", lineHeight: 1, letterSpacing: "-0.5px",
          }}>
            {firstName}
          </span>
          <span style={{ ...CAP, color: "var(--text-4)" }}>
            {ROLE_LABELS[role] || "Apprenant"}
          </span>
        </div>
        {completedModules > 0 && (
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 14, fontStyle: "italic",
            color: "var(--text-3)", marginTop: 6,
          }}>
            {completedModules} module{completedModules > 1 ? "s" : ""} maîtrisé{completedModules > 1 ? "s" : ""} sur {totalModules}
          </div>
        )}
      </div>

      {/* ── PROGRESSION BLOCK — emotional anchor ──────────────────────────── */}
      <div style={{
        padding: "24px 24px 20px",
        background: "var(--module-tint)",
        borderBottom: "1px solid var(--border-subtle)",
        position: "relative",
        overflow: "hidden",
      }}>
        <LeafVein style={{ right: -6, bottom: -8, opacity: 0.055 }} />

        {/* Split: ring left, info column right */}
        <div style={{
          display: "flex", alignItems: "center", gap: 20,
          position: "relative",
        }}>
          <ProgressRing level={currentLevel.level} percent={levelPercent} />

          <div style={{ flex: 1 }}>
            {/* Level label */}
            <div style={{ ...CAP, marginBottom: 5 }}>Niveau {currentLevel.level}</div>

            {/* Level title — the narrative reward */}
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 22, fontWeight: 600, fontStyle: "italic",
              color: "var(--text-1)", lineHeight: 1.1, marginBottom: 10,
            }}>
              {currentLevel.title}
            </div>

            {/* XP fraction */}
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 17, fontStyle: "italic",
              lineHeight: 1, marginBottom: 10,
            }}>
              <span style={{ color: "var(--text-1)", fontWeight: 500 }}>{xpInLevel}</span>
              <span style={{ color: "var(--text-3)", fontWeight: 400 }}>
                {currentLevel.xpNeeded ? ` / ${currentLevel.xpNeeded} XP` : " XP"}
              </span>
            </div>

            {/* Hairline divider */}
            <div style={{ height: 1, background: "var(--border-subtle)", marginBottom: 8 }} />

            {/* Next unlock */}
            {nextLevel ? (
              <div>
                <div style={{ ...CAP, marginBottom: 3 }}>Prochain</div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12, fontWeight: 500,
                  color: "#c2744a",
                }}>
                  {nextLevel.title}
                </div>
              </div>
            ) : (
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12, color: "var(--text-3)", fontStyle: "italic",
              }}>
                Niveau maximum atteint
              </div>
            )}
          </div>
        </div>

        {/* Streak row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          marginTop: 20, paddingTop: 16,
          borderTop: "1px solid var(--border-subtle)",
          position: "relative",
        }}>
          <div style={{ ...CAP, whiteSpace: "nowrap" }}>Série</div>
          <StreakTally count={streak} />
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, color: "var(--text-4)", lineHeight: 1.4,
          }}>
            {streak === 0 ? "Commencez aujourd'hui"
              : streak === 1 ? "1 jour — bon début"
              : `${streak} jour${streak > 1 ? "s" : ""}`}
          </div>
        </div>
      </div>

      {/* ── NEXT MODULE ───────────────────────────────────────────────────── */}
      <div style={{
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

      {/* ── PARCOURS PROGRESS ─────────────────────────────────────────────── */}
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
              <div style={{ position: "relative", height: 2, borderRadius: 999, background: "var(--border-subtle)" }}>
                <div style={{
                  position: "absolute", top: 0, left: 0,
                  height: "100%", borderRadius: 999,
                  width: `${percent}%`,
                  background: percent === 100 ? color : "rgba(194,116,74,0.55)",
                  transition: "width 0.5s ease-out",
                }} />
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

      {/* ── RECENT ACTIVITY ──────────────────────────────────────────────── */}
      <div style={{ padding: "0 24px" }}>
        <RecentActivity progress={progress} onOpenModule={onOpenModule} />
      </div>

      {/* ── MINI LEADERBOARD ─────────────────────────────────────────────── */}
      <div style={{ padding: "0 24px" }}>
        <MiniLeaderboard onViewAll={() => onSwitchTab("classement")} />
      </div>

    </div>
  );
};
