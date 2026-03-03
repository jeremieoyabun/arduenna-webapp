/**
 * Vivid hero card — the central CTA of the dashboard.
 * Colored gradient background from the parcours color.
 *
 * Props:
 *   module     { id, titleFr, duration, lessonCount }
 *   parcoursId string
 *   percent    number  0–100
 *   onStart    () => void
 */
export const NextModuleCard = ({ module, parcoursId, percent, onStart }) => {
  if (!module) return null;

  const PARCOURS_META = {
    univers:  { label: "L'Univers Arduenna", color: "#2d6b5e", shadow: "rgba(45,107,94,0.35)" },
    gamme:    { label: "La Gamme",           color: "#b8622a", shadow: "rgba(184,98,42,0.35)" },
    cocktail: { label: "Le Cocktail Lab",    color: "#0b363d", shadow: "rgba(11,54,61,0.35)"  },
    vente:    { label: "Vendre Arduenna",    color: "#7a5a10", shadow: "rgba(122,90,16,0.35)" },
  };

  const meta = PARCOURS_META[parcoursId] || PARCOURS_META.cocktail;
  const btnLabel = percent > 0 ? "Continuer" : "Commencer";

  return (
    <div style={{
      position: "relative",
      background: `linear-gradient(140deg, ${meta.color} 0%, ${meta.color}cc 100%)`,
      borderRadius: 20,
      padding: "24px 22px",
      marginBottom: 16,
      overflow: "hidden",
      boxShadow: `0 10px 36px ${meta.shadow}`,
    }}>
      {/* Decorative circles */}
      <div style={{
        position: "absolute", right: -36, top: -36,
        width: 160, height: 160, borderRadius: "50%",
        background: "rgba(254,248,236,0.08)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: 24, bottom: -44,
        width: 90, height: 90, borderRadius: "50%",
        background: "rgba(254,248,236,0.05)",
        pointerEvents: "none",
      }} />

      {/* Pill label */}
      <div style={{
        display: "inline-flex", alignItems: "center",
        background: "rgba(254,248,236,0.15)",
        border: "1px solid rgba(254,248,236,0.12)",
        borderRadius: 999, padding: "4px 12px",
        marginBottom: 14,
      }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10, fontWeight: 600,
          color: "rgba(254,248,236,0.75)",
          textTransform: "uppercase", letterSpacing: "1.8px",
        }}>
          Prochain module · {meta.label}
        </span>
      </div>

      {/* Module title */}
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 24, fontWeight: 600, fontStyle: "italic",
        color: "#fef8ec", marginBottom: 6, lineHeight: 1.2,
      }}>
        {module.titleFr}
      </div>

      {/* Meta */}
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12, color: "rgba(254,248,236,0.55)",
        marginBottom: 20,
      }}>
        {module.lessonCount} activités · {module.duration}
      </div>

      {/* Progress bar */}
      {percent > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{
            height: 5, borderRadius: 999,
            background: "rgba(254,248,236,0.15)", overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 999,
              width: `${percent}%`,
              background: "#fef8ec",
              transition: "width 0.5s cubic-bezier(0.34,1.2,0.64,1)",
            }} />
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10, color: "rgba(254,248,236,0.45)",
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
          width: "100%", padding: "14px 20px",
          background: "#fef8ec", color: meta.color,
          border: "none", borderRadius: 12,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, fontWeight: 700,
          cursor: "pointer",
          transition: "transform 0.15s ease-out, opacity 0.15s ease-out",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
        onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {btnLabel}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
};
