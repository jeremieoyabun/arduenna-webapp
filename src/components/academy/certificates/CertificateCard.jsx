import { useState } from "react";
import { CertificateShareModal } from "./CertificateShareModal";

/**
 * Certificate card shown in the profile once a parcours is completed.
 *
 * Props:
 *   parcoursTitle (string) — e.g. "Ambassadeur Arduenna"
 *   completedAt   (number) — Unix timestamp ms
 *   userName      (string)
 *   color         (string) — hex parcours accent color
 */
export const CertificateCard = ({ parcoursTitle, completedAt, userName, color = "#0b363d" }) => {
  const [open, setOpen] = useState(false);

  const dateStr = new Date(completedAt).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && setOpen(true)}
        style={{
          background: "var(--bg-surface)",
          border: `1px solid ${color}30`,
          borderLeft: `3px solid ${color}`,
          borderRadius: 10,
          padding: "14px 16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          transition: "box-shadow 0.2s ease-out",
        }}
      >
        <div style={{ minWidth: 0 }}>
          {/* Medal emoji + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 18 }}>🎓</span>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 17, fontStyle: "italic",
              color: "var(--text-primary)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {parcoursTitle}
            </div>
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, color: "var(--text-tertiary)",
            paddingLeft: 26,
          }}>
            Obtenu le {dateStr}
          </div>
        </div>

        {/* CTA button */}
        <div style={{
          padding: "7px 14px",
          background: color + "15",
          border: `1px solid ${color}40`,
          borderRadius: 6,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, fontWeight: 600,
          color: color,
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>
          Voir →
        </div>
      </div>

      {open && (
        <CertificateShareModal
          parcoursTitle={parcoursTitle}
          userName={userName}
          dateStr={dateStr}
          color={color}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
