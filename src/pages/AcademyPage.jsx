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

        {/* Settings */}
        <div style={{ ...card, padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ ...label, marginBottom: 14 }}>Paramètres</div>

          {/* Dark mode toggle */}
          <SettingRow
            icon="🌙"
            title="Mode sombre"
            action={
              <ThemeToggle />
            }
          />

          {/* Admin link (only for admins) */}
          {profile?.isAdmin && (
            <SettingRow
              icon="⚙️"
              title="Administration"
              action={
                <button
                  onClick={() => navigate("/admin")}
                  style={{
                    padding: "6px 14px",
                    background: "rgba(11,54,61,0.06)",
                    border: "1px solid rgba(11,54,61,0.15)",
                    borderRadius: 6,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
                    color: "var(--text-secondary)", cursor: "pointer",
                  }}
                >
                  Ouvrir →
                </button>
              }
            />
          )}

          {/* Logout */}
          <div style={{ marginTop: 8 }}>
            <button
              onClick={handleLogout}
              style={{
                width: "100%", padding: "12px 20px",
                background: "transparent", color: "var(--accent-secondary)",
                border: "1px solid rgba(194,116,74,0.22)",
                borderRadius: 8,
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
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
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: 80 }}>
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

      {/* Bottom tab bar */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-light)",
        display: "flex", justifyContent: "space-around", alignItems: "stretch",
        padding: "0 0 env(safe-area-inset-bottom, 0px)",
        zIndex: 1000,
        boxShadow: "0 -4px 24px rgba(11,54,61,0.07)",
      }}>
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              style={{
                flex: 1, background: "none", border: "none",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 4, padding: "10px 4px 10px",
                cursor: "pointer", position: "relative",
                transition: "color 0.15s ease-out",
              }}
            >
              {/* Active top bar */}
              <div style={{
                position: "absolute", top: 0, left: "50%",
                transform: `translateX(-50%) scaleX(${active ? 1 : 0})`,
                width: 28, height: 2.5, borderRadius: "0 0 3px 3px",
                background: "#0b363d",
                transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
              }} />
              <TabIcon type={tab.icon} active={active} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10, letterSpacing: "0.04em",
                color: active ? "#0b363d" : "rgba(11,54,61,0.35)",
                fontWeight: active ? 600 : 400,
                transition: "color 0.15s, font-weight 0.15s",
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

// ── Settings helpers ──────────────────────────────────────────────────────────

const SettingRow = ({ icon, title, action }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid var(--border-light)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        color: "var(--text-secondary)",
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
    padding: "10px 20px",
    borderBottom: "1px solid var(--border-light)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "var(--bg-surface)",
    position: "sticky", top: 0, zIndex: 100,
    boxShadow: "0 1px 8px rgba(11,54,61,0.04)",
  }}>
    <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
      <img
        src="/Arduennagin_logo_vert_.webp"
        alt="Arduenna"
        style={{ height: 26, width: "auto", objectFit: "contain", display: "block" }}
      />
      <span style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 15, fontStyle: "italic", color: "var(--accent-secondary)",
        letterSpacing: 0.5,
      }}>
        Academy
      </span>
    </Link>
    {xp !== undefined && (
      <div style={{
        display: "flex", alignItems: "center", gap: 5,
        background: "#0b363d", color: "#fef8ec",
        padding: "5px 13px", borderRadius: 999,
        fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
        letterSpacing: 0.3,
      }}>
        <span style={{ fontSize: 11 }}>⭐</span> {xp} XP
      </div>
    )}
  </div>
);
