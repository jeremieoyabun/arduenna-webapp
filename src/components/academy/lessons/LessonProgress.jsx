/**
 * Fixed top bar showing step progress: dots + count + thin fill bar.
 */
export const LessonProgress = ({ current, total, onExit }) => {
  const percent = total > 0 ? Math.round(((current) / total) * 100) : 0;

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 200,
      background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border-light)",
      padding: "12px 16px 0",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        {/* Exit button */}
        {onExit && (
          <button
            onClick={onExit}
            aria-label="Quitter la leçon"
            style={{
              background: "var(--bg-muted)", border: "1px solid var(--border-light)",
              borderRadius: 10, padding: 0,
              cursor: "pointer", color: "var(--text-secondary)", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 40, height: 40,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {/* Dots */}
        <div style={{
          flex: 1, display: "flex", gap: 4, alignItems: "center", flexWrap: "nowrap", overflow: "hidden",
        }}>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1, height: 4, borderRadius: 999,
                background: i < current
                  ? "var(--accent-secondary)"
                  : i === current
                    ? "rgba(194,116,74,0.4)"
                    : "var(--border-subtle)",
                transition: "background 0.2s ease-out",
              }}
            />
          ))}
        </div>

        {/* Count */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12,
          color: "var(--text-tertiary)", flexShrink: 0,
        }}>
          {current + 1}/{total}
        </div>
      </div>
    </div>
  );
};
