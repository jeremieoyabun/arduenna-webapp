import { useState, useEffect } from "react";
import { BadgesRow } from "./BadgesRow";
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

const CAP = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 10, fontWeight: 600,
  color: "var(--text-3)",
  textTransform: "uppercase", letterSpacing: "2.5px",
};

const LEVELS = [
  { level: 1, title: "Apprenti Botaniste",   xpStart: 0,    xpNeeded: 300 },
  { level: 2, title: "Herboriste",           xpStart: 300,  xpNeeded: 400 },
  { level: 3, title: "Distillateur",         xpStart: 700,  xpNeeded: 600 },
  { level: 4, title: "Maître de Gin",        xpStart: 1300, xpNeeded: 900 },
  { level: 5, title: "Ambassadeur Arduenna", xpStart: 2200, xpNeeded: null },
];

// ── Circular SVG progress ring — draws on mount, The Seasons level number ─────
const ProgressRing = ({ level, percent }) => {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const R = 33;
  const C = parseFloat((2 * Math.PI * R).toFixed(2));
  const offset = drawn
    ? parseFloat((C * (1 - percent / 100)).toFixed(2))
    : C;

  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="40" cy="40" r={R} stroke="var(--border-subtle)" strokeWidth="2.5" />
      <circle
        cx="40" cy="40" r={R}
        stroke="#c2744a" strokeWidth="3"
        strokeDasharray={C}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
        style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.2, 1)" }}
      />
      {/* Level number — The Seasons display font */}
      <text
        x="40" y="46"
        textAnchor="middle" dominantBaseline="auto"
        fontFamily="'The Seasons', 'Cormorant Garamond', Georgia, serif"
        fontSize="32" fontWeight="700"
        fill="var(--text-1)"
      >
        {level}
      </text>
    </svg>
  );
};

// ── Animated XP bar ──────────────────────────────────────────────────────────
const XPBar = ({ percent }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.min(100, percent)), 80);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <div style={{ position: "relative", height: 5, borderRadius: 999, background: "var(--border-subtle)" }}>
      <div style={{
        position: "absolute", top: 0, left: 0,
        height: "100%", borderRadius: 999,
        width: `${width}%`,
        background: "linear-gradient(90deg, #c2744a, #d4855e)",
        transition: "width 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
      }} />
      {width > 3 && width < 100 && (
        <div style={{
          position: "absolute",
          left: `${width}%`,
          top: "50%",
          transform: "translate(-50%, -50%) rotate(45deg)",
          width: 7, height: 7,
          background: "#c2744a",
          borderRadius: "0 2px 0 2px",
          opacity: 0.8,
          transition: "left 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
        }} />
      )}
    </div>
  );
};

// ── Botanical tally marks for streak ─────────────────────────────────────────
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

// ── Botanical leaf-vein watermark ─────────────────────────────────────────────
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

// ── Padlock for locked blocks ─────────────────────────────────────────────────
const PadlockSmall = () => (
  <svg width="10" height="11" viewBox="0 0 10 11" fill="none">
    <rect x="0.6" y="4" width="8.8" height="6.4" rx="1.4" stroke="currentColor" strokeWidth="1.1" />
    <path d="M2.5 4V3a2.5 2.5 0 015 0v1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

// ── Locked content preview block ──────────────────────────────────────────────
const LockedBlock = ({ svgIcon, title, teaser, unlockLabel }) => (
  <div
    className="a-card"
    style={{
      marginBottom: 10, padding: "16px 18px",
      opacity: 0.62,
      borderStyle: "dashed",
      position: "relative",
    }}
  >
    {/* Lock chip — top right */}
    <div style={{
      position: "absolute", top: 12, right: 14,
      display: "flex", alignItems: "center", gap: 4,
      background: "var(--elevated)",
      border: "1px solid var(--border-subtle)",
      borderRadius: 20,
      padding: "3px 8px 3px 6px",
      color: "var(--text-3)",
    }}>
      <PadlockSmall />
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 9, fontWeight: 700,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
      }}>
        {unlockLabel}
      </span>
    </div>

    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingRight: 88 }}>
      {/* Icon */}
      <div style={{
        width: 38, height: 38, borderRadius: 8, flexShrink: 0,
        background: "var(--elevated)",
        border: "1px solid var(--border-subtle)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--text-4)",
      }}>
        {svgIcon}
      </div>

      <div>
        <div style={{
          fontFamily: "var(--font-seasons)",
          fontSize: 15, fontWeight: 700,
          color: "var(--text-2)", lineHeight: 1.2, marginBottom: 4,
        }}>
          {title}
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11, color: "var(--text-4)", lineHeight: 1.45,
        }}>
          {teaser}
        </div>
      </div>
    </div>
  </div>
);

// ── SVG icons for locked blocks ───────────────────────────────────────────────
const SeasonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <path d="M12 22V12M12 12C12 7 17 4 20 3c-1 4-3 7-8 9M12 12C12 7 7 4 4 3c1 4 3 7 8 9" />
  </svg>
);

const AlchimisteIcon = () => (
  <svg width="15" height="18" viewBox="0 0 14 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 1h6M5 5l-4 8h12L9 5H5zM7 13v6M4 19h6" />
    <circle cx="4.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="9" cy="15" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const MasteryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l8 6.5-8 11.5-8-11.5z" />
    <line x1="4" y1="9.5" x2="20" y2="9.5" strokeOpacity="0.45" />
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
  const xpToNext = currentLevel.xpNeeded ? currentLevel.xpNeeded - xpInLevel : null;

  // ── Badges ───────────────────────────────────────────────────────────────
  const earnedBadgeIds = (progress?.badges || []).map(b =>
    typeof b === "string" ? b : b.id
  );

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
    <div style={{ paddingBottom: 60 }}>

      {/* ── IDENTITY HEADER ────────────────────────────────────────────────── */}
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

      {/* ── CARDS COLUMN ───────────────────────────────────────────────────── */}
      <div style={{ padding: "12px 12px 0" }}>

        {/* ── PROGRESSION CARD ─────────────────────────────────────────────── */}
        <div className="a-card" style={{
          marginBottom: 10,
          padding: "20px 20px",
          background: "var(--module-tint)",
          position: "relative",
          overflow: "hidden",
        }}>
          <LeafVein style={{ right: -6, bottom: -8, opacity: 0.055 }} />

          {/* Ring left + info right */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative" }}>

            {/* Ring with radial copper glow behind it */}
            <div style={{ position: "relative", flexShrink: 0, width: 80, height: 80 }}>
              <div style={{
                position: "absolute",
                inset: -14,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(194,116,74,0.16) 30%, transparent 72%)",
                pointerEvents: "none",
              }} />
              <ProgressRing level={currentLevel.level} percent={levelPercent} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...CAP, marginBottom: 4 }}>Niveau {currentLevel.level}</div>

              {/* Level title — The Seasons font */}
              <div style={{
                fontFamily: "var(--font-seasons)",
                fontSize: 20, fontWeight: 700,
                color: "var(--text-1)", lineHeight: 1.15, marginBottom: 10,
              }}>
                {currentLevel.title}
              </div>

              {/* XP bar */}
              <XPBar percent={levelPercent} />

              {/* XP tension — quantified pull toward next level */}
              <div style={{ marginTop: 5, marginBottom: 10 }}>
                {xpToNext !== null ? (
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    color: "#c2744a", letterSpacing: "0.2px",
                  }}>
                    encore {xpToNext} XP → {nextLevel?.title}
                  </span>
                ) : (
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11, color: "var(--text-3)", fontStyle: "italic",
                  }}>
                    Niveau maximum atteint
                  </span>
                )}
              </div>

              {/* Hairline */}
              <div style={{ height: 1, background: "var(--border-subtle)", marginBottom: 8 }} />

              {/* Next unlock */}
              {nextLevel ? (
                <div>
                  <div style={{ ...CAP, marginBottom: 3 }}>Prochain niveau</div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12, fontWeight: 500,
                    color: "var(--text-3)",
                  }}>
                    {nextLevel.title}
                  </div>
                </div>
              ) : (
                <div style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 13, color: "var(--text-3)", fontStyle: "italic",
                }}>
                  Ambassadeur Arduenna atteint
                </div>
              )}
            </div>
          </div>

          {/* Streak row */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            marginTop: 18, paddingTop: 14,
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
        <div className="a-card" style={{ marginBottom: 10, padding: "20px 20px" }}>
          <div style={{ ...CAP, marginBottom: 18 }}>Prochain module</div>
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

        {/* ── BADGES ───────────────────────────────────────────────────────── */}
        <BadgesRow
          earnedBadgeIds={earnedBadgeIds}
          onViewAll={() => onSwitchTab("profil")}
        />

        {/* ── PARCOURS PROGRESS ────────────────────────────────────────────── */}
        {parcoursProgress.some(p => p.done > 0) && (
          <div className="a-card" style={{ marginBottom: 10, padding: "18px 20px" }}>
            <div style={{ ...CAP, marginBottom: 18 }}>Ma progression</div>
            {parcoursProgress.map(({ id, titleFr, done, total, percent, started, color }) => (
              <div key={id} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
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
        <RecentActivity progress={progress} onOpenModule={onOpenModule} />

        {/* ── LOCKED FUTURE CONTENT ────────────────────────────────────────── */}
        <div style={{ ...CAP, marginBottom: 12, marginTop: 4, paddingLeft: 2 }}>À venir</div>

        <LockedBlock
          svgIcon={<SeasonIcon />}
          title="Défi Printemps Botanique"
          teaser="5 défis exclusifs · Badges rares · Classement dédié"
          unlockLabel="Bientôt"
        />

        <LockedBlock
          svgIcon={<AlchimisteIcon />}
          title="Badge Rare · L'Alchimiste"
          teaser="Condition secrète — maîtrisez 3 parcours avec 85%+"
          unlockLabel="Niveau 4"
        />

        <LockedBlock
          svgIcon={<MasteryIcon />}
          title="Parcours Maître Distillateur"
          teaser="4 modules experts · Distillation avancée · Certificat exclusif"
          unlockLabel="Niveau 3"
        />

        {/* ── MINI LEADERBOARD ─────────────────────────────────────────────── */}
        <MiniLeaderboard onViewAll={() => onSwitchTab("classement")} />

      </div>
    </div>
  );
};
