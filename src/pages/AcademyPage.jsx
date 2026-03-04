import { useState, useEffect, useRef } from "react";
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
import { updateLeaderboardEntry } from "../lib/gamificationService";
import { updateUserProfile } from "../lib/userService";
import { modulesData } from "../data/academy/modules";
import { parcoursData } from "../data/academy/parcours";

// ── Tab bar ──────────────────────────────────────────────────────────────────

const tabs = [
  { id: "accueil", label: "Accueil", icon: "home" },
  { id: "parcours", label: "Parcours", icon: "book" },
  { id: "classement", label: "Classement", icon: "trophy" },
  { id: "profil", label: "Profil", icon: "user" },
];

const TabIcon = ({ type }) => {
  const icons = {
    home: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    book: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
    trophy: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
        <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
        <path d="M18 2H6v7a6 6 0 0012 0V2z" />
      </svg>
    ),
    user: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  };
  return icons[type] || null;
};

// ── Shared dark styles ────────────────────────────────────────────────────────

const DARK_BG = "var(--bg)";

const card = {
  background: "var(--surface)",
  borderRadius: 8,
  border: "1px solid var(--border-subtle)",
};

const label = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 10,
  color: "var(--text-3)",
  textTransform: "uppercase",
  letterSpacing: "2.5px",
};

// ── Role labels ───────────────────────────────────────────────────────────────

const ROLE_LABELS = {
  bartender: "Bartender",
  commercial: "Commercial",
  caviste: "Caviste / Distributeur",
};

// ── Academy Page ──────────────────────────────────────────────────────────────

export const AcademyPage = () => {
  const { user, profile, loading: authLoading, logout, refreshProfile } = useAuth();
  const progressHook = useProgress();
  const { xp, streak, getModulePercent, isLocked, isCompleted, getNextModule, getParcoursCompletedCount, loading: progressLoading } = progressHook;

  const [activeTab, setActiveTab] = useState("accueil");
  // view: "tabs" | "parcours-detail" | "module-detail" | "lesson"
  const [view, setView] = useState("tabs");

  // XP float animation
  const prevXPRef = useRef(null);
  const [xpGain, setXpGain] = useState(null);
  useEffect(() => {
    if (prevXPRef.current === null) { prevXPRef.current = xp; return; }
    if (xp > prevXPRef.current) {
      setXpGain(xp - prevXPRef.current);
      const t = setTimeout(() => setXpGain(null), 700);
      prevXPRef.current = xp;
      return () => clearTimeout(t);
    }
    prevXPRef.current = xp;
  }, [xp]); // eslint-disable-line react-hooks/exhaustive-deps
  const [selectedParcoursId, setSelectedParcoursId] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);

  const navigate = useNavigate();

  // Auto-sync offline queue when connection restored
  useEffect(() => {
    const cleanup = setupOnlineListener(() => progressHook.refreshProgress());
    return cleanup;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync leaderboard entry on load (catches up if previous writes failed)
  useEffect(() => {
    if (progressLoading || !user || !xp) return;
    updateLeaderboardEntry(user.uid, xp).catch(() => {});
  }, [progressLoading, user?.uid, xp]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const photoURL = profile?.avatarUrl || user.photoURL || null;

  const renderAccueil = () => (
    <HomeDashboard
      firstName={firstName}
      role={role}
      photoURL={photoURL}
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

        {/* Avatar block — editable */}
        <ProfileHeader
          user={user}
          profile={profile}
          photoURL={photoURL}
          firstName={firstName}
          role={role}
          refreshProfile={refreshProfile}
        />

        {/* Stats 2×2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            { img: "/icons/XP.svg", value: xp, lbl: "XP total" },
            { img: "/icons/Streakk.svg", value: `${streak}j`, lbl: "Streak" },
            { img: "/icons/Modules.svg", value: p1completed, lbl: "Modules faits" },
            { img: "/icons/Badges.svg", value: earnedBadges.length, lbl: "Badges" },
          ].map(({ img, value, lbl }) => (
            <div key={lbl} style={{ ...card, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <img src={img} alt="" width="44" height="44" style={{ objectFit: "contain", display: "block", flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text-1)" }}>
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
                    color: active ? "var(--text-2)" : "var(--text-4)",
                    fontWeight: active ? 500 : 400,
                  }}>
                    {p.titleFr}
                  </span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: pct === 100 ? p.color : "var(--text-4)" }}>
                    {active ? `${done}/${total}` : "—"}
                  </span>
                </div>
                <div style={{ height: 2, borderRadius: 999, background: "var(--border-subtle)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 999,
                    width: `${pct}%`,
                    background: pct === 100 ? p.color : "rgba(194,116,74,0.6)",
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
              color: "var(--text-4)", textAlign: "center",
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

          {profile?.isAdmin && (
            <SettingRow
              icon="⚙️"
              title="Administration"
              action={
                <button
                  onClick={() => navigate("/admin")}
                  style={{
                    padding: "6px 14px",
                    background: "var(--border-subtle)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 6,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
                    color: "var(--text-2)", cursor: "pointer",
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
      <AcademyHeader xp={xp} onLogout={handleLogout} />
      {xpGain && <XPFloatIndicator amount={xpGain} />}

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
        width: "calc(100% - 32px)",
        maxWidth: 360,
      }}>
        <nav style={{
          background: "var(--tabbar-bg)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 999,
          padding: "6px",
          display: "flex",
          gap: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          border: "1px solid var(--tabbar-border)",
        }}>
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                style={{
                  background: active ? "var(--tab-active-bg)" : "transparent",
                  borderRadius: 999,
                  padding: active ? "9px 16px" : "9px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: active ? 6 : 0,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.25,0.46,0.45,0.94)",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  flex: active ? "0 0 auto" : "1 1 0",
                  minWidth: 0,
                  color: active ? "var(--tab-active-text)" : "var(--tab-icon)",
                }}
              >
                <TabIcon type={tab.icon} />
                {active && (
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12, fontWeight: 700,
                    color: "var(--tab-active-text)",
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

// ── Profile Header with edit ─────────────────────────────────────────────────

const ROLE_LABELS_PROFILE = {
  bartender: "Bartender",
  commercial: "Commercial",
  caviste: "Caviste / Distributeur",
};

const resizeImage = (file, maxSize = 150) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

const ProfileHeader = ({ user, profile, photoURL, firstName, role, refreshProfile }) => {
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(firstName);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const dataUrl = await resizeImage(file);
      await updateUserProfile(user.uid, { avatarUrl: dataUrl });
      await refreshProfile();
    } catch { /* ignore */ }
    setSaving(false);
  };

  const handleNameSave = async () => {
    const trimmed = nameValue.trim();
    if (!trimmed || trimmed === firstName) { setEditingName(false); return; }
    setSaving(true);
    try {
      await updateUserProfile(user.uid, { firstName: trimmed, displayName: trimmed });
      await refreshProfile();
    } catch { /* ignore */ }
    setSaving(false);
    setEditingName(false);
  };

  const avatarStyle = {
    width: 84, height: 84, borderRadius: 999,
    objectFit: "cover", display: "block",
    margin: "0 auto",
    boxShadow: "0 4px 16px rgba(194,116,74,0.18)",
    border: "3px solid rgba(194,116,74,0.25)",
  };

  return (
    <div style={{ textAlign: "center", marginBottom: 28 }}>
      {/* Tappable avatar */}
      <div
        onClick={() => fileRef.current?.click()}
        style={{ position: "relative", display: "inline-block", cursor: "pointer", marginBottom: 14 }}
      >
        {photoURL ? (
          <img src={photoURL} alt={firstName} style={avatarStyle} />
        ) : (
          <div style={{
            ...avatarStyle, objectFit: undefined, display: "flex",
            background: "linear-gradient(135deg, #7a2e00, #c2744a)",
            alignItems: "center", justifyContent: "center",
            color: "#fef8ec",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 34, fontWeight: 600, fontStyle: "italic",
          }}>
            {firstName[0].toUpperCase()}
          </div>
        )}
        {/* Camera overlay */}
        <div style={{
          position: "absolute", bottom: 0, right: 0,
          width: 28, height: 28, borderRadius: 999,
          background: "#c2744a", display: "flex",
          alignItems: "center", justifyContent: "center",
          border: "2px solid var(--surface)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fef8ec" strokeWidth="2" strokeLinecap="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>
        {saving && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: 999,
            background: "rgba(0,0,0,0.4)", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "#fef8ec", fontSize: 11, fontFamily: "'DM Sans', sans-serif",
          }}>
            ...
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handlePhotoChange}
      />

      {/* Editable name */}
      {editingName ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 4 }}>
          <input
            autoFocus
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 22, fontWeight: 600, fontStyle: "italic",
              color: "var(--text-1)", background: "transparent",
              border: "none", borderBottom: "2px solid #c2744a",
              textAlign: "center", outline: "none", width: 160,
            }}
          />
          <button
            onClick={handleNameSave}
            style={{
              background: "#c2744a", color: "#fef8ec", border: "none",
              borderRadius: 6, padding: "4px 10px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
            }}
          >
            OK
          </button>
        </div>
      ) : (
        <div
          onClick={() => { setNameValue(firstName); setEditingName(true); }}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4 }}
        >
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 24, fontWeight: 600, fontStyle: "italic",
            color: "var(--text-1)", margin: 0,
          }}>
            {firstName}
          </h2>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </div>
      )}

      {role && (
        <div style={{
          display: "inline-block",
          padding: "3px 14px", borderRadius: 999,
          background: "rgba(194,116,74,0.13)",
          border: "1px solid rgba(194,116,74,0.22)",
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "var(--accent-secondary)",
          marginBottom: 8,
        }}>
          {ROLE_LABELS_PROFILE[role] || role}
        </div>
      )}

      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>
        {user.email}
      </div>
    </div>
  );
};

// ── Settings helpers ──────────────────────────────────────────────────────────

const SettingRow = ({ icon, title, action }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "11px 0",
    borderBottom: "1px solid var(--border-subtle)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        color: "var(--text-2)",
      }}>
        {title}
      </span>
    </div>
    {action}
  </div>
);

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("arduenna_theme");
    return stored ? stored === "dark" : true;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    const next = !isDark;
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("arduenna_theme", next ? "dark" : "light");
    setIsDark(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Mode clair" : "Mode sombre"}
      style={{
        background: "none",
        border: "1px solid var(--border-subtle)",
        borderRadius: 10,
        width: 40, height: 40,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        color: "var(--text-3)",
        flexShrink: 0,
        transition: "opacity 0.2s",
      }}
    >
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
};

// ── XP Diamond icon ───────────────────────────────────────────────────────────

const XPDiamond = () => (
  <img src="/icons/XP.svg" alt="" width="14" height="14" style={{ objectFit: "contain", display: "block" }} />
);

// ── XP Float indicator ────────────────────────────────────────────────────────

const XPFloatIndicator = ({ amount }) => {
  if (!amount) return null;
  return (
    <div style={{
      position: "fixed", top: 52, right: 20,
      zIndex: 9998,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 14, fontWeight: 800,
      color: "#c2744a",
      animation: "xp-float 0.65s ease-out forwards",
      pointerEvents: "none",
      userSelect: "none",
    }}>
      +{amount} XP
    </div>
  );
};

// ── Shared header component ───────────────────────────────────────────────────

const AcademyHeader = ({ xp, onLogout }) => (
  <div style={{
    padding: "11px 20px",
    borderBottom: "1px solid var(--header-border)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "var(--header-bg)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    position: "sticky", top: 0, zIndex: 100,
  }}>
    <Link to="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0 }}>
      <img
        src="/Arduennagin_logo_vert_.webp"
        alt="Arduenna"
        className="academy-logo"
        style={{ height: 18, width: "auto", objectFit: "contain", display: "block" }}
      />
      <span style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 11, fontStyle: "italic", color: "var(--accent-secondary)",
        letterSpacing: 0.8, marginTop: 1,
      }}>
        Academy
      </span>
    </Link>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <ThemeToggle />
      {xp !== undefined && (
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          background: "rgba(194,116,74,0.13)",
          border: "1px solid rgba(194,116,74,0.20)",
          color: "#D4A574",
          padding: "5px 12px", borderRadius: 999,
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
          letterSpacing: 0.3,
        }}>
          <XPDiamond /> {xp}
        </div>
      )}
      {onLogout && (
        <button
          onClick={onLogout}
          aria-label="Se déconnecter"
          title="Se déconnecter"
          style={{
            background: "none",
            border: "1px solid var(--border-subtle)",
            borderRadius: 10,
            width: 40, height: 40,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-3)",
            flexShrink: 0,
            transition: "opacity 0.2s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      )}
    </div>
  </div>
);
