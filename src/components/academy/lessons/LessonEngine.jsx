import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../components/auth/AuthProvider";
import { useLessonState } from "../../../hooks/useLessonState";
import { lessonsData } from "../../../data/academy/lessons";
import { modulesData } from "../../../data/academy/modules";
import { saveModuleProgress } from "../../../lib/progressService";
import { checkBadgeUnlocks } from "../../../lib/gamificationService";
import { LessonProgress } from "./LessonProgress";
import { SwipeCards } from "./SwipeCards";
import { MultipleChoiceQuiz } from "./MultipleChoiceQuiz";
import { TrueFalse } from "./TrueFalse";
import { LessonComplete } from "./LessonComplete";
import { BadgeUnlockModal } from "../gamification/BadgeUnlockModal";

/**
 * Orchestrates a full module: renders lesson steps by type, saves progress on completion,
 * checks badge unlocks, and shows BadgeUnlockModal for each new badge earned.
 */
export const LessonEngine = ({ moduleId, parcoursId, onComplete, onExit, lang = "fr" }) => {
  const { user } = useAuth();
  const lessons = lessonsData[moduleId] || [];
  const {
    currentIndex, currentLesson, answersMap, phase,
    totalSteps, next, recordAnswer, getAvgScore,
  } = useLessonState(lessons);

  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null); // { xpGain, avgScore }
  const [newBadges, setNewBadges] = useState([]); // queue of badge IDs to show
  const startTime = useRef(Date.now());

  // Save to Firestore when all steps are done
  useEffect(() => {
    if (phase !== "complete" || saving || result) return;
    if (!user) { onComplete?.(); return; }

    setSaving(true);
    const parcoursModuleIds = modulesData
      .filter(m => m.parcoursId === parcoursId)
      .map(m => m.id);

    saveModuleProgress(user.uid, parcoursId, moduleId, answersMap, parcoursModuleIds)
      .then(async ({ xpGain, avgScore, progressData }) => {
        setResult({ xpGain, avgScore });

        // Check badge unlocks with fresh progress data
        if (progressData) {
          const earned = await checkBadgeUnlocks(user.uid, progressData, {
            moduleScore: avgScore,
            moduleDurationMs: Date.now() - startTime.current,
          });
          if (earned.length > 0) setNewBadges(earned);
        }
      })
      .catch(err => {
        console.warn("saveModuleProgress error:", err);
        setResult({ xpGain: 50, avgScore: getAvgScore() });
      })
      .finally(() => setSaving(false));
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

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
      <>
        <LessonComplete
          score={result.avgScore}
          xpGain={result.xpGain}
          onContinue={onComplete}
        />
        {newBadges.length > 0 && (
          <BadgeUnlockModal
            badgeId={newBadges[0]}
            onDismiss={() => setNewBadges(prev => prev.slice(1))}
          />
        )}
      </>
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
        <SwipeCards lesson={currentLesson} onNext={handleNext} lang={lang} />
      )}
      {currentLesson.type === "mcq" && (
        <MultipleChoiceQuiz
          key={currentIndex}
          lesson={currentLesson}
          stepIndex={currentIndex}
          onNext={handleNext}
          lang={lang}
        />
      )}
      {currentLesson.type === "truefalse" && (
        <TrueFalse
          key={currentIndex}
          lesson={currentLesson}
          onNext={handleNext}
          lang={lang}
        />
      )}
    </div>
  );
};
