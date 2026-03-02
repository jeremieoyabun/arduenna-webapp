import { IconMoon, IconSun, IconGlobe, IconMenu, IconX } from "../ui/Icons";

export const Navbar = ({ t, lang, theme, scrolled, menuOpen, activeSection, navSections, scrollTo, toggleTheme, setLang, setMenuOpen }) => (
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
      </div>

      <div className="top-nav__actions">
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
