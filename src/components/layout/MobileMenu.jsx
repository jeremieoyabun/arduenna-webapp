export const MobileMenu = ({ t, menuOpen, navSections, scrollTo }) => {
  if (!menuOpen) return null;
  return (
    <div className="mobile-menu" role="dialog" aria-label="Navigation menu">
      {navSections.map((sec) => (
        <button key={sec} className="mobile-menu__link" onClick={() => scrollTo(sec)}>
          {t.nav[sec]}
        </button>
      ))}
    </div>
  );
};
