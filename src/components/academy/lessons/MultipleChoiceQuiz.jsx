import { useState } from "react";

/**
 * MCQ lesson format. 4 options, immediate color feedback, explanation, then "Suivant".
 */
export const MultipleChoiceQuiz = ({ lesson, stepIndex, onNext }) => {
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
      borderRadius: 10, border: "1.5px solid rgba(11,54,61,0.12)",
      background: "#ffffff", textAlign: "left",
      fontFamily: "'DM Sans', sans-serif", fontSize: 14,
      color: "#0b363d", cursor: answered ? "default" : "pointer",
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
        color: "#0b363d", lineHeight: 1.4,
      }}>
        {lesson.questionFr}
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {lesson.optionsFr.map((opt, i) => (
          <button key={i} style={getOptionStyle(i)} onClick={() => handleSelect(i)}>
            {getIndicator(i)}
            <span>{opt}</span>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {answered && (
        <div style={{
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
            {isCorrect ? "Bonne réponse !" : "Pas tout à fait..."}
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.55,
            color: "rgba(11,54,61,0.75)", margin: 0,
          }}>
            {lesson.explanationFr}
          </p>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button
          onClick={handleNext}
          style={{
            padding: "14px 24px", background: "#0b363d", color: "#fef8ec",
            border: "none", borderRadius: 10,
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Suivant →
        </button>
      )}
    </div>
  );
};
