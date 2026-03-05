import { useEffect, useState } from "react";
import { useSwipeGesture } from "../../../hooks/useSwipeGesture";

/**
 * Swipe card lesson format. User swipes/taps through N cards, then clicks "Compris →" to proceed.
 * All card images are preloaded on mount to eliminate loading delay on swipe.
 */
const L = (obj, key, lang) => obj[key + (lang === "en" ? "En" : "Fr")] ?? obj[key + "Fr"] ?? "";

export const SwipeCards = ({ lesson, onNext, lang = "fr" }) => {
  const { cards } = lesson;
  const [index, setIndex] = useState(0);

  // Preload all card images on mount
  useEffect(() => {
    cards.forEach(c => {
      if (c.img) {
        const img = new Image();
        img.src = c.img;
      }
    });
  }, [cards]);

  const isLast = index === cards.length - 1;

  const goNext = () => {
    if (isLast) { onNext(); return; }
    setIndex(index + 1);
  };

  const goPrev = () => {
    if (index === 0) return;
    setIndex(index - 1);
  };

  const { dragX, onPointerDown, onPointerMove, onPointerUp } = useSwipeGesture({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
    threshold: 50,
  });

  const card = cards[index];
  const hasImg = !!card.img;

  return (
    <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Card stack — all cards rendered, only active one visible */}
      <div
        style={{
          position: "relative",
          minHeight: 240,
          cursor: "grab",
          userSelect: "none",
          touchAction: "pan-y",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {cards.map((c, i) => {
          const isActive = i === index;
          const cHasImg = !!c.img;
          return (
            <div
              key={i}
              style={{
                position: i === 0 ? "relative" : "absolute",
                top: 0, left: 0, width: "100%",
                background: "var(--bg-surface)",
                borderRadius: 16,
                padding: cHasImg ? 0 : "36px 28px",
                border: "1px solid var(--border-light)",
                boxShadow: "0 4px 24px var(--border-light)",
                overflow: "hidden",
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? "auto" : "none",
                transform: isActive ? `translateX(${dragX}px)` : "none",
                transition: dragX !== 0 ? "none" : "opacity 0.12s ease-out",
                zIndex: isActive ? 1 : 0,
              }}
            >
              {/* Image — capped at 40vh so text + buttons always fit on small screens */}
              {cHasImg && (
                <div style={{
                  width: "100%", height: "clamp(180px, 40vh, 280px)",
                  background: c.imgContain ? "var(--color-cream, #fef8ec)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden",
                }}>
                  <img
                    src={c.img}
                    alt=""
                    aria-hidden="true"
                    style={{
                      width: "100%", height: "100%",
                      objectFit: c.imgContain ? "contain" : "cover",
                      objectPosition: c.imgContain ? "center" : "top",
                      padding: c.imgContain ? "16px" : 0,
                      display: "block",
                    }}
                  />
                </div>
              )}

              {/* Text content */}
              <div style={{ padding: cHasImg ? "20px 24px 24px" : 0 }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 24, fontWeight: 600, fontStyle: "italic",
                  color: "var(--text-primary)", marginBottom: 14, lineHeight: 1.2,
                }}>
                  {L(c, "title", lang)}
                </div>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15, lineHeight: 1.7,
                  color: "var(--text-secondary)", margin: 0,
                }}>
                  {L(c, "text", lang)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? 22 : 8, height: 8, borderRadius: 999,
              background: i === index ? "var(--accent-secondary)" : "var(--border-subtle)",
              border: "none", padding: 0, cursor: "pointer",
              transition: "all 0.2s ease-out",
            }}
          />
        ))}
      </div>

      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 12,
        color: "var(--text-tertiary)", textAlign: "center", margin: 0,
      }}>
        {lang === "en" ? "Swipe or tap to navigate" : "Swipez ou tapez pour naviguer"}
      </p>

      {/* Nav buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        {index > 0 && (
          <button
            onClick={goPrev}
            aria-label="Précédent"
            style={{
              padding: "14px 20px", background: "transparent",
              color: "var(--text-primary)", border: "1px solid var(--border-medium)",
              borderRadius: 10, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              minWidth: 52, minHeight: 52,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <button
          onClick={goNext}
          style={{
            flex: 1, padding: "14px 24px",
            background: "#0b363d", color: "var(--text-on-dark)",
            border: "none", borderRadius: 10,
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {isLast ? (lang === "en" ? "Got it →" : "Compris →") : (lang === "en" ? "Next →" : "Suivant →")}
        </button>
      </div>
    </div>
  );
};
