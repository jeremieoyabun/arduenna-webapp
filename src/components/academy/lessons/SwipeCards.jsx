import { useState } from "react";
import { useSwipeGesture } from "../../../hooks/useSwipeGesture";

/**
 * Swipe card lesson format. User swipes/taps through N cards, then clicks "Compris →" to proceed.
 */
export const SwipeCards = ({ lesson, onNext }) => {
  const { cards } = lesson;
  const [index, setIndex] = useState(0);
  const [animDir, setAnimDir] = useState(null); // "left" | "right" | null

  const isLast = index === cards.length - 1;

  const animate = (dir, afterFn) => {
    setAnimDir(dir);
    setTimeout(() => { afterFn(); setAnimDir(null); }, 180);
  };

  const goNext = () => {
    if (isLast) { onNext(); return; }
    animate("left", () => setIndex(i => i + 1));
  };

  const goPrev = () => {
    if (index === 0) return;
    animate("right", () => setIndex(i => i - 1));
  };

  const { dragX, onPointerDown, onPointerMove, onPointerUp } = useSwipeGesture({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
    threshold: 50,
  });

  const card = cards[index];

  const slideStyle = animDir
    ? { transform: `translateX(${animDir === "left" ? "-60px" : "60px"})`, opacity: 0, transition: "transform 0.18s ease-out, opacity 0.18s ease-out" }
    : { transform: `translateX(${dragX}px)`, transition: dragX !== 0 ? "none" : "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)" };

  return (
    <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Card */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          padding: "36px 28px",
          border: "1px solid rgba(11,54,61,0.08)",
          boxShadow: "0 4px 24px rgba(11,54,61,0.06)",
          minHeight: 240,
          cursor: "grab",
          userSelect: "none",
          touchAction: "pan-y",
          ...slideStyle,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 24, fontWeight: 600, fontStyle: "italic",
          color: "#0b363d", marginBottom: 18, lineHeight: 1.2,
        }}>
          {card.titleFr}
        </div>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15, lineHeight: 1.7,
          color: "rgba(11,54,61,0.8)", margin: 0,
        }}>
          {card.textFr}
        </p>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => animate(i > index ? "left" : "right", () => setIndex(i))}
            style={{
              width: i === index ? 22 : 8, height: 8, borderRadius: 999,
              background: i === index ? "#0b363d" : "rgba(11,54,61,0.15)",
              border: "none", padding: 0, cursor: "pointer",
              transition: "all 0.2s ease-out",
            }}
          />
        ))}
      </div>

      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 12,
        color: "rgba(11,54,61,0.3)", textAlign: "center", margin: 0,
      }}>
        Swipez ou tapez pour naviguer
      </p>

      {/* Nav buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        {index > 0 && (
          <button
            onClick={goPrev}
            style={{
              padding: "13px 18px", background: "transparent",
              color: "#0b363d", border: "1px solid rgba(11,54,61,0.15)",
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
            background: "#0b363d", color: "#fef8ec",
            border: "none", borderRadius: 10,
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {isLast ? "Compris →" : "Suivant →"}
        </button>
      </div>
    </div>
  );
};
