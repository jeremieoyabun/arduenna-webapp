import { getInactiveUsers } from "../../lib/adminService";

const ROLE_LABELS = { bartender: "Bartender", commercial: "Commercial", caviste: "Caviste" };

/**
 * Shows users who haven't logged in for 7+ days.
 * Props: enrichedUsers (array)
 */
export const AlertsPanel = ({ enrichedUsers }) => {
  const inactive = getInactiveUsers(enrichedUsers);

  if (inactive.length === 0) {
    return (
      <div style={{ padding: "32px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 18, fontStyle: "italic", color: "var(--text-primary)",
          marginBottom: 6,
        }}>
          Aucune alerte
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, color: "var(--text-tertiary)",
        }}>
          Tous les utilisateurs se sont connectés dans les 7 derniers jours.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 20px" }}>
      {/* Alert banner */}
      <div style={{
        background: "rgba(194,116,74,0.08)",
        border: "1px solid rgba(194,116,74,0.2)",
        borderRadius: 10, padding: "12px 16px",
        marginBottom: 16,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>⚠️</span>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          color: "var(--accent-secondary)",
        }}>
          <strong>{inactive.length}</strong> utilisateur{inactive.length !== 1 ? "s" : ""} inactif{inactive.length !== 1 ? "s" : ""} depuis 7+ jours
        </div>
      </div>

      {/* Inactive user list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {inactive.map(u => {
          const daysSince = u.lastLoginAt
            ? Math.floor((Date.now() - u.lastLoginAt) / (24 * 3600 * 1000))
            : null;
          const lastLogin = u.lastLoginAt
            ? new Date(u.lastLoginAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
            : "jamais";
          const initial = (u.displayName || u.firstName || "?")[0].toUpperCase();

          return (
            <div key={u.uid} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 14px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-light)",
              borderRadius: 10,
            }}>
              {/* Avatar */}
              <div style={{
                width: 34, height: 34, borderRadius: 999, flexShrink: 0,
                background: "rgba(194,116,74,0.08)",
                border: "1.5px solid rgba(194,116,74,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                color: "var(--accent-secondary)",
              }}>
                {initial}
              </div>

              {/* Name + role */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                  color: "var(--text-primary)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {u.displayName || u.firstName || u.email || "—"}
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                  color: "var(--text-tertiary)",
                }}>
                  {ROLE_LABELS[u.role] || u.role || "—"}
                </div>
              </div>

              {/* Inactivity duration */}
              <div style={{
                padding: "4px 10px", borderRadius: 999, flexShrink: 0,
                background: "rgba(194,116,74,0.08)",
                border: "1px solid rgba(194,116,74,0.18)",
                fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
                color: "var(--accent-secondary)",
              }}>
                {daysSince != null ? `+${daysSince}j` : lastLogin}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
