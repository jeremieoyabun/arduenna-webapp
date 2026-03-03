import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Fetch all user profiles from users/{uid}.
 * Returns array of user objects.
 */
export async function getAllUsers() {
  if (!db) return [];
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}

/**
 * Fetch all progress documents from progress/{uid}.
 * Returns array of progress objects with uid attached.
 */
export async function getAllProgress() {
  if (!db) return [];
  const snap = await getDocs(collection(db, "progress"));
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}

/**
 * Join users + progress into a single enriched list.
 * Returns array of { user, progress } merged objects.
 */
export async function getEnrichedUsers() {
  const [users, allProgress] = await Promise.all([getAllUsers(), getAllProgress()]);
  const progressMap = Object.fromEntries(allProgress.map(p => [p.uid, p]));
  return users.map(u => ({
    ...u,
    progress: progressMap[u.uid] || null,
  }));
}

/**
 * Compute admin KPIs from enriched user data.
 */
export function computeKPIs(enrichedUsers) {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 3600 * 1000;

  const active = enrichedUsers.filter(u => u.lastLoginAt && u.lastLoginAt > sevenDaysAgo);

  // Completion rates per parcours
  const parcoursIds = ["univers", "gamme", "cocktail", "vente"];
  const parcoursStats = parcoursIds.map(pid => {
    const started = enrichedUsers.filter(u => u.progress?.parcours?.[pid]?.started).length;
    const completed = enrichedUsers.filter(u => !!u.progress?.parcours?.[pid]?.completedAt).length;
    return {
      id: pid,
      started,
      completed,
      rate: started > 0 ? Math.round((completed / started) * 100) : 0,
    };
  });

  // Average module score across all users and modules
  const allScores = [];
  enrichedUsers.forEach(u => {
    Object.values(u.progress?.parcours || {}).forEach(parcours => {
      Object.values(parcours.modules || {}).forEach(mod => {
        if (mod.score != null) allScores.push(mod.score);
      });
    });
  });
  const avgScore = allScores.length > 0
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    : null;

  // Average streak (active users only)
  const streaks = active.map(u => u.progress?.streak?.current || 0);
  const avgStreak = streaks.length > 0
    ? Math.round(streaks.reduce((a, b) => a + b, 0) / streaks.length * 10) / 10
    : 0;

  // Total XP distributed
  const totalXP = enrichedUsers.reduce((sum, u) => sum + (u.progress?.xp || 0), 0);

  return {
    totalUsers: enrichedUsers.length,
    activeUsers: active.length,
    avgScore,
    avgStreak,
    totalXP,
    parcoursStats,
  };
}

/**
 * Get users who haven't logged in for 7+ days (but have an account).
 */
export function getInactiveUsers(enrichedUsers) {
  const sevenDaysAgo = Date.now() - 7 * 24 * 3600 * 1000;
  return enrichedUsers
    .filter(u => u.lastLoginAt && u.lastLoginAt <= sevenDaysAgo)
    .sort((a, b) => a.lastLoginAt - b.lastLoginAt); // most inactive first
}

/**
 * Generate a CSV string from enriched user data.
 * Columns: Nom, Email, Rôle, XP, Streak, Parcours complétés, Score moyen, Dernier login, Badges
 */
export function generateCSV(enrichedUsers) {
  const PARCOURSNAMES = { univers: "L'Univers", gamme: "La Gamme", cocktail: "Cocktail Lab", vente: "Vendre" };

  const headers = [
    "Nom", "Email", "Rôle", "XP Total", "Streak",
    "Parcours complétés", "Score moyen (%)", "Dernier login", "Badges",
  ];

  const rows = enrichedUsers.map(u => {
    const prog = u.progress;

    // Count completed parcours
    const completedParcours = Object.entries(prog?.parcours || {})
      .filter(([, p]) => p.completedAt)
      .map(([id]) => PARCOURSNAMES[id] || id)
      .join(" | ");

    // Average score
    const scores = [];
    Object.values(prog?.parcours || {}).forEach(p => {
      Object.values(p.modules || {}).forEach(m => {
        if (m.score != null) scores.push(m.score);
      });
    });
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : "";

    const lastLogin = u.lastLoginAt
      ? new Date(u.lastLoginAt).toLocaleDateString("fr-FR")
      : "";

    const badges = (prog?.badges || []).length;

    return [
      u.displayName || u.firstName || "",
      u.email || "",
      u.role || "",
      prog?.xp || 0,
      prog?.streak?.current || 0,
      completedParcours || "",
      avgScore,
      lastLogin,
      badges,
    ];
  });

  const escape = v => {
    const str = String(v ?? "");
    return str.includes(",") || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const lines = [headers.map(escape).join(","), ...rows.map(r => r.map(escape).join(","))];
  return lines.join("\n");
}

/**
 * Trigger a CSV download in the browser.
 */
export function downloadCSV(csvString, filename = "arduenna-academy-export.csv") {
  const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
