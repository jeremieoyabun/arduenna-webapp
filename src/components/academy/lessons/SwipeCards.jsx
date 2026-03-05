import { useState } from "react";
import { useSwipeGesture } from "../../../hooks/useSwipeGesture";

/**
 * Swipe card lesson format. User swipes/taps through N cards, then clicks "Compris →" to proceed.
 * Cards can optionally include an `img` path and `imgContain` boolean.
 */
const L = (obj, key, lang) => obj[key + (lang === "en" ? "En" : "Fr")] ?? obj[key + "Fr"] ?? "";

export const SwipeCards = ({ lesson, onNext, lang = "fr" }) => {
  const { cards } = lesson;
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false); // true = fading out

  const isLast = index === cards.length - 1;

  const switchTo = (newIndex) => {
    setFade(true);
    setTimeout(() => {
      setIndex(newIndex);
      setFade(false);
    }, 150);
  };

  const goNext = () => {
    if (isLast) { onNext(); return; }
    switchTo(index + 1);
  };

  const goPrev = () => {
    if (index === 0) return;
    switchTo(index - 1);
  };

  const { dragX, onPointerDown, onPointerMove, onPointerUp } = useSwipeGesture({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
    threshold: 50,
  });

  const card = cards[index];
  const hasImg = !!card.img;

  const slideStyle = fade
    ? { opacity: 0, transition: "opacity 0.15s ease-out" }
    : { opacity: 1, transform: `translateX(${dragX}px)`, transition: dragX !== 0 ? "none" : "opacity 0.2s ease-out" };

  return (
    <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Card */}
      <div
        style={{
          background: "var(--bg-surface)",
          borderRadius: 16,
          padding: hasImg ? 0 : "36px 28px",
          border: "1px solid var(--border-light)",
          boxShadow: "0 4px 24px var(--border-light)",
          minHeight: 240,
          cursor: "grab",
          userSelect: "none",
          touchAction: "pan-y",
          overflow: "hidden",
          ...slideStyle,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Optional image */}
        {hasImg && (
          <div style={{
            width: "100%", height: 280,
            background: card.imgContain ? "var(--color-cream, #fef8ec)" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            <img
              src={card.img}
              alt=""
              aria-hidden="true"
              style={{
                width: "100%", height: "100%",
                objectFit: card.imgContain ? "contain" : "cover",
                objectPosition: card.imgContain ? "center" : "top",
                padding: card.imgContain ? "16px" : 0,
                display: "block",
              }}
            />
          </div>
        )}

        {/* Text content */}
        <div style={{ padding: hasImg ? "20px 24px 24px" : 0 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 24, fontWeight: 600, fontStyle: "italic",
            color: "var(--text-primary)", marginBottom: 14, lineHeight: 1.2,
          }}>
            {L(card, "title", lang)}
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15, lineHeight: 1.7,
            color: "var(--text-secondary)", margin: 0,
          }}>
            {L(card, "text", lang)}
          </p>
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => switchTo(i)}
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
            style={{
              padding: "13px 18px", background: "transparent",
              color: "var(--text-primary)", border: "1px solid var(--border-medium)",
              borderRadius: 10, fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, cursor: "pointer",
            }}
          >
            ←
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
