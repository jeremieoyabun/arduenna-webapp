import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";

const tabs = [
  { id: "accueil", label: "Accueil", icon: "home" },
  { id: "parcours", label: "Parcours", icon: "book" },
  { id: "classement", label: "Classement", icon: "trophy" },
  { id: "profil", label: "Profil", icon: "user" },
];

const parcours = [
  {
    title: "L'Univers Arduenna",
    desc: "Histoire, terroir, botaniques",
    modules: 4,
    duration: "15 min",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c2744a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z" />
      </svg>
    ),
  },
  {
    title: "La Gamme",
    desc: "Gin, No Alcohol, 694 Aperitivo",
    modules: 4,
    duration: "20 min",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c2744a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2h8l-2 7h4L10 22l2-9H8z" />
      </svg>
    ),
  },
  {
    title: "Le Cocktail Lab",
    desc: "Recettes, techniques, accords",
    modules: 4,
    duration: "20 min",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c2744a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22h8" />
        <path d="M12 11v11" />
        <path d="M5 3l7 8 7-8" />
      </svg>
    ),
  },
  {
    title: "Vendre Arduenna",
    desc: "Argumentaire, positionnement, conseil",
    modules: 4,
    duration: "15 min",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c2744a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 7.65l.78.77L12 20.64l7.64-7.64.78-.77a5.4 5.4 0 000-7.65z" />
      </svg>
    ),
  },
];

const roleLabels = {
  bartender: "Bartender",
  commercial: "Commercial",
  caviste: "Caviste / Distributeur",
};

const TabIcon = ({ type, active }) => {
  const color = active ? "#c2744a" : "rgba(11,54,61,0.35)";
  const icons = {
    home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
    book: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    trophy: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>,
    user: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };
  return icons[type] || null;
};

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(11,54,61,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

export const AcademyPage = () => {
  const { user, loading, role, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("accueil");
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#fef8ec",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 22, color: "#c2744a", fontStyle: "italic",
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

  const displayName = user.displayName || user.email?.split("@")[0] || "Apprenant";

  const cardStyle = {
    background: "#ffffff",
    borderRadius: 12,
    padding: "20px",
    border: "1px solid rgba(11,54,61,0.08)",
    boxShadow: "0 2px 12px rgba(11,54,61,0.03)",
    marginBottom: 16,
  };

  const renderAccueil = () => (
    <div style={{ padding: "28px 20px" }}>
      {/* Greeting */}
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 26, fontWeight: 400, fontStyle: "italic",
        color: "#0b363d", marginBottom: 24,
      }}>
        Bonjour {displayName} 👋
      </h2>

      {/* Streak + XP row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {/* Streak */}
        <div style={{
          ...cardStyle, flex: 1, marginBottom: 0,
          display: "flex", alignItems: "center", gap: 10,
          padding: "16px",
        }}>
          <span style={{ fontSize: 22 }}>🔥</span>
          <div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 18,
              fontWeight: 600, color: "#0b363d",
            }}>0 jours</div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              color: "rgba(11,54,61,0.45)", textTransform: "uppercase",
              letterSpacing: 1.5,
            }}>Streak</div>
          </div>
        </div>

        {/* XP */}
        <div style={{
          ...cardStyle, flex: 1, marginBottom: 0,
          display: "flex", alignItems: "center", gap: 10,
          padding: "16px",
        }}>
          <span style={{ fontSize: 22 }}>⭐</span>
          <div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 18,
              fontWeight: 600, color: "#0b363d",
            }}>0 XP</div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              color: "rgba(11,54,61,0.45)", textTransform: "uppercase",
              letterSpacing: 1.5,
            }}>Total</div>
          </div>
        </div>
      </div>

      {/* Prochain module — locked */}
      <div style={{
        ...cardStyle, position: "relative", overflow: "hidden",
        opacity: 0.7,
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11,
          color: "rgba(11,54,61,0.45)", textTransform: "uppercase",
          letterSpacing: 2, marginBottom: 12,
        }}>
          Prochain module
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: "rgba(11,54,61,0.04)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <LockIcon />
          </div>
          <div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15,
              fontWeight: 500, color: "#0b363d",
            }}>
              L'Univers Arduenna
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 13,
              color: "rgba(11,54,61,0.45)",
            }}>
              Complétez votre inscription pour commencer
            </div>
          </div>
        </div>
      </div>

      {/* Mini leaderboard */}
      <div style={cardStyle}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11,
          color: "rgba(11,54,61,0.45)", textTransform: "uppercase",
          letterSpacing: 2, marginBottom: 16,
        }}>
          Top 3 apprenants
        </div>
        {[1, 2, 3].map((pos) => (
          <div key={pos} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 0",
            borderBottom: pos < 3 ? "1px solid rgba(11,54,61,0.06)" : "none",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 999,
              background: pos === 1 ? "rgba(194,116,74,0.12)" : "rgba(11,54,61,0.04)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'DM Sans', sans-serif", fontSize: 12,
              fontWeight: 600,
              color: pos === 1 ? "#c2744a" : "rgba(11,54,61,0.3)",
            }}>
              {pos}
            </div>
            <div style={{
              flex: 1, height: 10, borderRadius: 999,
              background: "rgba(11,54,61,0.04)",
            }} />
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12,
              color: "rgba(11,54,61,0.25)",
            }}>
              — XP
            </div>
          </div>
        ))}
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12,
          color: "rgba(11,54,61,0.35)", textAlign: "center",
          marginTop: 12, fontStyle: "italic",
        }}>
          Soyez le premier à compléter un module !
        </div>
      </div>
    </div>
  );

  const renderParcours = () => (
    <div style={{ padding: "28px 20px" }}>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 22, fontWeight: 400, fontStyle: "italic",
        color: "#0b363d", marginBottom: 6,
      }}>
        Parcours d'apprentissage
      </h2>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        color: "rgba(11,54,61,0.45)", marginBottom: 24,
      }}>
        Maîtrisez l'univers Arduenna étape par étape
      </p>

      {parcours.map((p, i) => (
        <div key={i} style={{
          ...cardStyle, display: "flex", alignItems: "center",
          gap: 16, opacity: 0.65, cursor: "default",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: "rgba(194,116,74,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            {p.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15,
              fontWeight: 500, color: "#0b363d", marginBottom: 3,
            }}>
              {p.title}
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12,
              color: "rgba(11,54,61,0.45)",
            }}>
              {p.desc}
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              color: "rgba(11,54,61,0.35)", marginTop: 4,
            }}>
              {p.modules} modules • {p.duration}
            </div>
          </div>
          <LockIcon />
        </div>
      ))}

      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        color: "rgba(11,54,61,0.4)", textAlign: "center",
        marginTop: 8, fontStyle: "italic",
      }}>
        Contenu bientôt disponible
      </div>
    </div>
  );

  const renderClassement = () => (
    <div style={{ padding: "28px 20px", textAlign: "center" }}>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 22, fontWeight: 400, fontStyle: "italic",
        color: "#0b363d", marginBottom: 8,
      }}>
        Classement
      </h2>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        color: "rgba(11,54,61,0.45)", marginBottom: 32,
      }}>
        Comparez-vous aux autres apprenants
      </p>

      {/* Stylized empty podium */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        gap: 8, marginBottom: 32, height: 160,
      }}>
        {/* 2nd place */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 999,
            background: "rgba(11,54,61,0.06)", marginBottom: 8,
          }} />
          <div style={{
            width: 70, height: 90, borderRadius: "8px 8px 0 0",
            background: "rgba(11,54,61,0.04)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif", fontSize: 20,
            fontWeight: 600, color: "rgba(11,54,61,0.15)",
          }}>
            2
          </div>
        </div>

        {/* 1st place */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            width: 40, height: 40, borderRadius: 999,
            background: "rgba(194,116,74,0.1)", marginBottom: 8,
          }} />
          <div style={{
            width: 70, height: 120, borderRadius: "8px 8px 0 0",
            background: "rgba(194,116,74,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif", fontSize: 20,
            fontWeight: 600, color: "rgba(194,116,74,0.3)",
          }}>
            1
          </div>
        </div>

        {/* 3rd place */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 999,
            background: "rgba(11,54,61,0.04)", marginBottom: 8,
          }} />
          <div style={{
            width: 70, height: 65, borderRadius: "8px 8px 0 0",
            background: "rgba(11,54,61,0.03)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif", fontSize: 20,
            fontWeight: 600, color: "rgba(11,54,61,0.12)",
          }}>
            3
          </div>
        </div>
      </div>

      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 14,
        color: "rgba(11,54,61,0.4)", fontStyle: "italic",
        lineHeight: 1.6,
      }}>
        Le classement sera disponible dès que les premiers modules seront complétés.
        <br />
        Soyez le premier sur le podium !
      </p>
    </div>
  );

  const renderProfil = () => (
    <div style={{ padding: "28px 20px" }}>
      {/* Avatar + info */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 999,
          background: "#c2744a", margin: "0 auto 16px",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fef8ec",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 32, fontWeight: 400, fontStyle: "italic",
        }}>
          {displayName[0].toUpperCase()}
        </div>

        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 22, fontWeight: 400, fontStyle: "italic",
          color: "#0b363d", marginBottom: 6,
        }}>
          {displayName}
        </h2>

        {role && (
          <div style={{
            display: "inline-block",
            padding: "4px 14px",
            borderRadius: 999,
            background: "rgba(194,116,74,0.1)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, color: "#c2744a",
            marginBottom: 4,
          }}>
            {roleLabels[role] || role}
          </div>
        )}

        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          color: "rgba(11,54,61,0.4)", marginTop: 6,
        }}>
          {user.email}
        </div>
      </div>

      {/* Mes Badges */}
      <div style={cardStyle}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11,
          color: "rgba(11,54,61,0.45)", textTransform: "uppercase",
          letterSpacing: 2, marginBottom: 16,
        }}>
          Mes Badges
        </div>
        <div style={{
          display: "flex", gap: 12, justifyContent: "center",
        }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{
              width: 52, height: 52, borderRadius: 999,
              background: "rgba(11,54,61,0.04)",
              border: "2px dashed rgba(11,54,61,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(11,54,61,0.15)" strokeWidth="1.5">
                <circle cx="12" cy="8" r="7" />
                <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
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

      {/* Mes Certificats */}
      <div style={cardStyle}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11,
          color: "rgba(11,54,61,0.45)", textTransform: "uppercase",
          letterSpacing: 2, marginBottom: 16,
        }}>
          Mes Certificats
        </div>
        <div style={{
          padding: "20px",
          border: "2px dashed rgba(11,54,61,0.08)",
          borderRadius: 8,
          textAlign: "center",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(11,54,61,0.15)" strokeWidth="1.5" style={{ marginBottom: 8 }}>
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M9 15h6" />
            <path d="M9 11h6" />
          </svg>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
            color: "rgba(11,54,61,0.35)", fontStyle: "italic",
          }}>
            Terminez un parcours complet pour obtenir votre certificat
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          padding: "14px 24px",
          background: "transparent",
          color: "#c2744a",
          border: "1px solid rgba(194,116,74,0.25)",
          borderRadius: 8,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s ease-out",
          marginTop: 8,
        }}
      >
        Se déconnecter
      </button>
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case "accueil": return renderAccueil();
      case "parcours": return renderParcours();
      case "classement": return renderClassement();
      case "profil": return renderProfil();
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fef8ec", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        padding: "14px 20px",
        borderBottom: "1px solid rgba(11,54,61,0.08)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#ffffff",
      }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 18, fontWeight: 600, letterSpacing: 4,
            color: "#0b363d",
          }}>
            ARDUENNA
          </div>
        </Link>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 16, fontStyle: "italic", color: "#c2744a",
        }}>
          Academy
        </div>
      </div>

      {/* Tab content */}
      {renderTab()}

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
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              background: "none", border: "none", display: "flex",
              flexDirection: "column", alignItems: "center", gap: 2,
              padding: "8px 12px",
              color: activeTab === tab.id ? "#c2744a" : "rgba(11,54,61,0.35)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 10,
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
