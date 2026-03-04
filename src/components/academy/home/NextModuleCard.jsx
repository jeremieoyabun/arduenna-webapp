/**
 * Editorial featured block — no card chrome.
 * Left accent bar in parcours color + subtle left-edge color wash for depth.
 * 34px Cormorant italic headline. Hover: opacity only.
 */
export const NextModuleCard = ({ module, parcoursId, percent, onStart }) => {
  if (!module) return null;

  const PARCOURS_META = {
    univers:  { label: "L'Univers Arduenna", color: "#4a9b8a", bg: "/Les3botanniques.webp" },
    gamme:    { label: "La Gamme",           color: "#c2744a", bg: "/Les3botanniques.webp" },
    cocktail: { label: "Le Cocktail Lab",    color: "#7ab8c4", bg: "/Les3botanniques.webp" },
    vente:    { label: "Vendre Arduenna",    color: "#c9a84c", bg: null                    },
  };

  const CAP = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 10, fontWeight: 600,
    color: "var(--text-3)",
    textTransform: "uppercase", letterSpacing: "2.5px",
  };

  const meta = PARCOURS_META[parcoursId] || PARCOURS_META.cocktail;
  const btnLabel = percent > 0 ? "Continuer" : "Commencer";

  return (
    <div
      onClick={onStart}
      style={{
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
        borderLeft: `3px solid ${meta.color}`,
        paddingLeft: 20,
        cursor: "pointer",
        transition: "opacity 0.22s ease-out",
        // Parcours-color left wash — depth without a card frame
        background: `linear-gradient(90deg, ${meta.color}0e 0%, transparent 55%)`,
        borderRadius: 4,
        paddingTop: 14,
        paddingBottom: 14,
        paddingRight: 4,
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.72"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
      onTouchStart={e => { e.currentTarget.style.opacity = "0.72"; }}
      onTouchEnd={e => { e.currentTarget.style.opacity = "1"; }}
    >
      {/* Background botanical image — behind text content */}
      {meta.bg && (
        <div style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: "100%",
          zIndex: -1,
          opacity: 0.25,
          WebkitMaskImage: "linear-gradient(to right, black 0%, black 30%, transparent 85%)",
          maskImage: "linear-gradient(to right, black 0%, black 30%, transparent 85%)",
          pointerEvents: "none",
          overflow: "hidden",
        }}>
          <img
            src={meta.bg}
            alt=""
            style={{
              position: "absolute",
              left: 0, top: "50%",
              transform: "translateY(-50%)",
              height: "200%",
              width: "auto",
              display: "block",
            }}
          />
        </div>
      )}

      {/* Text content — z-index 1, above bg image */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Parcours label */}
        <div style={{ ...CAP, marginBottom: 14 }}>{meta.label}</div>

        {/* Module title — editorial large */}
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 34, fontWeight: 600, fontStyle: "italic",
          color: "var(--text-1)", lineHeight: 1.15, marginBottom: 8,
        }}>
          {module.titleFr}
        </div>

        {/* Meta */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, color: "var(--text-2)", fontWeight: 500,
          marginBottom: percent > 0 ? 16 : 22,
        }}>
          {module.lessonCount} activités · {module.duration}
        </div>

        {/* Progress bar */}
        {percent > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              position: "relative", height: 2, borderRadius: 999,
              background: "var(--border-subtle)",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0,
                height: "100%", borderRadius: 999,
                width: `${percent}%`,
                background: meta.color,
                transition: "width 0.4s ease-out",
              }} />
              {percent < 100 && (
                <div style={{
                  position: "absolute",
                  left: `${percent}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%) rotate(45deg)",
                  width: 7, height: 7,
                  background: meta.color,
                  borderRadius: "0 2px 0 2px",
                  opacity: 0.8,
                  transition: "left 0.4s ease-out",
                }} />
              )}
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

        {/* CTA — right-aligned, decorative (parent div is the click target) */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            className="cta-copper"
            style={{ display: "inline-flex", alignItems: "center", gap: 5, pointerEvents: "none" }}
          >
            {btnLabel}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
