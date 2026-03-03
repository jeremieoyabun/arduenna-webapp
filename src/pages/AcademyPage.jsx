import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";
import { useProgress } from "../hooks/useProgress";
import { ParcoursGrid } from "../components/academy/parcours/ParcoursGrid";
import { ParcoursDetail } from "../components/academy/parcours/ParcoursDetail";
import { ModuleDetail } from "../components/academy/parcours/ModuleDetail";
import { LessonEngine } from "../components/academy/lessons/LessonEngine";
import { LeaderboardView } from "../components/academy/leaderboard/LeaderboardView";
import { BadgeGrid } from "../components/academy/gamification/BadgeGrid";
import { HomeDashboard } from "../components/academy/home/HomeDashboard";
import { CertificateCard } from "../components/academy/certificates/CertificateCard";
import { modulesData } from "../data/academy/modules";
import { parcoursData } from "../data/academy/parcours";

// ── Tab bar ──────────────────────────────────────────────────────────────────

const tabs = [
  { id: "accueil", label: "Accueil", icon: "home" },
  { id: "parcours", label: "Parcours", icon: "book" },
  { id: "classement", label: "Classement", icon: "trophy" },
  { id: "profil", label: "Profil", icon: "user" },
];

const TabIcon = ({ type, active }) => {
  const color = active ? "var(--accent-secondary)" : "var(--text-muted)";
  const icons = {
    home: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    book: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
    trophy: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
        <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
        <path d="M18 2H6v7a6 6 0 0012 0V2z" />
      </svg>
    ),
    user: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  };
  return icons[type] || null;
};

// ── Shared styles ─────────────────────────────────────────────────────────────

const card = {
  background: "var(--bg-surface)",
  borderRadius: 12,
  border: "1px solid var(--border-light)",
  boxShadow: "0 2px 12px rgba(11,54,61,0.03)",
};

const label = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 11,
  color: "var(--text-tertiary)",
  textTransform: "uppercase",
  letterSpacing: 1.5,
};

// ── Role labels ───────────────────────────────────────────────────────────────

const ROLE_LABELS = {
  bartender: "Bartender",
  commercial: "Commercial",
  caviste: "Caviste / Distributeur",
};

// ── Academy Page ──────────────────────────────────────────────────────────────

export const AcademyPage = () => {
  const { user, profile, loading: authLoading, logout } = useAuth();
  const progressHook = useProgress();
  const { xp, streak, getModulePercent, isLocked, isCompleted, getNextModule, getParcoursCompletedCount, loading: progressLoading } = progressHook;

  const [activeTab, setActiveTab] = useState("accueil");
  // view: "tabs" | "parcours-detail" | "module-detail" | "lesson"
  const [view, setView] = useState("tabs");
  const [selectedParcoursId, setSelectedParcoursId] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, color: "var(--accent-secondary)", fontStyle: "italic" }}>
          Chargement...
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = async () => { await logout(); navigate("/"); };

  const firstName = profile?.firstName || user.displayName || user.email?.split("@")[0] || "Apprenant";
  const role = profile?.role;

  // ── Navigation handlers ──────────────────────────────────────────────────

  const openParcours = (parcoursId) => {
    setSelectedParcoursId(parcoursId);
    setView("parcours-detail");
  };

  const openModule = (moduleId) => {
    setSelectedModuleId(moduleId);
    setView("module-detail");
  };

  const startLesson = () => {
    // Mission 9 will wire this to LessonEngine
    setView("lesson");
  };

  const goBack = () => {
    if (view === "lesson") { setView("module-detail"); return; }
    if (view === "module-detail") { setView("parcours-detail"); return; }
    if (view === "parcours-detail") { setView("tabs"); return; }
  };

  const switchTab = (tabId) => {
    setView("tabs");
    setActiveTab(tabId);
  };

  // ── Accueil tab ──────────────────────────────────────────────────────────

  const renderAccueil = () => (
    <HomeDashboard
      firstName={firstName}
      role={role}
      xp={xp}
      streak={streak}
      progress={progressHook.progress}
      getModulePercent={getModulePercent}
      isLocked={isLocked}
      isCompleted={isCompleted}
      getParcoursCompletedCount={getParcoursCompletedCount}
      progressLoading={progressLoading}
      onOpenModule={(parcoursId, moduleId) => {
        setSelectedParcoursId(parcoursId);
        setSelectedModuleId(moduleId);
        setView("module-detail");
      }}
      onSwitchTab={switchTab}
    />
  );

  // ── Classement tab ───────────────────────────────────────────────────────

  const renderClassement = () => <LeaderboardView />;

  // ── Profil tab ───────────────────────────────────────────────────────────

  const renderProfil = () => {
    const p1completed = getParcoursCompletedCount("univers");
    const p1total = modulesData.filter(m => m.parcoursId === "univers").length;
    const earnedBadges = progressHook.progress?.badges || [];

    // Earned certificates: parcours where completedAt is set
    const earnedCerts = parcoursData.filter(p =>
      !!progressHook.progress?.parcours?.[p.id]?.completedAt
    );

    return (
      <div style={{ padding: "28px 20px" }}>
        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 999,
            background: "#c2744a", margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-on-dark)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 32, fontWeight: 400, fontStyle: "italic",
          }}>
            {firstName[0].toUpperCase()}
          </div>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 22, fontWeight: 400, fontStyle: "italic",
            color: "var(--text-primary)", marginBottom: 6,
          }}>
            {firstName}
          </h2>

          {role && (
            <div style={{
              display: "inline-block",
              padding: "4px 14px", borderRadius: 999,
              background: "rgba(194,116,74,0.1)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--accent-secondary)",
              marginBottom: 4,
            }}>
              {ROLE_LABELS[role] || role}
            </div>
          )}

          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--text-tertiary)", marginTop: 6 }}>
            {user.email}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            { icon: "⭐", value: xp, label: "XP total" },
            { icon: "🔥", value: `${streak}j`, label: "Streak" },
            { icon: "📚", value: p1completed, label: "Modules faits" },
            { icon: "🏅", value: earnedBadges.length, label: "Badges" },
          ].map(({ icon, value, label: lbl }) => (
            <div key={lbl} style={{ ...card, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>
                  {value}
                </div>
                <div style={{ ...label }}>{lbl}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Progression parcours — all 4 (dynamic) */}
        <div style={{ ...card, padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ ...label, marginBottom: 14 }}>Progression parcours</div>
          {parcoursData.map(p => {
            const total = modulesData.filter(m => m.parcoursId === p.id).length;
            const done = getParcoursCompletedCount(p.id);
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const active = !!progressHook.progress?.parcours?.[p.id];
            return (
              <div key={p.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                    color: active ? "var(--text-secondary)" : "var(--text-muted)", fontWeight: active ? 500 : 400,
                  }}>
                    {p.titleFr}
                  </span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--text-tertiary)" }}>
                    {active ? `${done}/${total}` : "—"}
                  </span>
                </div>
                <div style={{ height: 5, borderRadius: 999, background: "var(--border-light)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 999,
                    width: `${pct}%`,
                    background: pct === 100 ? p.color : "#0b363d",
                    transition: "width 0.4s ease-out",
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Badges */}
        <div style={{ ...card, padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ ...label, marginBottom: 14 }}>
            Mes Badges ({earnedBadges.length}/10)
          </div>
          <BadgeGrid earnedBadges={earnedBadges} />
          {earnedBadges.length === 0 && (
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12,
              color: "var(--text-muted)", textAlign: "center",
              marginTop: 12, fontStyle: "italic",
            }}>
              Complétez des modules pour débloquer vos badges
            </div>
          )}
        </div>

        {/* Certificates */}
        {earnedCerts.length > 0 && (
          <div style={{ ...card, padding: "18px 20px", marginBottom: 16 }}>
            <div style={{ ...label, marginBottom: 14 }}>
              Mes Certificats ({earnedCerts.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {earnedCerts.map(p => (
                <CertificateCard
                  key={p.id}
                  parcoursTitle={p.certificateFr}
                  completedAt={progressHook.progress.parcours[p.id].completedAt}
                  userName={firstName}
                  color={p.color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%", padding: "14px 24px",
            background: "transparent", color: "var(--accent-secondary)",
            border: "1px solid rgba(194,116,74,0.25)",
            borderRadius: 8,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Se déconnecter
        </button>
      </div>
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────

  // Full-screen views (no bottom tab bar)
  if (view === "parcours-detail") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
        <AcademyHeader />
        <ParcoursDetail
          parcoursId={selectedParcoursId}
          onBack={goBack}
          onSelectModule={(moduleId) => { setSelectedModuleId(moduleId); setView("module-detail"); }}
          getModulePercent={(parcoursId, moduleId) => getModulePercent(parcoursId, moduleId)}
          isLocked={(parcoursId, order) => isLocked(parcoursId, order)}
          isCompleted={(parcoursId, moduleId) => isCompleted(parcoursId, moduleId)}
        />
      </div>
    );
  }

  if (view === "module-detail") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
        <AcademyHeader />
        <ModuleDetail
          moduleId={selectedModuleId}
          parcoursId={selectedParcoursId}
          onBack={goBack}
          onStart={startLesson}
          getModulePercent={(parcoursId, moduleId) => getModulePercent(parcoursId, moduleId)}
          isCompleted={(parcoursId, moduleId) => isCompleted(parcoursId, moduleId)}
        />
      </div>
    );
  }

  if (view === "lesson") {
    return (
      <LessonEngine
        moduleId={selectedModuleId}
        parcoursId={selectedParcoursId}
        onComplete={async () => {
          await progressHook.refreshProgress();
          setView("module-detail");
        }}
        onExit={() => setView("module-detail")}
      />
    );
  }

  // Tabs view
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: 80 }}>
      <AcademyHeader xp={xp} />

      {/* Tab content */}
      {activeTab === "accueil" && renderAccueil()}
      {activeTab === "parcours" && (
        <ParcoursGrid
          onSelectParcours={openParcours}
          getParcoursCompletedCount={getParcoursCompletedCount}
        />
      )}
      {activeTab === "classement" && renderClassement()}
      {activeTab === "profil" && renderProfil()}

      {/* Bottom tab bar */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-light)",
        display: "flex", justifyContent: "space-around",
        padding: "8px 0 env(safe-area-inset-bottom, 8px)",
        zIndex: 1000,
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            style={{
              background: "none", border: "none", display: "flex",
              flexDirection: "column", alignItems: "center", gap: 2,
              padding: "8px 12px",
              color: activeTab === tab.id ? "var(--accent-secondary)" : "var(--text-muted)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 10,
              letterSpacing: "0.08em", cursor: "pointer",
              transition: "color 0.2s ease-out",
            }}
          >
            <TabIcon type={tab.icon} active={activeTab === tab.id} />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

// ── Shared header component ───────────────────────────────────────────────────

const AcademyHeader = ({ xp }) => (
  <div style={{
    padding: "14px 20px",
    borderBottom: "1px solid var(--border-light)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "var(--bg-surface)",
    position: "sticky", top: 0, zIndex: 100,
  }}>
    <Link to="/" style={{ textDecoration: "none" }}>
      <img
        src="/Arduennagin_logo_vert_.webp"
        alt="Arduenna"
        className="academy-header__logo"
        style={{ height: 36, width: "auto", objectFit: "contain", display: "block" }}
      />
    </Link>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {xp !== undefined && (
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12,
          color: "var(--text-tertiary)",
        }}>
          ⭐ {xp} XP
        </div>
      )}
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 16, fontStyle: "italic", color: "var(--accent-secondary)",
      }}>
        Academy
      </div>
    </div>
  </div>
);
