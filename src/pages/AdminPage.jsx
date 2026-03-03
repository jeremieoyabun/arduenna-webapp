import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";
import { getEnrichedUsers } from "../lib/adminService";
import { AdminOverview } from "../components/admin/AdminOverview";
import { TeamView } from "../components/admin/TeamView";
import { AlertsPanel } from "../components/admin/AlertsPanel";
import { CSVExport } from "../components/admin/CSVExport";
import { getInactiveUsers } from "../lib/adminService";

const TABS = [
  { id: "overview", label: "Aperçu", icon: "📊" },
  { id: "team", label: "Équipe", icon: "👥" },
  { id: "alerts", label: "Alertes", icon: "⚠️" },
  { id: "export", label: "Export", icon: "⬇" },
];

/**
 * Admin dashboard page — /admin
 * Guarded: redirects to /academy if user is not isAdmin.
 */
export const AdminPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [enrichedUsers, setEnrichedUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Auth guard
  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    if (!isAdmin) { navigate("/academy"); return; }
  }, [user, isAdmin, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch data
  useEffect(() => {
    if (!user || !isAdmin) return;
    setDataLoading(true);
    getEnrichedUsers()
      .then(setEnrichedUsers)
      .catch(err => console.warn("Admin data fetch error:", err))
      .finally(() => setDataLoading(false));
  }, [user, isAdmin]);

  if (authLoading || (!isAdmin && user)) {
    return (
      <div style={{
        minHeight: "100vh", background: "var(--bg-primary)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 20, fontStyle: "italic", color: "var(--accent-secondary)",
        }}>
          Chargement...
        </div>
      </div>
    );
  }

  const inactiveCount = getInactiveUsers(enrichedUsers).length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        padding: "14px 20px",
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-light)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => navigate("/academy")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", fontSize: 20, padding: 0, lineHeight: 1,
            }}
            aria-label="Retour à l'Academy"
          >
            ←
          </button>
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 18, fontStyle: "italic", color: "var(--text-primary)",
              lineHeight: 1.2,
            }}>
              Administration
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10, color: "var(--text-tertiary)",
              textTransform: "uppercase", letterSpacing: "1.5px",
            }}>
              Arduenna Academy
            </div>
          </div>
        </div>

        {/* Refresh indicator */}
        {dataLoading && (
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 11,
            color: "var(--text-muted)", fontStyle: "italic",
          }}>
            Chargement...
          </div>
        )}
      </div>

      {/* Tab content */}
      {dataLoading ? (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "80px 20px",
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 18, fontStyle: "italic", color: "var(--accent-secondary)",
          }}>
            Chargement des données...
          </div>
        </div>
      ) : (
        <>
          {activeTab === "overview" && <AdminOverview enrichedUsers={enrichedUsers} />}
          {activeTab === "team" && <TeamView enrichedUsers={enrichedUsers} />}
          {activeTab === "alerts" && <AlertsPanel enrichedUsers={enrichedUsers} />}
          {activeTab === "export" && <CSVExport enrichedUsers={enrichedUsers} />}
        </>
      )}

      {/* Bottom tab bar */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-light)",
        display: "flex", justifyContent: "space-around",
        padding: "8px 0 env(safe-area-inset-bottom, 8px)",
        zIndex: 1000,
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          const hasAlert = tab.id === "alerts" && inactiveCount > 0;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 2, padding: "6px 12px",
                fontFamily: "'DM Sans', sans-serif", fontSize: 10,
                letterSpacing: "0.08em",
                color: active ? "var(--accent-secondary)" : "var(--text-muted)",
                position: "relative",
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{tab.icon}</span>
              {tab.label}
              {hasAlert && (
                <div style={{
                  position: "absolute", top: 4, right: 10,
                  width: 7, height: 7, borderRadius: 999,
                  background: "#c2744a",
                  border: "1.5px solid var(--bg-surface)",
                }} />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
