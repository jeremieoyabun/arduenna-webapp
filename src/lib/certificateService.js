/**
 * Certificate generator — canvas-based PNG export.
 * Matches Arduenna brand: cream bg, teal border, Cormorant Garamond italic.
 */

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Generate a certificate canvas.
 * Returns the canvas element (call canvasToDataURL or downloadAsPNG on it).
 *
 * @param {object} opts
 * @param {string} opts.parcoursTitle - e.g. "Ambassadeur Arduenna"
 * @param {string} opts.userName
 * @param {string} opts.dateStr - e.g. "3 mars 2026"
 * @param {string} opts.color - hex accent color for this parcours
 */
export async function generateCertificateCanvas({ parcoursTitle, userName, dateStr, color = "#0b363d" }) {
  // Preload web fonts (already loaded in the app)
  if (typeof document !== "undefined" && document.fonts) {
    await Promise.allSettled([
      document.fonts.load('italic 52px "Cormorant Garamond"'),
      document.fonts.load('400 15px "DM Sans"'),
    ]);
  }

  const W = 900;
  const H = 636;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // ── Background ──────────────────────────────────────────────────────────────
  ctx.fillStyle = "#fef8ec";
  ctx.fillRect(0, 0, W, H);

  // ── Outer border ────────────────────────────────────────────────────────────
  ctx.strokeStyle = "#0b363d";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(22, 22, W - 44, H - 44);

  // ── Inner border ────────────────────────────────────────────────────────────
  ctx.strokeStyle = "rgba(11,54,61,0.12)";
  ctx.lineWidth = 1;
  ctx.strokeRect(34, 34, W - 68, H - 68);

  // ── Corner accents (teal L-shapes) ──────────────────────────────────────────
  const corners = [[42, 42, 1, 1], [W - 42, 42, -1, 1], [42, H - 42, 1, -1], [W - 42, H - 42, -1, -1]];
  corners.forEach(([cx, cy, sx, sy]) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 28 * sy);
    ctx.lineTo(0, 0);
    ctx.lineTo(28 * sx, 0);
    ctx.stroke();
    ctx.restore();
  });

  // ── Logo ────────────────────────────────────────────────────────────────────
  try {
    const logo = await loadImage("/Arduennagin_logo_vert_.webp");
    const logoH = 54;
    const logoW = logo.width * (logoH / logo.height);
    ctx.drawImage(logo, (W - logoW) / 2, 68, logoW, logoH);
  } catch {
    ctx.fillStyle = "#0b363d";
    ctx.font = '600 18px "DM Sans", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("ARDUENNA", W / 2, 108);
  }

  // ── Certificate label ───────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(11,54,61,0.36)";
  ctx.font = '500 11px "DM Sans", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("C E R T I F I C A T   D ' E X C E L L E N C E", W / 2, 168);

  // ── Divider ─────────────────────────────────────────────────────────────────
  ctx.strokeStyle = color + "2a";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 140, 181);
  ctx.lineTo(W / 2 + 140, 181);
  ctx.stroke();

  // ── User name ───────────────────────────────────────────────────────────────
  ctx.fillStyle = "#0b363d";
  ctx.font = 'italic 52px "Cormorant Garamond", Georgia, serif';
  ctx.textAlign = "center";
  ctx.fillText(userName, W / 2, 262);

  // ── Subtitle ────────────────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(11,54,61,0.52)";
  ctx.font = '400 15px "DM Sans", sans-serif';
  ctx.fillText("a complété avec succès le parcours", W / 2, 299);

  // ── Parcours name ───────────────────────────────────────────────────────────
  ctx.fillStyle = color;
  ctx.font = 'italic 36px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(parcoursTitle, W / 2, 353);

  // ── Divider ─────────────────────────────────────────────────────────────────
  ctx.strokeStyle = color + "2a";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 140, 370);
  ctx.lineTo(W / 2 + 140, 370);
  ctx.stroke();

  // ── Date ────────────────────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(11,54,61,0.36)";
  ctx.font = '400 13px "DM Sans", sans-serif';
  ctx.fillText(dateStr, W / 2, 408);

  // ── Circular seal (bottom right) ────────────────────────────────────────────
  const sealX = 750;
  const sealY = 480;
  const sealR = 54;

  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
  ctx.fillStyle = color + "12";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
  ctx.strokeStyle = color + "40";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR - 9, 0, Math.PI * 2);
  ctx.strokeStyle = color + "22";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = color + "88";
  ctx.font = '600 10px "DM Sans", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("ARDUENNA", sealX, sealY - 6);
  ctx.fillText("ACADEMY", sealX, sealY + 7);

  // ── Footer tagline ──────────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(11,54,61,0.20)";
  ctx.font = 'italic 13px "Cormorant Garamond", Georgia, serif';
  ctx.textAlign = "center";
  ctx.fillText("Formation Professionnelle · Arduenna Academy · arduenna-gin.com", W / 2, 572);

  return canvas;
}

/**
 * Trigger PNG download from a canvas element.
 */
export function downloadAsPNG(canvas, filename = "certificat-arduenna.png") {
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }, "image/png");
}

/**
 * Get a data URL from a canvas element (for preview img src).
 */
export function canvasToDataURL(canvas) {
  return canvas.toDataURL("image/png");
}
