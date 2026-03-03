import { useState } from "react";
import { requestNotificationPermission } from "../../../lib/notificationService";

export const NotificationPrompt = ({ onDone }) => {
  const [loading, setLoading] = useState(false);
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 640;

  const handleEnable = async () => {
    setLoading(true);
    const granted = await requestNotificationPermission();
    setLoading(false);
    onDone(granted);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Activer les notifications"
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(11,54,61,0.6)",
        display: "flex",
        alignItems: isDesktop ? "center" : "flex-end",
        justifyContent: "center",
        backdropFilter: "blur(6px)",
        padding: isDesktop ? "20px" : 0,
      }}
    >
      <div style={{
        width: "100%", maxWidth: 440,
        background: "var(--bg-primary)",
        borderRadius: isDesktop ? 20 : "20px 20px 0 0",
        padding: "32px 28px calc(32px + env(safe-area-inset-bottom, 0px))",
        boxShadow: isDesktop
          ? "0 20px 60px rgba(11,54,61,0.2)"
          : "0 -4px 32px rgba(11,54,61,0.15)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 16, fontSize: 40 }}>🔔</div>

        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 24, fontStyle: "italic", fontWeight: 600,
          color: "var(--text-primary)", textAlign: "center", marginBottom: 10,
        }}>
          Restez dans la course
        </div>

        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          color: "var(--text-secondary)", lineHeight: 1.65,
          textAlign: "center", marginBottom: 24,
        }}>
          Activez les notifications pour ne jamais rater votre streak quotidien ni les nouveaux modules Arduenna.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
          {[
            { icon: "🔥", text: "Rappel quotidien si votre streak est en danger" },
            { icon: "📚", text: "Alerte quand un nouveau module est disponible" },
            { icon: "🏆", text: "Motivations si vos collègues vous dépassent" },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-light)",
              borderRadius: 10,
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--text-primary)" }}>
                {text}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={handleEnable}
          disabled={loading}
          style={{
            width: "100%", padding: "15px",
            background: "#0b363d", color: "#fef8ec",
            border: "none", borderRadius: 12,
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            marginBottom: 10, opacity: loading ? 0.7 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {loading ? "En cours..." : "Activer les notifications"}
        </button>

        <button
          onClick={() => onDone(false)}
          style={{
            width: "100%", padding: "12px",
            background: "transparent", color: "var(--text-tertiary)",
            border: "none", borderRadius: 12,
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            cursor: "pointer",
          }}
        >
          Non merci
        </button>
      </div>
    </div>
  );
};
