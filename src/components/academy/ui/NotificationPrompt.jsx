import { useState } from "react";
import { requestNotificationPermission, getPermissionStatus } from "../../../lib/notificationService";

/**
 * Custom notification permission prompt shown once after first login.
 * Replaces the ugly browser default by explaining the value first.
 *
 * Props:
 *   onDone(granted: boolean) — called after user accepts or declines
 */
export const NotificationPrompt = ({ onDone }) => {
  const [loading, setLoading] = useState(false);

  const handleEnable = async () => {
    setLoading(true);
    const granted = await requestNotificationPermission();
    setLoading(false);
    onDone(granted);
  };

  const handleDecline = () => onDone(false);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Activer les notifications"
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(11,54,61,0.55)",
        display: "flex", alignItems: "flex-end",
        backdropFilter: "blur(4px)",
      }}
    >
      <div style={{
        width: "100%", maxWidth: 480, margin: "0 auto",
        background: "var(--bg-primary)",
        borderRadius: "20px 20px 0 0",
        padding: "28px 24px 40px",
        boxShadow: "0 -4px 32px rgba(11,54,61,0.15)",
      }}>
        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: 16, fontSize: 36 }}>🔔</div>

        {/* Title */}
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 22, fontStyle: "italic", fontWeight: 600,
          color: "var(--text-primary)", textAlign: "center", marginBottom: 10,
        }}>
          Restez dans la course
        </div>

        {/* Body */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          color: "var(--text-secondary)", lineHeight: 1.6,
          textAlign: "center", marginBottom: 24,
        }}>
          Activez les notifications pour ne jamais rater votre streak quotidien ni les nouveaux modules Arduenna.
        </div>

        {/* Feature list */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 10,
          marginBottom: 28,
        }}>
          {[
            { icon: "🔥", text: "Rappel quotidien si votre streak est en danger" },
            { icon: "📚", text: "Alerte quand un nouveau module est disponible" },
            { icon: "🏆", text: "Motivations si vos collègues vous dépassent" },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              padding: "10px 14px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-light)",
              borderRadius: 10,
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                color: "var(--text-primary)",
              }}>
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleEnable}
          disabled={loading}
          aria-label="Activer les notifications"
          style={{
            width: "100%", padding: "15px",
            background: "#0b363d", color: "#fef8ec",
            border: "none", borderRadius: 12,
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            marginBottom: 10,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "En cours..." : "Activer les notifications"}
        </button>

        <button
          onClick={handleDecline}
          aria-label="Non merci"
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
