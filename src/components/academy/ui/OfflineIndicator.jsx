import { useEffect, useState } from "react";
import { getQueueCount, syncOfflineQueue, isOnline } from "../../../lib/offlineService";

/**
 * Sticky banner that appears when:
 *  - The user is offline (shows "Hors ligne" message)
 *  - Items are queued for sync (shows pending count)
 *  - Sync is in progress (shows syncing feedback)
 *  - Sync just completed (shows confirmation for 3s then hides)
 *
 * Mount this once inside AcademyPage.
 */
export const OfflineIndicator = () => {
  const [online, setOnline] = useState(isOnline());
  const [queueCount, setQueueCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [justSynced, setJustSynced] = useState(0); // number synced

  const refreshQueue = async () => {
    const count = await getQueueCount();
    setQueueCount(count);
  };

  useEffect(() => {
    // Initial queue count
    refreshQueue();

    const goOnline = async () => {
      setOnline(true);
      const before = await getQueueCount();
      if (before > 0) {
        setSyncing(true);
        const synced = await syncOfflineQueue();
        setSyncing(false);
        if (synced > 0) {
          setJustSynced(synced);
          await refreshQueue();
          setTimeout(() => setJustSynced(0), 3000);
        }
      }
    };

    const goOffline = async () => {
      setOnline(false);
      await refreshQueue();
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Don't show anything if online, nothing queued, nothing just synced
  if (online && queueCount === 0 && justSynced === 0) return null;

  const bgColor = online
    ? justSynced > 0 ? "rgba(58,122,107,0.92)" : "rgba(11,54,61,0.92)"
    : "rgba(194,116,74,0.92)";

  let message;
  if (!online) {
    message = queueCount > 0
      ? `📵 Hors ligne · ${queueCount} action${queueCount > 1 ? "s" : ""} en attente`
      : "📵 Hors ligne · Les données seront synchronisées à la reconnexion";
  } else if (syncing) {
    message = "⟳ Synchronisation en cours...";
  } else if (justSynced > 0) {
    message = `✓ ${justSynced} progression${justSynced > 1 ? "s" : ""} synchronisée${justSynced > 1 ? "s" : ""}`;
  } else {
    message = `${queueCount} action${queueCount > 1 ? "s" : ""} en attente de synchronisation`;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        padding: "10px 16px",
        background: bgColor,
        color: "#fef8ec",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        zIndex: 10000,
        backdropFilter: "blur(8px)",
        transition: "background 0.3s ease-out",
        textAlign: "center",
      }}
    >
      {message}
    </div>
  );
};
