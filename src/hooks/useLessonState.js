import { useState, useRef } from "react";

/**
 * Manages lesson engine state: current step, answers map, phase.
 * answersMap: { [stepIndex]: { score: number | null } }
 * score: 100 = correct, 0 = wrong, null = unscored (swipe)
 */
export function useLessonState(lessons) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({});
  const [phase, setPhase] = useState("active"); // "active" | "complete"
  const startedAt = useRef(Date.now());

  const currentLesson = lessons[currentIndex];
  const isLast = currentIndex === lessons.length - 1;

  function recordAnswer(index, score) {
    setAnswersMap(prev => ({ ...prev, [index]: { score } }));
  }

  function next() {
    if (isLast) {
      setPhase("complete");
    } else {
      setCurrentIndex(i => i + 1);
    }
  }

  function getAvgScore() {
    const scored = Object.values(answersMap).filter(a => a.score != null);
    if (scored.length === 0) return null;
    return Math.round(scored.reduce((sum, a) => sum + a.score, 0) / scored.length);
  }

  const elapsedSeconds = Math.round((Date.now() - startedAt.current) / 1000);

  return {
    currentIndex,
    currentLesson,
    answersMap,
    phase,
    isLast,
    totalSteps: lessons.length,
    next,
    recordAnswer,
    getAvgScore,
    elapsedSeconds,
  };
}
