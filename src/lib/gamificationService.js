import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Add XP to a user's progress. Applies streak multiplier if applicable.
 */
export async function addXP(uid, amount) {
  if (!db) return 0;
  const ref = doc(db, "progress", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return 0;

  const data = snap.data();
  const multiplier = (data.streak?.current || 0) >= 7 ? 1.5 : 1;
  const earned = Math.round(amount * multiplier);

  data.xp = (data.xp || 0) + earned;
  await setDoc(ref, data);

  // Update leaderboard entry
  await updateLeaderboardEntry(uid, data.xp);

  return earned;
}

/**
 * Update streak on daily login.
 * Returns { current, increased, lost } status.
 */
export async function updateStreak(uid) {
  if (!db) return { current: 0, increased: false, lost: false };
  const ref = doc(db, "progress", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { current: 0, increased: false, lost: false };

  const data = snap.data();
  const streak = data.streak || { current: 0, lastDate: null, best: 0 };
  const today = new Date().toISOString().slice(0, 10);

  if (streak.lastDate === today) {
    // Already logged in today
    return { current: streak.current, increased: false, lost: false };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let increased = false;
  let lost = false;

  if (streak.lastDate === yesterday) {
    // Consecutive day
    streak.current += 1;
    increased = true;
  } else if (streak.lastDate && streak.lastDate < yesterday) {
    // Missed a day — reset
    lost = streak.current > 0;
    streak.current = 1;
  } else {
    // First ever login
    streak.current = 1;
    increased = true;
  }

  streak.lastDate = today;
  if (streak.current > streak.best) {
    streak.best = streak.current;
  }

  data.streak = streak;
  await setDoc(ref, data);

  return { current: streak.current, increased, lost };
}

/**
 * Check if any new badges should be awarded.
 * Returns array of newly earned badge IDs.
 */
export async function checkBadgeUnlocks(uid, progressData, context) {
  if (!db || !progressData) return [];

  const earned = (progressData.badges || []).map(b => b.id);
  const newBadges = [];

  const check = (id, condition) => {
    if (earned.includes(id)) return;
    if (condition) newBadges.push(id);
  };

  // Count total completed lessons
  let totalLessons = 0;
  let totalModules = 0;
  const completedParcours = [];

  for (const [pid, parcours] of Object.entries(progressData.parcours || {})) {
    if (parcours.completedAt) completedParcours.push(pid);
    for (const [, mod] of Object.entries(parcours.modules || {})) {
      if (mod.completedAt) totalModules++;
      for (const [, lesson] of Object.entries(mod.lessons || {})) {
        if (lesson.completed) totalLessons++;
      }
    }
  }

  check("first-lesson", totalLessons >= 1);
  check("master-botanist", completedParcours.includes("univers"));
  check("cocktail-expert", completedParcours.includes("cocktail"));
  check("all-parcours", completedParcours.length >= 4);

  // Score-based badges
  if (context?.moduleScore === 100) {
    check("perfect-score", true);
  }

  // Speed badge
  if (context?.moduleDurationMs && context.moduleDurationMs < 5 * 60 * 1000) {
    check("speed-learner", true);
  }

  // Streak badges
  const streak = progressData.streak?.current || 0;
  check("streak-7", streak >= 7);
  check("streak-30", streak >= 30);

  // Sales champion: vente parcours completed with 90%+
  const venteModules = Object.values(progressData.parcours?.vente?.modules || {});
  if (completedParcours.includes("vente")) {
    const venteScores = venteModules.filter(m => m.score != null).map(m => m.score);
    const avgVente = venteScores.length > 0 ? venteScores.reduce((a, b) => a + b, 0) / venteScores.length : 0;
    check("sales-champion", avgVente >= 90);
  }

  // Mixology master: cocktail-4 with 100%
  const cocktail4 = progressData.parcours?.cocktail?.modules?.["cocktail-4"];
  check("mixology-master", cocktail4?.score === 100);

  // Persist new badges
  if (newBadges.length > 0) {
    const ref = doc(db, "progress", uid);
    const badges = [...(progressData.badges || [])];
    for (const id of newBadges) {
      badges.push({ id, earnedAt: Date.now() });
    }
    progressData.badges = badges;
    await setDoc(ref, progressData);
  }

  return newBadges;
}

/**
 * Update leaderboard entry for a user.
 */
export async function updateLeaderboardEntry(uid, xp) {
  if (!db) return;
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.exists() ? userSnap.data() : {};

    const ref = doc(db, "leaderboard", uid);
    const existing = await getDoc(ref);
    const prev = existing.exists() ? existing.data() : {};

    // Check weekly reset
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekStartStr = weekStart.toISOString().slice(0, 10);

    let weeklyXp = prev.weeklyXp || 0;
    if (prev.weekStartDate !== weekStartStr) {
      weeklyXp = 0;
    }

    await setDoc(ref, {
      uid,
      displayName: userData.displayName || userData.firstName || "Anonyme",
      role: userData.role || "bartender",
      xp: xp || 0,
      weeklyXp,
      weekStartDate: weekStartStr,
    });
  } catch (e) {
    console.warn("Leaderboard update failed:", e.message);
  }
}

/**
 * Get leaderboard data.
 * Returns array sorted by XP descending.
 */
export async function getLeaderboard(limitCount = 50) {
  if (!db) return [];
  try {
    const ref = collection(db, "leaderboard");
    const q = query(ref, orderBy("xp", "desc"), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn("Leaderboard fetch failed:", e.message);
    return [];
  }
}
