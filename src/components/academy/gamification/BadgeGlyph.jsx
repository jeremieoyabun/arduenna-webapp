/**
 * Shared badge glyph renderer — used in BadgesRow, BadgeGrid, BadgeUnlockModal.
 * Uses asset images where available, inline SVG fallbacks for the rest.
 */
export const BadgeGlyph = ({ id, size = 36 }) => {
  const ASSET = {
    "first-lesson":    "/icons/First-lesson.svg",
    "master-botanist": "/icons/master-botanist-badge-glyph.svg",
    "cocktail-expert": "/icons/cocktail-expert-badge-glyph.svg",
    "speed-learner":   "/icons/speed-learner-badge-glyph.webp",
    "perfect-score":   "/icons/perfect-score-badge-glyph.svg",
    "streak-7":        "/icons/streak-7-badge-glyph.svg",
  };

  if (ASSET[id]) {
    return (
      <img
        src={ASSET[id]}
        alt=""
        width={size}
        height={size}
        style={{ objectFit: "contain", display: "block" }}
      />
    );
  }

  const FALLBACK = {
    "streak-30": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C12 2 8 9 11 13c0-4 3-6 3-6s2 4-2 7c3-2 5-1 5-1s2 6-5 9c-4 2-9 1-9-5 0-3 2.5-4.5 2.5-4.5S8 15.5 9 15.5c0-4 2-7-1-11 1.5 0 4 0 4-2.5z" />
      </svg>
    ),
    "all-parcours": (
      <svg width={size} height={size - 2} viewBox="0 0 24 20" fill="currentColor">
        <path d="M12 0l3 6h7l-5.5 4 2 6.5L12 13l-6.5 3.5 2-6.5L2 6h7z" />
      </svg>
    ),
    "sales-champion": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22M18 2H6v7a6 6 0 0012 0V2z" />
      </svg>
    ),
    "mixology-master": (
      <svg width={size - 2} height={size} viewBox="0 0 14 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 1h6M5 5l-4 8h12L9 5H5zM7 13v6M4 19h6" />
      </svg>
    ),
  };

  return FALLBACK[id] || <span style={{ fontSize: size - 4, lineHeight: 1 }}>✦</span>;
};

/** Inline SVG padlock — adapts to currentColor, always visible in dark + light mode */
export const PadlockSVG = ({ size = 14 }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
