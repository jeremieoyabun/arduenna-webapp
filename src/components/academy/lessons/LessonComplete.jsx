import { useEffect, useState } from "react";

/** Simple confetti burst — pure CSS, no lib. */
const CONFETTI_COLORS = ["#c2744a", "#0b363d", "#52b069", "#e08c3a", "#fef8ec", "#D8F3DC"];
const CONFETTI_COUNT = 24;

const Confetti = () => {
  const pieces = Array.from({ length: CONFETTI_COUNT }, (_, i) => {
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const left = `${Math.random() * 100}%`;
    const delay = `${Math.random() * 0.5}s`;
    const size = 6 + Math.random() * 6;
    const duration = `${0.6 + Math.random() * 0.6}s`;
    return { color, left, delay, size, duration, id: i };
  });

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 300, overflow: "hidden" }}>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: "-10px",
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            background: p.color,
            animation: `confetti-fall ${p.duration} ${p.delay} ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
};

export const LessonComplete = ({ score, xpGain, onContinue }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 2500);
    return () => clearTimeout(t);
  }, []);

  const isPerfect = score === 100;
  const hasScore = score !== null && score !== undefined;

  return (
    <>
      {showConfetti && <Confetti />}

      <div style={{
        minHeight: "100vh", background: "var(--bg-primary)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 24px", textAlign: "center",
      }}>
        {/* Checkmark */}
        <div style={{
          width: 80, height: 80, borderRadius: 999,
          background: isPerfect ? "rgba(194,116,74,0.12)" : "rgba(82,176,105,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24,
          animation: "badge-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
            stroke={isPerfect ? "#c2744a" : "#52b069"} strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 32, fontWeight: 400, fontStyle: "italic",
          color: "var(--text-primary)", marginBottom: 8,
        }}>
          {isPerfect ? "Score parfait !" : "Module terminé !"}
        </h2>

        {/* Score */}
        {hasScore && (
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 15,
            color: "var(--text-tertiary)", marginBottom: 28,
          }}>
            {score}% de bonnes réponses
          </div>
        )}

        {/* XP */}
        <div style={{
          background: "var(--bg-surface)",
          borderRadius: 12, padding: "16px 32px",
          border: "1px solid var(--border-light)",
          boxShadow: "0 2px 12px rgba(11,54,61,0.04)",
          marginBottom: 36,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        }}>
          <img src="/icons/XP.svg" alt="XP" width="36" height="36" style={{ objectFit: "contain", display: "block" }} />
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, color: "var(--text-primary)",
          }}>
            +{xpGain} XP
          </div>
          {isPerfect && (
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12,
              color: "var(--accent-secondary)", fontWeight: 600,
            }}>
              Dont +25 bonus score parfait !
            </div>
          )}
        </div>

        {/* Continue */}
        <button
          onClick={onContinue}
          style={{
            width: "100%", maxWidth: 360,
            padding: "16px 24px",
            background: "#0b363d", color: "var(--text-on-dark)",
            border: "none", borderRadius: 12,
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Continuer →
        </button>
      </div>
    </>
  );
};
