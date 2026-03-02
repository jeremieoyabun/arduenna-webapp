import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export const MobileMenu = ({ t, menuOpen, navSections, scrollTo }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!menuOpen) return null;

  const handleAcademy = () => {
    navigate(user ? "/academy" : "/login");
  };

  return (
    <div className="mobile-menu" role="dialog" aria-label="Navigation menu">
      {navSections.map((sec) => (
        <button key={sec} className="mobile-menu__link" onClick={() => scrollTo(sec)}>
          {t.nav[sec]}
        </button>
      ))}
      <button className="mobile-menu__link" onClick={handleAcademy} style={{ color: "#c2744a" }}>
        🎓 Academy
      </button>
    </div>
  );
};
