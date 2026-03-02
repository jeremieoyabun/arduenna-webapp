import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";

const tabs = [
  { id: "accueil", label: "Accueil", icon: "home" },
  { id: "parcours", label: "Parcours", icon: "book" },
  { id: "classement", label: "Classement", icon: "trophy" },
  { id: "profil", label: "Profil", icon: "user" },
];

const TabIcon = ({ type, active }) => {
  const color = active ? "var(--accent-secondary)" : "var(--text-tertiary)";
  const icons = {
    home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
    book: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    trophy: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>,
    user: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };
  return icons[type] || null;
};

export const AcademyPage = () => {
  const { user, loading, role, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("accueil");
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "var(--bg-primary)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
          color: "var(--text-secondary)", fontStyle: "italic",
        }}>
          Chargement...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const renderTab = () => {
    switch (activeTab) {
      case "accueil":
        return (
          <div style={{ padding: "var(--space-8) var(--space-6)" }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)",
              fontWeight: 400, fontStyle: "italic", color: "var(--text-primary)",
              marginBottom: "var(--space-4)",
            }}>
              Bienvenue {user.displayName || user.email}
            </h2>
            <div style={{
              background: "var(--bg-surface)", borderRadius: "var(--radius-lg)",
              padding: "var(--space-6)", border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                color: "var(--text-tertiary)", textTransform: "uppercase",
                letterSpacing: "0.15em", marginBottom: "var(--space-3)",
              }}>
                Votre progression
              </div>
              <div style={{
                height: 8, background: "var(--bg-muted, rgba(11,54,61,0.06))", borderRadius: 999,
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", width: "0%", background: "var(--accent-secondary)",
                  borderRadius: 999,
                  transition: "width 0.6s ease-out",
                }} />
              </div>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                color: "var(--text-secondary)", marginTop: "var(--space-2)",
              }}>
                0 / 3 modules complétés
              </div>
            </div>
          </div>
        );

      case "parcours":
        return (
          <div style={{ padding: "var(--space-8) var(--space-6)" }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
              fontWeight: 400, fontStyle: "italic", color: "var(--text-primary)",
              marginBottom: "var(--space-6)",
            }}>
              Parcours d'apprentissage
            </h2>
            {["Découverte Arduenna", "Art du cocktail", "Expertise bartender"].map((m, i) => (
              <div key={i} style={{
                background: "var(--bg-surface)", borderRadius: "var(--radius-lg)",
                padding: "var(--space-5)", border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-sm)", marginBottom: "var(--space-4)",
                display: "flex", alignItems: "center", gap: "var(--space-4)",
                opacity: 0.6,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 999,
                  background: "rgba(11,54,61,0.06)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                  color: "var(--text-tertiary)", fontWeight: 500,
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-base)",
                    color: "var(--text-primary)", fontWeight: 500,
                  }}>
                    {m}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                    color: "var(--text-tertiary)",
                  }}>
                    Bientôt disponible
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "classement":
        return (
          <div style={{ padding: "var(--space-8) var(--space-6)", textAlign: "center" }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
              fontWeight: 400, fontStyle: "italic", color: "var(--text-primary)",
              marginBottom: "var(--space-4)",
            }}>
              Classement des apprenants
            </h2>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
              color: "var(--text-tertiary)",
            }}>
              Bientôt disponible
            </p>
          </div>
        );

      case "profil":
        return (
          <div style={{ padding: "var(--space-8) var(--space-6)", textAlign: "center" }}>
            <div style={{
              width: 80, height: 80, borderRadius: 999,
              background: "var(--accent-secondary)", margin: "0 auto var(--space-4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--color-cream, #fef8ec)", fontFamily: "var(--font-display)",
              fontSize: "var(--text-3xl)", fontWeight: 400, fontStyle: "italic",
            }}>
              {(user.displayName || user.email || "?")[0].toUpperCase()}
            </div>

            <h2 style={{
              fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
              fontWeight: 400, fontStyle: "italic", color: "var(--text-primary)",
              marginBottom: "var(--space-2)",
            }}>
              {user.displayName || user.email}
            </h2>

            {role && (
              <div style={{
                display: "inline-block", padding: "var(--space-1) var(--space-3)",
                borderRadius: 999, background: "rgba(11,54,61,0.06)",
                fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                color: "var(--text-secondary)", textTransform: "capitalize",
                marginBottom: "var(--space-6)",
              }}>
                {role}
              </div>
            )}

            <div>
              <button onClick={handleLogout} className="btn-ghost" style={{ marginTop: "var(--space-4)" }}>
                Se déconnecter
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        padding: "var(--space-4) var(--space-6)",
        borderBottom: "1px solid var(--border-light)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--bg-surface)",
      }}>
        <img src="/Arduennagin_logo_vert_.webp" alt="Arduenna" style={{ height: 36 }} />
        <div style={{
          fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
          textTransform: "uppercase", letterSpacing: "0.15em",
          color: "var(--accent-secondary)",
        }}>
          Academy
        </div>
      </div>

      {/* Tab content */}
      {renderTab()}

      {/* Bottom tab bar */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "var(--bg-surface)", borderTop: "1px solid var(--border-light)",
        display: "flex", justifyContent: "space-around",
        padding: "var(--space-2) 0 env(safe-area-inset-bottom, var(--space-2))",
        zIndex: 1000,
      }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              background: "none", border: "none", display: "flex",
              flexDirection: "column", alignItems: "center", gap: 2,
              padding: "var(--space-2) var(--space-3)",
              color: activeTab === tab.id ? "var(--accent-secondary)" : "var(--text-tertiary)",
              fontFamily: "var(--font-body)", fontSize: 10,
              letterSpacing: "0.08em", cursor: "pointer",
              transition: "color 0.2s ease-out",
            }}>
            <TabIcon type={tab.icon} active={activeTab === tab.id} />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
