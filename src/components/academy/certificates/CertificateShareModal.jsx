import { useEffect, useState } from "react";
import { generateCertificateCanvas, downloadAsPNG, canvasToDataURL } from "../../../lib/certificateService";
import { IconX, IconDownload, IconShare } from "../../ui/Icons";

/**
 * Full-screen modal showing certificate preview + download/share actions.
 */
export const CertificateShareModal = ({ parcoursTitle, userName, dateStr, color, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [generating, setGenerating] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateCertificateCanvas({ parcoursTitle, userName, dateStr, color })
      .then(c => {
        setCanvas(c);
        setPreviewUrl(canvasToDataURL(c));
      })
      .finally(() => setGenerating(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownload = () => {
    if (!canvas) return;
    const slug = parcoursTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    downloadAsPNG(canvas, `certificat-arduenna-${slug}.png`);
  };

  const handleShare = async () => {
    if (navigator.share && previewUrl) {
      try {
        const res = await fetch(previewUrl);
        const blob = await res.blob();
        const file = new File([blob], "certificat-arduenna.png", { type: "image/png" });
        await navigator.share({
          files: [file],
          title: `Certificat ${parcoursTitle}`,
          text: `J'ai obtenu ma certification "${parcoursTitle}" sur Arduenna Academy !`,
        });
        return;
      } catch { /* fall through */ }
    }
    // Fallback: copy text to clipboard
    const text = `Je viens d'obtenir ma certification "${parcoursTitle}" sur Arduenna Academy ! 🌿 #Arduenna #FormationPro #GinBelge`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* ignore */ }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(8,31,35,0.88)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          borderRadius: 16,
          width: "min(600px, 100%)",
          padding: "24px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 20,
        }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 20, fontWeight: 400, fontStyle: "italic",
            color: "var(--text-primary)", margin: 0,
          }}>
            Mon Certificat
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", padding: 4,
              display: "flex", alignItems: "center",
            }}
            aria-label="Fermer"
          >
            <IconX />
          </button>
        </div>

        {/* Certificate preview */}
        <div style={{
          background: "var(--bg-primary)",
          borderRadius: 10,
          overflow: "hidden",
          marginBottom: 20,
          minHeight: 160,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {generating ? (
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 16, fontStyle: "italic", color: "var(--accent-secondary)",
              padding: "40px 0",
            }}>
              Génération du certificat...
            </div>
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt={`Certificat ${parcoursTitle}`}
              style={{ width: "100%", display: "block", borderRadius: 8 }}
            />
          ) : null}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleDownload}
            disabled={!canvas}
            style={{
              flex: 1,
              padding: "13px 16px",
              background: canvas ? "#0b363d" : "var(--border-light)",
              color: canvas ? "#fef8ec" : "var(--text-muted)",
              border: "none", borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
              cursor: canvas ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              transition: "opacity 0.2s",
            }}
          >
            <IconDownload />
            Télécharger PNG
          </button>
          <button
            onClick={handleShare}
            disabled={!previewUrl}
            style={{
              flex: 1,
              padding: "13px 16px",
              background: "rgba(194,116,74,0.1)",
              color: "var(--accent-secondary)",
              border: "1px solid rgba(194,116,74,0.25)",
              borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
              cursor: previewUrl ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              opacity: previewUrl ? 1 : 0.5,
              transition: "opacity 0.2s",
            }}
          >
            <IconShare />
            {copied ? "Copié !" : "Partager"}
          </button>
        </div>
      </div>
    </div>
  );
};
