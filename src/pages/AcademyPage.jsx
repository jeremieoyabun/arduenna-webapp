import { useState, useEffect } from "react";
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
import { OfflineIndicator } from "../components/academy/ui/OfflineIndicator";
import { NotificationPrompt } from "../components/academy/ui/NotificationPrompt";
import { setupOnlineListener } from "../lib/offlineService";
import {
  getPermissionStatus,
  scheduleStreakReminder,
  checkInactivityNotification,
  cancelStreakReminder,
} from "../lib/notificationService";
import { modulesData } from "../data/academy/modules";
import { parcoursData } from "../data/academy/parcours";

// ── Tab bar ──────────────────────────────────────────────────────────────────

const tabs = [
  { id: "accueil", label: "Accueil", icon: "home" },
  { id: "parcours", label: "Parcours", icon: "book" },
  { id: "classement", label: "Classement", icon: "trophy" },
  { id: "profil", label: "Profil", icon: "user" },
];

const TabIcon = ({ type, customColor }) => {
  const color = customColor || "rgba(254,248,236,0.45)";
  const icons = {
    home: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    book: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
    trophy: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
        <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
        <path d="M18 2H6v7a6 6 0 0012 0V2z" />
      </svg>
    ),
    user: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  };
  return icons[type] || null;
};

// ── Shared dark styles ────────────────────────────────────────────────────────

const DARK_BG = "#071c21";

const card = {
  background: "rgba(255,255,255,0.05)",
  borderRadius: 16,
  border: "1px solid rgba(254,248,236,0.07)",
  boxShadow: "8px 8px 24px rgba(0,0,0,0.38), -2px -2px 8px rgba(255,255,255,0.02)",
};

const label = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 10,
  color: "rgba(254,248,236,0.38)",
  textTransform: "uppercase",
  letterSpacing: 2,
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
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);

  const navigate = useNavigate();

  // Auto-sync offline queue when connection restored
  useEffect(() => {
    const cleanup = setupOnlineListener(() => progressHook.refreshProgress());
    return cleanup;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Notification setup — after progress loads
  useEffect(() => {
    if (progressLoading) return;
    const status = getPermissionStatus();

    // Show custom prompt once if permission not yet decided
    if (status === "default" && !sessionStorage.getItem("arduenna_notif_prompted")) {
      sessionStorage.setItem("arduenna_notif_prompted", "1");
      // Delay 3s so user settles into the app first
      const timer = setTimeout(() => setShowNotifPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    if (status === "granted") {
      // Check inactivity (3+ days without login)
      checkInactivityNotification(profile?.lastLoginAt || null);
      // Schedule streak danger reminder
      const lastActivity = progressHook.progress?.lastActivityAt || null;
      scheduleStreakReminder(streak?.current || 0, lastActivity);
    }

    return () => cancelStreakReminder();
  }, [progressLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: DARK_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, color: "#c2744a", fontStyle: "italic" }}>
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
    const earnedBadges = progressHook.progress?.badges || [];

    const earnedCerts = parcoursData.filter(p =>
      !!progressHook.progress?.parcours?.[p.id]?.completedAt
    );

    return (
      <div style={{ padding: "24px 18px" }}>

        {/* Avatar block */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 84, height: 84, borderRadius: 999,
            background: "linear-gradient(135deg, #7a2e00, #c2744a)",
            margin: "0 auto 14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fef8ec",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 34, fontWeight: 600, fontStyle: "italic",
            boxShadow: "0 8px 24px rgba(194,116,74,0.35)",
          }}>
            {firstName[0].toUpperCase()}
          </div>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 24, fontWeight: 600, fontStyle: "italic",
            color: "#fef8ec", marginBottom: 6,
          }}>
            {firstName}
          </h2>

          {role && (
            <div style={{
              display: "inline-block",
              padding: "4px 14px", borderRadius: 999,
              background: "rgba(194,116,74,0.15)",
              border: "1px solid rgba(194,116,74,0.25)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#c2744a",
              marginBottom: 6,
            }}>
              {ROLE_LABELS[role] || role}
            </div>
          )}

          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(254,248,236,0.38)", marginTop: 4 }}>
            {user.email}
          </div>
        </div>

        {/* Stats 2×2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            { icon: "⭐", value: xp, lbl: "XP total" },
            { icon: "🔥", value: `${streak}j`, lbl: "Streak" },
            { icon: "📚", value: p1completed, lbl: "Modules faits" },
            { icon: "🏅", value: earnedBadges.length, lbl: "Badges" },
          ].map(({ icon, value, lbl }) => (
            <div key={lbl} style={{ ...card, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "#fef8ec" }}>
                  {value}
                </div>
                <div style={{ ...label }}>{lbl}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Parcours progress */}
        <div style={{ ...card, padding: "18px 20px", marginBottom: 14 }}>
          <div style={{ ...label, marginBottom: 16 }}>Progression parcours</div>
          {parcoursData.map(p => {
            const total = modulesData.filter(m => m.parcoursId === p.id).length;
            const done = getParcoursCompletedCount(p.id);
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const active = !!progressHook.progress?.parcours?.[p.id];
            return (
              <div key={p.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                    color: active ? "rgba(254,248,236,0.85)" : "rgba(254,248,236,0.25)",
                    fontWeight: active ? 500 : 400,
                  }}>
                    {p.titleFr}
                  </span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: pct === 100 ? p.color : "rgba(254,248,236,0.3)" }}>
                    {active ? `${done}/${total}` : "—"}
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 999,
                    width: `${pct}%`,
                    background: pct === 100 ? p.color : "#2a8fa0",
                    boxShadow: pct > 0 ? `0 0 8px ${pct === 100 ? p.color : "#2a8fa0"}88` : "none",
                    transition: "width 0.4s ease-out",
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Badges */}
        <div style={{ ...card, padding: "18px 20px", marginBottom: 14 }}>
          <div style={{ ...label, marginBottom: 14 }}>Mes Badges ({earnedBadges.length}/10)</div>
          <BadgeGrid earnedBadges={earnedBadges} />
          {earnedBadges.length === 0 && (
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12,
              color: "rgba(254,248,236,0.3)", textAlign: "center",
              marginTop: 12, fontStyle: "italic",
            }}>
              Complétez des modules pour débloquer vos badges
            </div>
          )}
        </div>

        {/* Certificates */}
        {earnedCerts.length > 0 && (
          <div style={{ ...card, padding: "18px 20px", marginBottom: 14 }}>
            <div style={{ ...label, marginBottom: 14 }}>Mes Certificats ({earnedCerts.length})</div>
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

        {/* Settings */}
        <div style={{ ...card, padding: "18px 20px", marginBottom: 14 }}>
          <div style={{ ...label, marginBottom: 14 }}>Paramètres</div>

          <SettingRow icon="🌙" title="Mode sombre" action={<ThemeToggle />} />

          {profile?.isAdmin && (
            <SettingRow
              icon="⚙️"
              title="Administration"
              action={
                <button
                  onClick={() => navigate("/admin")}
                  style={{
                    padding: "6px 14px",
                    background: "rgba(254,248,236,0.07)",
                    border: "1px solid rgba(254,248,236,0.15)",
                    borderRadius: 6,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
                    color: "rgba(254,248,236,0.7)", cursor: "pointer",
                  }}
                >
                  Ouvrir →
                </button>
              }
            />
          )}

          <div style={{ marginTop: 10 }}>
            <button
              onClick={handleLogout}
              style={{
                width: "100%", padding: "12px 20px",
                background: "transparent", color: "#c2744a",
                border: "1px solid rgba(194,116,74,0.3)",
                borderRadius: 10,
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Settings helpers ────────────────────────────────────────────────────────

  // ── Render ───────────────────────────────────────────────────────────────

  // Full-screen views (no bottom tab bar)
  if (view === "parcours-detail") {
    return (
      <div style={{ minHeight: "100vh", background: DARK_BG }}>
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
      <div style={{ minHeight: "100vh", background: DARK_BG }}>
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
        lang={profile?.lang || "fr"}
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
    <div style={{ minHeight: "100vh", background: DARK_BG, paddingBottom: 120 }}>
      <OfflineIndicator />
      {showNotifPrompt && (
        <NotificationPrompt onDone={() => setShowNotifPrompt(false)} />
      )}
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

      {/* ── Floating pill tab bar ──────────────────────────────────────────── */}
      <div style={{
        position: "fixed",
        bottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}>
        <nav style={{
          background: "rgba(8,31,35,0.94)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 999,
          padding: "6px",
          display: "flex",
          gap: 4,
          boxShadow: "0 8px 40px rgba(11,54,61,0.4), 0 2px 8px rgba(11,54,61,0.2)",
          border: "1px solid rgba(254,248,236,0.08)",
        }}>
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                style={{
                  background: active ? "#fef8ec" : "transparent",
                  borderRadius: 999,
                  padding: active ? "9px 18px" : "9px 13px",
                  display: "flex",
                  alignItems: "center",
                  gap: active ? 7 : 0,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <TabIcon
                  type={tab.icon}
                  customColor={active ? "#0b363d" : "rgba(254,248,236,0.45)"}
                />
                {active && (
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12, fontWeight: 700,
                    color: "#0b363d",
                    letterSpacing: 0.1,
                  }}>
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

// ── Settings helpers ──────────────────────────────────────────────────────────

const SettingRow = ({ icon, title, action }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "11px 0",
    borderBottom: "1px solid rgba(254,248,236,0.07)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        color: "rgba(254,248,236,0.72)",
      }}>
        {title}
      </span>
    </div>
    {action}
  </div>
);

const ThemeToggle = () => {
  const [dark, setDark] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
  );
  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setDark(!dark);
  };
  return (
    <button
      onClick={toggle}
      style={{
        width: 44, height: 24,
        borderRadius: 999,
        background: dark ? "#0b363d" : "var(--border-medium)",
        border: "none", cursor: "pointer",
        position: "relative", transition: "background 0.2s",
        flexShrink: 0,
      }}
      aria-label="Toggle dark mode"
    >
      <div style={{
        position: "absolute",
        top: 3, left: dark ? 23 : 3,
        width: 18, height: 18,
        borderRadius: 999,
        background: dark ? "#c2744a" : "#fef8ec",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        transition: "left 0.2s",
      }} />
    </button>
  );
};

// ── Shared header component ───────────────────────────────────────────────────

const AcademyHeader = ({ xp }) => (
  <div style={{
    padding: "11px 20px",
    borderBottom: "1px solid rgba(194,116,74,0.12)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "rgba(7,28,33,0.96)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    position: "sticky", top: 0, zIndex: 100,
    boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
  }}>
    <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 9 }}>
      <img
        src="/Arduennagin_logo_vert_.webp"
        alt="Arduenna"
        style={{ height: 24, width: "auto", objectFit: "contain", display: "block", filter: "brightness(0) invert(1)" }}
      />
      <span style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 15, fontStyle: "italic", color: "#c2744a",
        letterSpacing: 0.5,
      }}>
        Academy
      </span>
    </Link>
    {xp !== undefined && (
      <div style={{
        display: "flex", alignItems: "center", gap: 5,
        background: "rgba(194,116,74,0.18)",
        border: "1px solid rgba(194,116,74,0.3)",
        color: "#D4A574",
        padding: "5px 14px", borderRadius: 999,
        fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
        letterSpacing: 0.3,
        boxShadow: "0 0 16px rgba(194,116,74,0.15)",
      }}>
        ⭐ {xp} XP
      </div>
    )}
  </div>
);
