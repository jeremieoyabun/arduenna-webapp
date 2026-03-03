/**
 * Editorial next-module card.
 * Dark surface, thin left color border, Cormorant headline, minimal right-aligned CTA.
 * The entire card is clickable (scale hover).
 */
export const NextModuleCard = ({ module, parcoursId, percent, onStart }) => {
  if (!module) return null;

  const PARCOURS_META = {
    univers:  { label: "L'Univers Arduenna", color: "#4a9b8a" },
    gamme:    { label: "La Gamme",           color: "#c2744a" },
    cocktail: { label: "Le Cocktail Lab",    color: "#7ab8c4" },
    vente:    { label: "Vendre Arduenna",    color: "#c9a84c" },
  };

  const meta   = PARCOURS_META[parcoursId] || PARCOURS_META.cocktail;
  const btnLabel = percent > 0 ? "Continuer" : "Commencer";

  const handleHoverIn  = e => { e.currentTarget.style.transform = "scale(1.01)"; e.currentTarget.style.opacity = "0.88"; };
  const handleHoverOut = e => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.opacity = "1"; };

  return (
    <div
      onClick={onStart}
      style={{
        background: "var(--surface)",
        borderRadius: 8,
        border: "1px solid var(--border-subtle)",
        borderLeft: `2px solid ${meta.color}`,
        padding: "20px 20px 18px",
        marginBottom: 10,
        cursor: "pointer",
        transition: "transform 0.22s ease-out, background 0.22s ease-out",
      }}
      onMouseEnter={handleHoverIn}
      onMouseLeave={handleHoverOut}
      onTouchStart={handleHoverIn}
      onTouchEnd={handleHoverOut}
    >
      {/* Parcours label */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
        <div style={{
          width: 5, height: 5, borderRadius: "50%",
          background: meta.color, flexShrink: 0,
        }} />
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10, fontWeight: 600,
          color: "var(--text-3)",
          textTransform: "uppercase", letterSpacing: "2.5px",
        }}>
          {meta.label}
        </span>
      </div>

      {/* Module title */}
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 24, fontWeight: 600, fontStyle: "italic",
        color: "var(--text-1)", lineHeight: 1.2, marginBottom: 6,
      }}>
        {module.titleFr}
      </div>

      {/* Meta */}
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12, color: "var(--text-4)",
        marginBottom: percent > 0 ? 16 : 18,
      }}>
        {module.lessonCount} activités · {module.duration}
      </div>

      {/* Progress bar — shown only if started */}
      {percent > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{
            height: 3, borderRadius: 999,
            background: "var(--border-subtle)", overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 999,
              width: `${percent}%`,
              background: meta.color,
              transition: "width 0.4s ease-out",
            }} />
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10, color: "var(--text-4)",
            marginTop: 5,
          }}>
            {percent}% complété
          </div>
        </div>
      )}

      {/* CTA — right-aligned, text style */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, fontWeight: 600,
          color: meta.color,
          letterSpacing: "0.1px",
        }}>
          {btnLabel}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>
    </div>
  );
};
