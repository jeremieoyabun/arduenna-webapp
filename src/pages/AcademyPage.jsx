import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";
import { useProgress } from "../hooks/useProgress";
import { ParcoursGrid } from "../components/academy/parcours/ParcoursGrid";
import { ParcoursDetail } from "../components/academy/parcours/ParcoursDetail";
import { ModuleDetail } from "../components/academy/parcours/ModuleDetail";
import { LessonEngine } from "../components/academy/lessons/LessonEngine";
import { modulesData } from "../data/academy/modules";

// ── Tab bar ──────────────────────────────────────────────────────────────────

const tabs = [
  { id: "accueil", label: "Accueil", icon: "home" },
  { id: "parcours", label: "Parcours", icon: "book" },
  { id: "classement", label: "Classement", icon: "trophy" },
  { id: "profil", label: "Profil", icon: "user" },
];

const TabIcon = ({ type, active }) => {
  const color = active ? "#c2744a" : "rgba(11,54,61,0.35)";
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
  background: "#ffffff",
  borderRadius: 12,
  border: "1px solid rgba(11,54,61,0.08)",
  boxShadow: "0 2px 12px rgba(11,54,61,0.03)",
};

const label = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 11,
  color: "rgba(11,54,61,0.45)",
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
      <div style={{ minHeight: "100vh", background: "#fef8ec", display: "flex", alignItems: "center", justifyContent: "center" }}>
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

  const renderAccueil = () => {
    const nextModule = getNextModule();
    const p1modules = modulesData.filter(m => m.parcoursId === "univers");
    const p1completed = getParcoursCompletedCount("univers");
    const p1percent = Math.round((p1completed / p1modules.length) * 100);

    return (
      <div style={{ padding: "28px 20px" }}>
        {/* Greeting */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 26, fontWeight: 400, fontStyle: "italic",
          color: "#0b363d", marginBottom: 24,
        }}>
          Bonjour {firstName} 👋
        </h2>

        {/* Streak + XP */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ ...card, flex: 1, padding: "16px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🔥</span>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 600, color: "#0b363d" }}>
                {streak} jour{streak !== 1 ? "s" : ""}
              </div>
              <div style={{ ...label }}>Streak</div>
            </div>
          </div>
          <div style={{ ...card, flex: 1, padding: "16px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>⭐</span>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 600, color: "#0b363d" }}>
                {xp} XP
              </div>
              <div style={{ ...label }}>Total</div>
            </div>
          </div>
        </div>

        {/* Prochain module */}
        {nextModule ? (
          <div
            onClick={() => { openParcours("univers"); openModule(nextModule.id); }}
            style={{ ...card, padding: "18px 20px", marginBottom: 16, cursor: "pointer" }}
          >
            <div style={{ ...label, marginBottom: 10 }}>Prochain module</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#0b363d", marginBottom: 3 }}>
                  {nextModule.titleFr}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(11,54,61,0.45)" }}>
                  {nextModule.lessonCount} activités · {nextModule.duration}
                </div>
              </div>
              <button style={{
                padding: "10px 18px",
                background: "#0b363d", color: "#fef8ec",
                border: "none", borderRadius: 8,
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                cursor: "pointer", flexShrink: 0,
              }}>
                {getModulePercent("univers", nextModule.id) > 0 ? "Continuer" : "Commencer"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ ...card, padding: "18px 20px", marginBottom: 16, opacity: 0.6 }}>
            <div style={{ ...label, marginBottom: 10 }}>Prochain module</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(11,54,61,0.5)", fontStyle: "italic" }}>
              {progressLoading ? "Chargement..." : "Tous les modules du Parcours 1 sont complétés 🎉"}
            </div>
          </div>
        )}

        {/* Parcours 1 progress */}
        {p1completed > 0 && (
          <div style={{ ...card, padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ ...label }}>L'Univers Arduenna</div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(11,54,61,0.45)" }}>
                {p1completed}/{p1modules.length}
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: "rgba(11,54,61,0.08)", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 999,
                width: `${p1percent}%`,
                background: p1percent === 100 ? "#c2744a" : "#0b363d",
                transition: "width 0.4s ease-out",
              }} />
            </div>
          </div>
        )}

        {/* Mini leaderboard placeholder */}
        <div style={{ ...card, padding: "18px 20px" }}>
          <div style={{ ...label, marginBottom: 16 }}>Top apprenants</div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            color: "rgba(11,54,61,0.4)", textAlign: "center",
            fontStyle: "italic", padding: "8px 0",
          }}>
            Soyez le premier à compléter un module !
          </div>
        </div>
      </div>
    );
  };

  // ── Classement tab ───────────────────────────────────────────────────────

  const renderClassement = () => (
    <div style={{ padding: "28px 20px", textAlign: "center" }}>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 22, fontWeight: 400, fontStyle: "italic",
        color: "#0b363d", marginBottom: 8,
      }}>
        Classement
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(11,54,61,0.45)", marginBottom: 32 }}>
        Comparez-vous aux autres apprenants
      </p>

      {/* Empty podium */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 8, marginBottom: 32, height: 160 }}>
        {[
          { pos: 2, h: 90, color: "rgba(11,54,61,0.04)", avatarSize: 36 },
          { pos: 1, h: 120, color: "rgba(194,116,74,0.08)", avatarSize: 40 },
          { pos: 3, h: 65, color: "rgba(11,54,61,0.03)", avatarSize: 32 },
        ].map(({ pos, h, color, avatarSize }) => (
          <div key={pos} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: avatarSize, height: avatarSize, borderRadius: 999,
              background: pos === 1 ? "rgba(194,116,74,0.1)" : "rgba(11,54,61,0.06)",
              marginBottom: 8,
            }} />
            <div style={{
              width: 70, height: h, borderRadius: "8px 8px 0 0", background: color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 600,
              color: pos === 1 ? "rgba(194,116,74,0.3)" : "rgba(11,54,61,0.12)",
            }}>
              {pos}
            </div>
          </div>
        ))}
      </div>

      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 14,
        color: "rgba(11,54,61,0.4)", fontStyle: "italic", lineHeight: 1.6,
      }}>
        Le classement sera disponible dès que les premiers modules seront complétés.
        <br />Soyez le premier sur le podium !
      </p>
    </div>
  );

  // ── Profil tab ───────────────────────────────────────────────────────────

  const renderProfil = () => {
    const p1completed = getParcoursCompletedCount("univers");
    const p1total = modulesData.filter(m => m.parcoursId === "univers").length;

    return (
      <div style={{ padding: "28px 20px" }}>
        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 999,
            background: "#c2744a", margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fef8ec",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 32, fontWeight: 400, fontStyle: "italic",
          }}>
            {firstName[0].toUpperCase()}
          </div>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 22, fontWeight: 400, fontStyle: "italic",
            color: "#0b363d", marginBottom: 6,
          }}>
            {firstName}
          </h2>

          {role && (
            <div style={{
              display: "inline-block",
              padding: "4px 14px", borderRadius: 999,
              background: "rgba(194,116,74,0.1)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#c2744a",
              marginBottom: 4,
            }}>
              {ROLE_LABELS[role] || role}
            </div>
          )}

          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(11,54,61,0.4)", marginTop: 6 }}>
            {user.email}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            { icon: "⭐", value: xp, label: "XP total" },
            { icon: "🔥", value: `${streak}j`, label: "Streak" },
            { icon: "📚", value: p1completed, label: "Modules faits" },
            { icon: "🏅", value: "0", label: "Badges" },
          ].map(({ icon, value, label: lbl }) => (
            <div key={lbl} style={{ ...card, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, color: "#0b363d" }}>
                  {value}
                </div>
                <div style={{ ...label }}>{lbl}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Progression parcours */}
        <div style={{ ...card, padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ ...label, marginBottom: 14 }}>Progression parcours</div>
          {[
            { name: "L'Univers Arduenna", completed: p1completed, total: p1total, active: true },
            { name: "La Gamme", completed: 0, total: 4, active: false },
            { name: "Le Cocktail Lab", completed: 0, total: 4, active: false },
            { name: "Vendre Arduenna", completed: 0, total: 4, active: false },
          ].map(({ name, completed: c, total: t, active }) => (
            <div key={name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  color: active ? "#0b363d" : "rgba(11,54,61,0.35)",
                }}>
                  {name}
                </span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                  color: "rgba(11,54,61,0.4)",
                }}>
                  {active ? `${c}/${t}` : "Bientôt"}
                </span>
              </div>
              <div style={{ height: 5, borderRadius: 999, background: "rgba(11,54,61,0.06)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 999,
                  width: active && t > 0 ? `${Math.round((c / t) * 100)}%` : "0%",
                  background: "#0b363d",
                  transition: "width 0.4s ease-out",
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Badges placeholder */}
        <div style={{ ...card, padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ ...label, marginBottom: 14 }}>Mes Badges</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{
                width: 52, height: 52, borderRadius: 999,
                background: "rgba(11,54,61,0.04)",
                border: "2px dashed rgba(11,54,61,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(11,54,61,0.15)" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="7" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
                </svg>
              </div>
            ))}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
            color: "rgba(11,54,61,0.35)", textAlign: "center",
            marginTop: 12, fontStyle: "italic",
          }}>
            Complétez des modules pour débloquer vos badges
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%", padding: "14px 24px",
            background: "transparent", color: "#c2744a",
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
      <div style={{ minHeight: "100vh", background: "#fef8ec" }}>
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
      <div style={{ minHeight: "100vh", background: "#fef8ec" }}>
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
    <div style={{ minHeight: "100vh", background: "#fef8ec", paddingBottom: 80 }}>
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
        background: "#ffffff",
        borderTop: "1px solid rgba(11,54,61,0.08)",
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
              color: activeTab === tab.id ? "#c2744a" : "rgba(11,54,61,0.35)",
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
    borderBottom: "1px solid rgba(11,54,61,0.08)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "#ffffff",
    position: "sticky", top: 0, zIndex: 100,
  }}>
    <Link to="/" style={{ textDecoration: "none" }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 18, fontWeight: 600, letterSpacing: 4, color: "#0b363d",
      }}>
        ARDUENNA
      </div>
    </Link>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {xp !== undefined && (
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12,
          color: "rgba(11,54,61,0.45)",
        }}>
          ⭐ {xp} XP
        </div>
      )}
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 16, fontStyle: "italic", color: "#c2744a",
      }}>
        Academy
      </div>
    </div>
  </div>
);
