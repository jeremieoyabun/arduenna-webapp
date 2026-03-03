import { generateCSV, downloadCSV } from "../../lib/adminService";

/**
 * CSV export panel.
 * Props: enrichedUsers (array)
 */
export const CSVExport = ({ enrichedUsers }) => {
  const handleExport = () => {
    const csv = generateCSV(enrichedUsers);
    const date = new Date().toISOString().split("T")[0];
    downloadCSV(csv, `arduenna-academy-${date}.csv`);
  };

  const cols = [
    { label: "Nom", desc: "Prénom + nom de l'utilisateur" },
    { label: "Email", desc: "Adresse email" },
    { label: "Rôle", desc: "bartender / commercial / caviste" },
    { label: "XP Total", desc: "Points d'expérience accumulés" },
    { label: "Streak", desc: "Jours consécutifs d'activité" },
    { label: "Parcours complétés", desc: "Noms des parcours terminés" },
    { label: "Score moyen (%)", desc: "Moyenne de tous les quiz" },
    { label: "Dernier login", desc: "Date de dernière connexion" },
    { label: "Badges", desc: "Nombre de badges débloqués" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {/* Export card */}
      <div style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-light)",
        borderRadius: 12, padding: "20px",
        marginBottom: 20,
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 18, fontStyle: "italic",
          color: "var(--text-primary)", marginBottom: 6,
        }}>
          Export CSV — {enrichedUsers.length} utilisateur{enrichedUsers.length !== 1 ? "s" : ""}
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12,
          color: "var(--text-tertiary)", marginBottom: 18, lineHeight: 1.5,
        }}>
          Exporte toutes les données de formation au format CSV, compatible Excel et Google Sheets.
          L'encodage UTF-8 avec BOM garantit l'affichage correct des accents.
        </div>

        <button
          onClick={handleExport}
          disabled={enrichedUsers.length === 0}
          style={{
            width: "100%",
            padding: "13px 20px",
            background: enrichedUsers.length > 0 ? "#0b363d" : "var(--border-light)",
            color: enrichedUsers.length > 0 ? "#fef8ec" : "var(--text-muted)",
            border: "none", borderRadius: 8,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
            cursor: enrichedUsers.length > 0 ? "pointer" : "not-allowed",
          }}
        >
          ⬇ Télécharger CSV
        </button>
      </div>

      {/* Column definitions */}
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
          Colonnes incluses
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {cols.map(({ label, desc }) => (
            <div key={label} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                color: "var(--text-primary)", width: 140, flexShrink: 0,
              }}>
                {label}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                color: "var(--text-tertiary)", flex: 1,
              }}>
                {desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
