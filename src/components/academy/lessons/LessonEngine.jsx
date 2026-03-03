import { useEffect, useState } from "react";
import { useAuth } from "../../../components/auth/AuthProvider";
import { useLessonState } from "../../../hooks/useLessonState";
import { lessonsData } from "../../../data/academy/lessons";
import { modulesData } from "../../../data/academy/modules";
import { saveModuleProgress } from "../../../lib/progressService";
import { LessonProgress } from "./LessonProgress";
import { SwipeCards } from "./SwipeCards";
import { MultipleChoiceQuiz } from "./MultipleChoiceQuiz";
import { TrueFalse } from "./TrueFalse";
import { LessonComplete } from "./LessonComplete";

/**
 * Orchestrates a full module: renders lesson steps by type, saves progress on completion.
 */
export const LessonEngine = ({ moduleId, parcoursId, onComplete, onExit }) => {
  const { user } = useAuth();
  const lessons = lessonsData[moduleId] || [];
  const {
    currentIndex, currentLesson, answersMap, phase,
    totalSteps, next, recordAnswer, getAvgScore,
  } = useLessonState(lessons);

  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null); // { xpGain, avgScore }

  // Save to Firestore when all steps are done
  useEffect(() => {
    if (phase !== "complete" || saving || result) return;
    if (!user) { onComplete?.(); return; }

    setSaving(true);
    const parcoursModuleIds = modulesData
      .filter(m => m.parcoursId === parcoursId)
      .map(m => m.id);

    saveModuleProgress(user.uid, parcoursId, moduleId, answersMap, parcoursModuleIds)
      .then(({ xpGain, avgScore }) => {
        setResult({ xpGain, avgScore });
      })
      .catch(err => {
        console.warn("saveModuleProgress error:", err);
        setResult({ xpGain: 50, avgScore: getAvgScore() });
      })
      .finally(() => setSaving(false));
  }, [phase]);

  // Complete screen
  if (phase === "complete") {
    if (saving || !result) {
      return (
        <div style={{
          minHeight: "100vh", background: "var(--bg-primary)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: "var(--accent-secondary)", fontStyle: "italic" }}>
            Sauvegarde...
          </div>
        </div>
      );
    }

    return (
      <LessonComplete
        score={result.avgScore}
        xpGain={result.xpGain}
        onContinue={onComplete}
      />
    );
  }

  if (!currentLesson) return null;

  const handleNext = (score) => {
    if (currentLesson.type !== "swipe") {
      recordAnswer(currentIndex, score);
    } else {
      recordAnswer(currentIndex, null); // swipe: unscored
    }
    next();
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <LessonProgress
        current={currentIndex}
        total={totalSteps}
        onExit={onExit}
      />

      {currentLesson.type === "swipe" && (
        <SwipeCards lesson={currentLesson} onNext={handleNext} />
      )}
      {currentLesson.type === "mcq" && (
        <MultipleChoiceQuiz
          key={currentIndex}
          lesson={currentLesson}
          stepIndex={currentIndex}
          onNext={handleNext}
        />
      )}
      {currentLesson.type === "truefalse" && (
        <TrueFalse
          key={currentIndex}
          lesson={currentLesson}
          onNext={handleNext}
        />
      )}
    </div>
  );
};
