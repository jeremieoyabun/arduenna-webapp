/**
 * Offline service — queues Firestore writes when offline and syncs when online.
 *
 * Usage:
 *  - Call `saveProgressOfflineSafe(...)` instead of `saveModuleProgress` to get
 *    automatic offline queuing.
 *  - Call `setupOnlineListener(cb)` once (in App or AcademyPage) to auto-sync.
 *  - Mount <OfflineIndicator /> to show banner when offline or syncing.
 */

import { queueWrite, getQueue, clearQueueItem, getQueueCount } from "./offlineStorage";
import { saveModuleProgress } from "./progressService";

export { getQueueCount };

/**
 * Returns true if the browser reports an active network connection.
 */
export function isOnline() {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}

/**
 * Save module progress, queuing the write if currently offline.
 * Falls back to a local XP estimate so the UX doesn't block.
 *
 * Returns { xpGain, avgScore, progressData, queued }
 */
export async function saveProgressOfflineSafe(uid, parcoursId, moduleId, answersMap, parcoursModuleIds) {
  if (isOnline()) {
    try {
      const result = await saveModuleProgress(uid, parcoursId, moduleId, answersMap, parcoursModuleIds);
      return { ...result, queued: false };
    } catch (e) {
      // Network error despite navigator.onLine — queue it
      console.warn("saveModuleProgress network error, queuing:", e.message);
    }
  }

  // Offline — queue the write and return an optimistic estimate
  await queueWrite({ uid, parcoursId, moduleId, answersMap, parcoursModuleIds });

  // Optimistic score calculation (no Firestore)
  const scores = Object.values(answersMap)
    .filter(a => a.score != null)
    .map(a => a.score);
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;
  const xpGain = 50 + (avgScore === 100 ? 25 : 0);

  return { xpGain, avgScore, progressData: null, queued: true };
}

/**
 * Attempt to flush all queued writes to Firestore.
 * Returns the number of items successfully synced.
 */
export async function syncOfflineQueue() {
  if (!isOnline()) return 0;

  let synced = 0;
  try {
    const queue = await getQueue();
    for (const item of queue) {
      try {
        await saveModuleProgress(
          item.uid, item.parcoursId, item.moduleId,
          item.answersMap, item.parcoursModuleIds
        );
        await clearQueueItem(item.id);
        synced++;
      } catch (e) {
        console.warn("Sync failed for queued item:", e.message);
        break; // Don't skip — keep order, retry on next sync
      }
    }
  } catch (e) {
    console.warn("syncOfflineQueue error:", e.message);
  }

  return synced;
}

/**
 * Register a window "online" event listener that auto-syncs the queue.
 * Returns a cleanup function to remove the listener.
 *
 * @param {(syncedCount: number) => void} onSync - called after successful sync
 */
export function setupOnlineListener(onSync) {
  const handler = async () => {
    const count = await syncOfflineQueue();
    if (count > 0 && typeof onSync === "function") {
      onSync(count);
    }
  };

  window.addEventListener("online", handler);
  return () => window.removeEventListener("online", handler);
}
