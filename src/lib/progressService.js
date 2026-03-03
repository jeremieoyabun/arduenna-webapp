import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

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
