import { computeKPIs } from "../../lib/adminService";

const PARCOURS_LABELS = {
  univers: "L'Univers Arduenna",
  gamme: "La Gamme",
  cocktail: "Le Cocktail Lab",
  vente: "Vendre Arduenna",
};

const PARCOURS_COLORS = {
  univers: "#3a7a6b",
  gamme: "#c2744a",
  cocktail: "#0b363d",
  vente: "#8B6914",
};

const Stat = ({ icon, value, label, sub }) => (
  <div style={{
    background: "var(--bg-surface)",
    border: "1px solid var(--border-light)",
    borderRadius: 12, padding: "16px 18px",
  }}>
    <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 24, fontWeight: 700, color: "var(--text-primary)",
      lineHeight: 1.1, marginBottom: 2,
    }}>
      {value ?? "—"}
    </div>
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 11, color: "var(--text-tertiary)",
      textTransform: "uppercase", letterSpacing: "1.2px",
    }}>
      {label}
    </div>
    {sub && (
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11, color: "var(--text-muted)", marginTop: 4,
      }}>
        {sub}
      </div>
    )}
  </div>
);

/**
 * KPI dashboard for admin overview tab.
 * Props: enrichedUsers (array from getEnrichedUsers)
 */
export const AdminOverview = ({ enrichedUsers }) => {
  const kpis = computeKPIs(enrichedUsers);

  return (
    <div style={{ padding: "20px" }}>
      {/* Header KPI grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
        gap: 12, marginBottom: 24,
      }}>
        <Stat icon="👥" value={kpis.totalUsers} label="Utilisateurs" sub={`${kpis.activeUsers} actifs (7j)`} />
        <Stat icon="⭐" value={`${kpis.totalXP.toLocaleString("fr-FR")} XP`} label="XP distribués" />
        <Stat icon="🎯" value={kpis.avgScore != null ? `${kpis.avgScore}%` : "—"} label="Score moyen" />
        <Stat icon="🔥" value={`${kpis.avgStreak}j`} label="Streak moyen" sub="utilisateurs actifs" />
      </div>

      {/* Completion rates by parcours */}
      <div style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-light)",
        borderRadius: 12, padding: "18px 20px",
        marginBottom: 20,
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10, color: "var(--text-tertiary)",
          textTransform: "uppercase", letterSpacing: "1.5px",
          marginBottom: 16,
        }}>
          Taux de complétion par parcours
        </div>

        {kpis.parcoursStats.map(({ id, started, completed, rate }) => (
          <div key={id} style={{ marginBottom: 14 }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 5,
            }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                color: started > 0 ? "var(--text-secondary)" : "var(--text-muted)",
                fontWeight: started > 0 ? 500 : 400,
              }}>
                {PARCOURS_LABELS[id]}
              </span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                color: "var(--text-tertiary)",
              }}>
                {completed}/{started} · {rate}%
              </span>
            </div>
            <div style={{
              height: 6, borderRadius: 999,
              background: "var(--border-light)", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: 999,
                width: `${rate}%`,
                background: rate === 100 ? PARCOURS_COLORS[id] : "#0b363d",
                transition: "width 0.5s ease-out",
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Role breakdown */}
      <div style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-light)",
        borderRadius: 12, padding: "18px 20px",
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10, color: "var(--text-tertiary)",
          textTransform: "uppercase", letterSpacing: "1.5px",
          marginBottom: 14,
        }}>
          Répartition par rôle
        </div>
        {["bartender", "commercial", "caviste"].map(r => {
          const count = enrichedUsers.filter(u => u.role === r).length;
          const pct = enrichedUsers.length > 0 ? Math.round((count / enrichedUsers.length) * 100) : 0;
          const ROLE_LABELS = { bartender: "Bartender", commercial: "Commercial", caviste: "Caviste / Distributeur" };
          return (
            <div key={r} style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 10,
            }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                color: "var(--text-secondary)", width: 140, flexShrink: 0,
              }}>
                {ROLE_LABELS[r]}
              </div>
              <div style={{
                flex: 1, height: 5, borderRadius: 999,
                background: "var(--border-light)", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: 999,
                  width: `${pct}%`, background: "#c2744a",
                  transition: "width 0.4s ease-out",
                }} />
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                color: "var(--text-tertiary)", width: 40, textAlign: "right",
              }}>
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
