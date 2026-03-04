import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../components/auth/AuthProvider";
import { getProgress, initProgress, isModuleUnlocked } from "../lib/progressService";
import { parcoursData } from "../data/academy/parcours";
import { modulesData } from "../data/academy/modules";
import { lessonsData } from "../data/academy/lessons";

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      await initProgress(user.uid);
      const data = await getProgress(user.uid);
      setProgress(data);
    } catch (e) {
      console.warn("useProgress load error:", e);
    }
    setLoading(false);
  }, [user?.uid]);

  useEffect(() => { load(); }, [load]);

  function getModulePercent(parcoursId, moduleId) {
    const modData = progress?.parcours?.[parcoursId]?.modules?.[moduleId];
    if (!modData) return 0;
    if (modData.completedAt) return 100;
    const lessons = modData.lessons || {};
    const total = lessonsData[moduleId]?.length || 1;
    const done = Object.values(lessons).filter(l => l.completed).length;
    return Math.round((done / total) * 100);
  }

  function isLocked(parcoursId, moduleOrder) {
    const modules = modulesData.filter(m => m.parcoursId === parcoursId);
    return !isModuleUnlocked(progress, parcoursId, moduleOrder, modules);
  }

  function isCompleted(parcoursId, moduleId) {
    return !!progress?.parcours?.[parcoursId]?.modules?.[moduleId]?.completedAt;
  }

  /** Returns next unlocked + not-completed module across all parcours in order. */
  function getNextModule() {
    for (const parcours of parcoursData) {
      const modules = modulesData
        .filter(m => m.parcoursId === parcours.id)
        .sort((a, b) => a.order - b.order);
      for (const m of modules) {
        if (!isLocked(parcours.id, m.order) && !isCompleted(parcours.id, m.id)) {
          return m;
        }
      }
    }
    return null; // all completed
  }

  /** Count completed modules in a parcours. */
  function getParcoursCompletedCount(parcoursId) {
    const modules = modulesData.filter(m => m.parcoursId === parcoursId);
    return modules.filter(m => isCompleted(parcoursId, m.id)).length;
  }

  const xp = progress?.xp || 0;
  const streak = progress?.streak?.current || 0;

  return {
    progress,
    loading,
    refreshProgress: load,
    getModulePercent,
    isLocked,
    isCompleted,
    getNextModule,
    getParcoursCompletedCount,
    xp,
    streak,
  };
}
