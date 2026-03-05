import { useState } from "react";
import { UserDetail } from "./UserDetail";

const ROLE_LABELS = { bartender: "Bartender", commercial: "Commercial", caviste: "Caviste" };
const ROLE_OPTIONS = ["all", "bartender", "commercial", "caviste"];

/**
 * Filterable team table.
 * Props: enrichedUsers (array from getEnrichedUsers)
 */
export const TeamView = ({ enrichedUsers }) => {
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = enrichedUsers
    .filter(u => roleFilter === "all" || u.role === roleFilter)
    .filter(u => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (u.displayName || u.firstName || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (b.progress?.xp || 0) - (a.progress?.xp || 0));

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 3600 * 1000;

  return (
    <div style={{ padding: "16px 20px" }}>
      {/* Search + filter */}
      <input
        type="text"
        placeholder="Rechercher un utilisateur..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%", padding: "10px 14px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-light)",
          borderRadius: 8, marginBottom: 12,
          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          color: "var(--text-primary)",
          outline: "none", boxSizing: "border-box",
        }}
      />

      {/* Role chips */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {ROLE_OPTIONS.map(r => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            style={{
              padding: "5px 12px", borderRadius: 999,
              border: "1px solid",
              borderColor: roleFilter === r ? "#0b363d" : "var(--border-light)",
              background: roleFilter === r ? "#0b363d" : "var(--bg-surface)",
              color: roleFilter === r ? "#fef8ec" : "var(--text-secondary)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {r === "all" ? "Tous" : ROLE_LABELS[r]}
          </button>
        ))}
        <span style={{
          marginLeft: "auto", alignSelf: "center",
          fontFamily: "'DM Sans', sans-serif", fontSize: 12,
          color: "var(--text-muted)",
        }}>
          {filtered.length} utilisateur{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* User rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.length === 0 ? (
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            color: "var(--text-muted)", fontStyle: "italic",
            textAlign: "center", padding: "32px 0",
          }}>
            Aucun utilisateur trouvé.
          </div>
        ) : filtered.map(u => {
          const prog = u.progress;
          const isActive = u.lastLoginAt && u.lastLoginAt > sevenDaysAgo;
          const completedParcours = Object.values(prog?.parcours || {}).filter(p => p.completedAt).length;
          const allScores = [];
          Object.values(prog?.parcours || {}).forEach(p => {
            Object.values(p.modules || {}).forEach(m => {
              if (m.score != null) allScores.push(m.score);
            });
          });
          const avgScore = allScores.length > 0
            ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
            : null;

          const lastLogin = u.lastLoginAt
            ? new Date(u.lastLoginAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
            : "jamais";

          const initial = (u.displayName || u.firstName || "?")[0].toUpperCase();

          return (
            <div
              key={u.uid}
              onClick={() => setSelectedUser(u)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 14px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
                borderRadius: 10, cursor: "pointer",
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 34, height: 34, borderRadius: 999, flexShrink: 0,
                background: isActive ? "rgba(58,122,107,0.12)" : "var(--border-light)",
                border: `1.5px solid ${isActive ? "rgba(58,122,107,0.3)" : "var(--border-medium)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                color: isActive ? "#3a7a6b" : "var(--text-muted)",
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

              {/* Stats */}
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0, gap: 2,
              }}>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                  color: "var(--text-primary)",
                }}>
                  {prog?.xp || 0} XP
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                  color: "var(--text-tertiary)",
                }}>
                  {completedParcours} parcours · {avgScore != null ? `${avgScore}%` : "—"} · {lastLogin}
                </div>
              </div>

              {/* Chevron */}
              <div style={{ color: "var(--text-muted)", flexShrink: 0, fontSize: 14 }}>›</div>
            </div>
          );
        })}
      </div>

      {/* User detail sheet */}
      {selectedUser && (
        <UserDetail
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};
