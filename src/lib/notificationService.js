/**
 * Local push notifications — no FCM, no server.
 * Uses Notification API + service worker showNotification.
 *
 * Strategy:
 * - requestPermission: show custom prompt first, then native
 * - Streak danger: at app open, if no activity today + streak > 0, schedule for 20h mark
 * - Inactivity: 3+ days without login → show immediately on app open
 * - New module: call explicitly when new content is detected
 *
 * Scheduled notification IDs are kept in localStorage to avoid duplicates.
 */

const STORE_KEY = "arduenna_notif_scheduled";

// ── Permission ─────────────────────────────────────────────────────────────

export function notificationsSupported() {
  return "Notification" in window;
}

export function getPermissionStatus() {
  if (!notificationsSupported()) return "denied";
  return Notification.permission; // "default" | "granted" | "denied"
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

// ── Show notification ──────────────────────────────────────────────────────

function showNotification(title, body, tag, icon = "/logo-192.png") {
  if (!notificationsSupported() || Notification.permission !== "granted") return;

  // Prefer SW notification (works when app is backgrounded)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then(reg => reg.showNotification(title, { body, icon, badge: "/logo-192.png", tag, vibrate: [200, 100, 200] }))
      .catch(() => new Notification(title, { body, icon, tag }));
  } else {
    new Notification(title, { body, icon, tag });
  }
}

// ── Scheduled timer store ──────────────────────────────────────────────────

function getScheduled() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); }
  catch { return {}; }
}

function setScheduled(obj) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(obj)); }
  catch { /* storage full — ignore */ }
}

function cancelScheduled(key) {
  const scheduled = getScheduled();
  if (scheduled[key]) {
    clearTimeout(scheduled[key].timerId);
    delete scheduled[key];
    setScheduled(scheduled);
  }
}

// ── Streak danger (20h mark) ───────────────────────────────────────────────

/**
 * Called at app open / login.
 * If streak > 0 and the user hasn't completed a lesson today,
 * schedules a notification at 20:00 local time (or in 1h if already past 19h).
 *
 * @param {number} streak - current streak count
 * @param {number|null} lastActivityMs - timestamp of last lesson completion
 */
export function scheduleStreakReminder(streak, lastActivityMs) {
  cancelScheduled("streak");
  if (!notificationsSupported() || Notification.permission !== "granted") return;
  if (!streak || streak === 0) return;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  // Already active today — no reminder needed
  if (lastActivityMs && lastActivityMs >= todayStart) return;

  // Target: 20:00 today
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0, 0);
  let msUntil = target.getTime() - Date.now();

  // If already past 20:00, schedule for 1 hour from now as fallback
  if (msUntil <= 0) msUntil = 60 * 60 * 1000;
  // Don't schedule if more than 24h away (edge case)
  if (msUntil > 24 * 60 * 60 * 1000) return;

  const timerId = setTimeout(() => {
    showNotification(
      "Arduenna Academy 🔥",
      `Votre streak de ${streak} jour${streak > 1 ? "s" : ""} est en danger ! Complétez une leçon maintenant.`,
      "streak-danger"
    );
    cancelScheduled("streak");
  }, msUntil);

  // Store so we can cancel on unmount or if user completes a lesson
  const scheduled = getScheduled();
  scheduled["streak"] = { timerId, scheduledAt: Date.now(), msUntil };
  setScheduled(scheduled);
}

export function cancelStreakReminder() {
  cancelScheduled("streak");
}

// ── Inactivity (3+ days) ───────────────────────────────────────────────────

/**
 * Call at app open. Shows notification immediately if 3+ days since last login.
 * Uses a flag to show at most once per session.
 *
 * @param {number|null} lastLoginMs - timestamp of last login
 */
export function checkInactivityNotification(lastLoginMs) {
  if (!notificationsSupported() || Notification.permission !== "granted") return;
  if (!lastLoginMs) return;

  const daysSince = (Date.now() - lastLoginMs) / (24 * 60 * 60 * 1000);
  if (daysSince < 3) return;

  // Only show once per session
  if (sessionStorage.getItem("arduenna_inactivity_shown")) return;
  sessionStorage.setItem("arduenna_inactivity_shown", "1");

  showNotification(
    "Arduenna Academy",
    "Vos collègues progressent ! Revenez compléter votre parcours.",
    "inactivity"
  );
}

// ── New module ─────────────────────────────────────────────────────────────

/**
 * Call when new content is detected (e.g., after a data update).
 * @param {string} moduleTitle
 */
export function showNewModuleNotification(moduleTitle) {
  showNotification(
    "Nouveau module disponible",
    `${moduleTitle} — Découvrez le maintenant dans vos parcours.`,
    "new-module"
  );
}
