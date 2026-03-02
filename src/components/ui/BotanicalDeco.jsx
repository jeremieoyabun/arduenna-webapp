export const BotanicalDeco = ({ style }) => (
  <svg viewBox="0 0 120 200" style={{ position: "absolute", opacity: 0.05, ...style }} fill="var(--text-primary)" aria-hidden="true">
    <path d="M60 200 C60 200 60 100 60 80 C60 60 30 40 20 20 C15 10 25 0 35 5 C45 10 55 30 60 50 C65 30 75 10 85 5 C95 0 105 10 100 20 C90 40 60 60 60 80Z"/>
  </svg>
);

export const SustainIcon = ({ type }) => {
  const icons = {
    bcorp: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12h4a2 2 0 100-4H8v8h4.5a2.5 2.5 0 100-5H8"/></svg>,
    organic: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>,
    oldest: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/></svg>,
    bottle: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 12l2 2 4-4"/></svg>,
    local: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  };
  return icons[type] || null;
};
