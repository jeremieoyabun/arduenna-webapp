/**
 * Prominent card showing the next unlocked module to complete.
 * Central UX element — must be visible without scrolling (2-second rule).
 *
 * Props:
 *   module     { id, titleFr, duration, lessonCount }
 *   parcoursId string
 *   percent    number  0-100 (progress if started)
 *   onStart    () => void
 */
export const NextModuleCard = ({ module, parcoursId, percent, onStart }) => {
  if (!module) return null;

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

  const color = PARCOURS_COLORS[parcoursId] || "#0b363d";
  const btnLabel = percent > 0 ? "Continuer" : "Commencer";

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-light)",
        borderTop: `3px solid ${color}`,
        borderRadius: 12,
        padding: "18px 20px",
        marginBottom: 16,
        boxShadow: "0 2px 12px rgba(11,54,61,0.04)",
      }}
    >
      {/* Label */}
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10, color: "var(--text-tertiary)",
        textTransform: "uppercase", letterSpacing: "1.5px",
        marginBottom: 12,
      }}>
        Prochain module · {PARCOURS_LABELS[parcoursId] || parcoursId}
      </div>

      {/* Module title + meta */}
      <div style={{ marginBottom: percent > 0 ? 12 : 16 }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 16, fontWeight: 600,
          color: "var(--text-primary)", marginBottom: 4,
        }}>
          {module.titleFr}
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, color: "var(--text-tertiary)",
        }}>
          {module.lessonCount} activités · {module.duration}
        </div>
      </div>

      {/* Progress bar (only if started) */}
      {percent > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{
            height: 5, borderRadius: 999,
            background: "var(--border-light)", overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 999,
              width: `${percent}%`,
              background: color,
              transition: "width 0.4s ease-out",
            }} />
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10, color: "var(--text-muted)",
            marginTop: 4,
          }}>
            {percent}% complété
          </div>
        </div>
      )}

      {/* CTA button */}
      <button
        onClick={onStart}
        style={{
          width: "100%",
          padding: "12px 20px",
          background: color,
          color: "#fef8ec",
          border: "none", borderRadius: 8,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, fontWeight: 600,
          cursor: "pointer",
          transition: "opacity 0.2s ease-out",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        {btnLabel}
      </button>
    </div>
  );
};
