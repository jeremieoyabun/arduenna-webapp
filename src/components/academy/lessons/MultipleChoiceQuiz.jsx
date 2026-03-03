import { useState } from "react";

const L = (obj, key, lang) => obj[key + (lang === "en" ? "En" : "Fr")] ?? obj[key + "Fr"] ?? "";

/**
 * MCQ lesson format. 4 options, immediate color feedback, explanation, then "Suivant".
 */
export const MultipleChoiceQuiz = ({ lesson, stepIndex, onNext, lang = "fr" }) => {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;
  const isCorrect = selected === lesson.correctIndex;

  const handleSelect = (i) => {
    if (answered) return;
    setSelected(i);
  };

  const handleNext = () => {
    onNext(selected === lesson.correctIndex ? 100 : 0);
    setSelected(null);
  };

  const getOptionStyle = (i) => {
    const base = {
      width: "100%", minHeight: 52, padding: "14px 16px",
      borderRadius: 10, border: "1.5px solid var(--border-medium)",
      background: "var(--bg-surface)", textAlign: "left",
      fontFamily: "'DM Sans', sans-serif", fontSize: 14,
      color: "var(--text-primary)", cursor: answered ? "default" : "pointer",
      transition: "all 0.15s ease-out",
      display: "flex", alignItems: "center", gap: 10,
    };

    if (!answered) return base;

    if (i === lesson.correctIndex) {
      return { ...base, background: "#D8F3DC", border: "1.5px solid #52b069", color: "#1d6432" };
    }
    if (i === selected) {
      return { ...base, background: "#FFF3E0", border: "1.5px solid #e08c3a", color: "#8a4a00", animation: "shake-wrong 0.2s ease-out" };
    }
    return { ...base, opacity: 0.45 };
  };

  const getIndicator = (i) => {
    if (!answered) return null;
    if (i === lesson.correctIndex) return <span style={{ fontSize: 16, flexShrink: 0 }}>✓</span>;
    if (i === selected) return <span style={{ fontSize: 16, flexShrink: 0 }}>✗</span>;
    return null;
  };

  return (
    <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Question */}
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700,
        color: "var(--text-primary)", lineHeight: 1.4,
      }}>
        {L(lesson, "question", lang)}
      </div>

      {/* Options */}
      <div role="group" aria-label="Choix de réponse" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {(L(lesson, "options", lang) || []).map((opt, i) => (
          <button
            key={i}
            style={getOptionStyle(i)}
            onClick={() => handleSelect(i)}
            aria-pressed={answered ? i === lesson.correctIndex : undefined}
            aria-disabled={answered}
          >
            {getIndicator(i)}
            <span>{opt}</span>
          </button>
        ))}
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
              ? (lang === "en" ? "Correct!" : "Bonne réponse !")
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

      {/* Next button */}
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
