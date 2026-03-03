import { useState } from "react";

const L = (obj, key, lang) => obj[key + (lang === "en" ? "En" : "Fr")] ?? obj[key + "Fr"] ?? "";

/**
 * True/False lesson format. Statement + 2 big buttons + feedback + explanation.
 */
export const TrueFalse = ({ lesson, onNext, lang = "fr" }) => {
  const [answer, setAnswer] = useState(null); // null | true | false
  const answered = answer !== null;
  const isCorrect = answer === lesson.correct;

  const handleAnswer = (val) => {
    if (answered) return;
    setAnswer(val);
  };

  const handleNext = () => {
    onNext(isCorrect ? 100 : 0);
    setAnswer(null);
  };

  const btnStyle = (val) => {
    const base = {
      flex: 1, padding: "18px 12px", borderRadius: 12,
      fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700,
      cursor: answered ? "default" : "pointer",
      border: "2px solid transparent",
      transition: "all 0.15s ease-out",
    };

    if (!answered) {
      return val
        ? { ...base, background: "var(--border-light)", color: "var(--text-primary)", border: "2px solid var(--border-medium)" }
        : { ...base, background: "rgba(194,116,74,0.06)", color: "var(--accent-secondary)", border: "2px solid rgba(194,116,74,0.2)" };
    }

    if (val === lesson.correct) {
      return { ...base, background: "#D8F3DC", color: "#1d6432", border: "2px solid #52b069" };
    }
    if (val === answer && val !== lesson.correct) {
      return { ...base, background: "#FFF3E0", color: "#8a4a00", border: "2px solid #e08c3a", animation: "shake-wrong 0.2s ease-out" };
    }
    return { ...base, opacity: 0.35 };
  };

  return (
    <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Statement */}
      <div style={{
        background: "var(--bg-surface)",
        borderRadius: 14,
        padding: "28px 24px",
        border: "1px solid var(--border-light)",
        boxShadow: "0 2px 12px rgba(11,54,61,0.04)",
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11,
          fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5,
          color: "var(--text-tertiary)", marginBottom: 14,
        }}>
          {lang === "en" ? "True or False?" : "Vrai ou Faux ?"}
        </div>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.55,
          color: "var(--text-primary)", margin: 0, fontWeight: 500,
        }}>
          {L(lesson, "statement", lang)}
        </p>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 12 }}>
        <button style={btnStyle(true)} onClick={() => handleAnswer(true)}>
          {answered && answer === true && lesson.correct === true && "✓ "}
          {answered && answer === true && lesson.correct !== true && "✗ "}
          {lang === "en" ? "True" : "Vrai"}
        </button>
        <button style={btnStyle(false)} onClick={() => handleAnswer(false)}>
          {answered && answer === false && lesson.correct === false && "✓ "}
          {answered && answer === false && lesson.correct !== false && "✗ "}
          {lang === "en" ? "False" : "Faux"}
        </button>
      </div>

      {/* Explanation */}
      {answered && (
        <div aria-live="polite" style={{
          padding: "14px 16px",
          background: isCorrect ? "rgba(216,243,220,0.5)" : "rgba(255,243,224,0.6)",
          borderRadius: 10,
          borderLeft: `3px solid ${isCorrect ? "#52b069" : "#e08c3a"}`,
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
            fontWeight: 700, textTransform: "uppercase", letterSpacing: 1,
            color: isCorrect ? "#1d6432" : "#8a4a00", marginBottom: 6,
          }}>
            {isCorrect
              ? (lang === "en" ? "Correct!" : "Correct !")
              : (lang === "en" ? "Not quite..." : "Pas tout à fait...")}
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.55,
            color: "var(--text-secondary)", margin: 0,
          }}>
            {L(lesson, "explanation", lang)}
          </p>
        </div>
      )}

      {/* Next */}
      {answered && (
        <button
          onClick={handleNext}
          style={{
            padding: "14px 24px", background: "#0b363d", color: "var(--text-on-dark)",
            border: "none", borderRadius: 10,
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {lang === "en" ? "Next →" : "Suivant →"}
        </button>
      )}
    </div>
  );
};
