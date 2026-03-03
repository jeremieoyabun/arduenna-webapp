import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { updateLeaderboardEntry } from "./gamificationService";

const COLLECTION = "progress";

/**
 * Get full progress document for a user.
 */
export async function getProgress(uid) {
  if (!db) return null;
  const ref = doc(db, COLLECTION, uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

/**
 * Initialize an empty progress document for a new user.
 */
export async function initProgress(uid) {
  if (!db) return;
  const ref = doc(db, COLLECTION, uid);
  const existing = await getDoc(ref);
  if (existing.exists()) return;

  await setDoc(ref, {
    xp: 0,
    streak: { current: 0, lastDate: null, best: 0 },
    badges: [],
    parcours: {},
  });
}

/**
 * Mark a lesson as completed within a module.
 * Returns the updated lesson data.
 */
export async function completeLesson(uid, parcoursId, moduleId, lessonIndex, score) {
  if (!db) return;
  const ref = doc(db, COLLECTION, uid);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : { xp: 0, streak: { current: 0, lastDate: null, best: 0 }, badges: [], parcours: {} };

  // Ensure parcours and module structures exist
  if (!data.parcours[parcoursId]) {
    data.parcours[parcoursId] = { started: true, completedAt: null, modules: {} };
  }
  if (!data.parcours[parcoursId].modules[moduleId]) {
    data.parcours[parcoursId].modules[moduleId] = { started: true, completedAt: null, score: null, startedAt: Date.now(), lessons: {} };
  }

  const module = data.parcours[parcoursId].modules[moduleId];
  const prevAttempts = module.lessons[lessonIndex]?.attempts || 0;

  module.lessons[lessonIndex] = {
    completed: true,
    score: score ?? null,
    attempts: prevAttempts + 1,
  };

  await setDoc(ref, data);
  return data;
}

/**
 * Mark a module as completed. Calculates average score.
 */
export async function completeModule(uid, parcoursId, moduleId, totalLessons) {
  if (!db) return;
  const ref = doc(db, COLLECTION, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const module = data.parcours?.[parcoursId]?.modules?.[moduleId];
  if (!module) return;

  // Calculate average score from lessons
  const lessons = module.lessons || {};
  const scores = Object.values(lessons).filter(l => l.score != null).map(l => l.score);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  module.completedAt = Date.now();
  module.score = avgScore;

  // Check if all modules in parcours are complete
  const parcours = data.parcours[parcoursId];
  const moduleIds = Object.keys(parcours.modules);
  const allComplete = moduleIds.length >= totalLessons && moduleIds.every(id => parcours.modules[id].completedAt);
  if (allComplete) {
    parcours.completedAt = Date.now();
  }

  await setDoc(ref, data);
  return data;
}

/**
 * Save all lesson answers + mark module complete + update XP + streak in one write.
 * answersMap: { [stepIndex]: { score: number | null } }
 * parcoursModuleIds: all module IDs in the parcours (for parcours completion check)
 * Returns { xpGain, avgScore }
 */
export async function saveModuleProgress(uid, parcoursId, moduleId, answersMap, parcoursModuleIds) {
  if (!db) return { xpGain: 0, avgScore: null };
  const ref = doc(db, COLLECTION, uid);
  const snap = await getDoc(ref);
  const data = snap.exists()
    ? snap.data()
    : { xp: 0, streak: { current: 0, lastDate: null, best: 0 }, badges: [], parcours: {} };

  if (!data.parcours[parcoursId]) {
    data.parcours[parcoursId] = { started: true, completedAt: null, modules: {} };
  }
  if (!data.parcours[parcoursId].modules[moduleId]) {
    data.parcours[parcoursId].modules[moduleId] = {
      started: true, completedAt: null, score: null, startedAt: Date.now(), lessons: {},
    };
  }

  const mod = data.parcours[parcoursId].modules[moduleId];

  // Persist each step answer
  Object.entries(answersMap).forEach(([idx, answer]) => {
    const prev = mod.lessons[idx]?.attempts || 0;
    mod.lessons[idx] = { completed: true, score: answer.score ?? null, attempts: prev + 1 };
  });

  // Average score from scored steps only
  const scores = Object.values(mod.lessons).filter(l => l.score != null).map(l => l.score);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  mod.completedAt = Date.now();
  mod.score = avgScore;

  // XP: +50 module, +25 bonus if perfect
  const xpGain = 50 + (avgScore === 100 ? 25 : 0);
  data.xp = (data.xp || 0) + xpGain;

  // Check parcours completion
  if (parcoursModuleIds?.length > 0) {
    const allDone = parcoursModuleIds.every(id => data.parcours[parcoursId]?.modules?.[id]?.completedAt);
    if (allDone) data.parcours[parcoursId].completedAt = Date.now();
  }

  // Streak update (once per day)
  const today = new Date().toISOString().split("T")[0];
  const lastDate = data.streak?.lastDate;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (lastDate !== today) {
    data.streak.current = lastDate === yesterday ? (data.streak.current || 0) + 1 : 1;
    data.streak.lastDate = today;
    data.streak.best = Math.max(data.streak.best || 0, data.streak.current);
  }

  await setDoc(ref, data);
  await updateLeaderboardEntry(uid, data.xp);
  return { xpGain, avgScore, progressData: data };
}

/**
 * Get completion status for all modules of a parcours.
 */
export function getParcoursProgress(progressData, parcoursId) {
  if (!progressData?.parcours?.[parcoursId]) {
    return { started: false, modules: {} };
  }
  return progressData.parcours[parcoursId];
}

/**
 * Check if a specific module is unlocked based on the previous module's completion.
 */
export function isModuleUnlocked(progressData, parcoursId, moduleOrder, modulesInParcours) {
  if (moduleOrder === 0) return true; // First module always unlocked

  // Find the module with order - 1
  const prevModule = modulesInParcours.find(m => m.order === moduleOrder - 1);
  if (!prevModule) return false;

  const parcoursProgress = progressData?.parcours?.[parcoursId];
  if (!parcoursProgress) return false;

  return !!parcoursProgress.modules?.[prevModule.id]?.completedAt;
}
