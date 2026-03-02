import { useNavigate } from "react-router-dom";
import { IconMoon, IconSun, IconGlobe, IconMenu, IconX } from "../ui/Icons";
import { useAuth } from "../auth/AuthProvider";

const IconGradCap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
  </svg>
);

export const Navbar = ({ t, lang, theme, scrolled, menuOpen, activeSection, navSections, scrollTo, toggleTheme, setLang, setMenuOpen }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAcademy = () => {
    navigate(user ? "/academy" : "/login");
  };

  return (
    <nav className={`top-nav ${scrolled ? "top-nav--scrolled" : ""}`} role="navigation" aria-label="Main navigation">
      <div className="top-nav__inner">
        <img
          src="/Arduennagin_logo_vert_.webp"
          alt="Arduenna — Retour à l'accueil"
          className="top-nav__logo"
          onClick={() => scrollTo("hero")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && scrollTo("hero")}
        />

        <div className="top-nav__links">
          {navSections.map((sec) => (
            <button
              key={sec}
              className={`top-nav__link ${activeSection === sec ? "top-nav__link--active" : ""}`}
              onClick={() => scrollTo(sec)}
              aria-current={activeSection === sec ? "true" : undefined}
            >
              {t.nav[sec]}
            </button>
          ))}
          <button
            className="top-nav__link"
            onClick={handleAcademy}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <IconGradCap /> Academy
          </button>
        </div>

        <div className="top-nav__actions">
          <button
            onClick={handleAcademy}
            className="academy-toggle"
            aria-label="Academy"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#c2744a", display: "flex", alignItems: "center",
              gap: 4, fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              textTransform: "uppercase", letterSpacing: 1.5,
              padding: "4px 0",
            }}
          >
            <IconGradCap />
          </button>
          <button onClick={toggleTheme} className="theme-toggle" aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
            {theme === "light" ? <IconMoon /> : <IconSun />}
          </button>
          <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="lang-toggle" aria-label={`Switch to ${lang === "fr" ? "English" : "French"}`}>
            <IconGlobe /> {lang.toUpperCase()}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
            {menuOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export const BottomNav = ({ activeSection, bottomNavItems, scrollTo }) => (
  <nav className="bottom-nav" role="navigation" aria-label="Quick navigation">
    {bottomNavItems.map(({ id, label, Icon }) => (
      <button
        key={id}
        className={`bottom-nav__item ${activeSection === id ? "bottom-nav__item--active" : ""}`}
        onClick={() => scrollTo(id)}
        aria-label={label}
        aria-current={activeSection === id ? "true" : undefined}
      >
        <span className="bottom-nav__icon" aria-hidden="true"><Icon /></span>
        {label}
      </button>
    ))}
  </nav>
);
