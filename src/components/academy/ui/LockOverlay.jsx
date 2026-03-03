export const LockOverlay = ({ message }) => (
  <div style={{
    position: "absolute", inset: 0, borderRadius: "inherit",
    background: "rgba(254,248,236,0.75)",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: 8, backdropFilter: "blur(2px)",
  }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
    {message && (
      <span style={{
        fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
        color: "var(--text-muted)", textAlign: "center", padding: "0 12px",
      }}>
        {message}
      </span>
    )}
  </div>
);
