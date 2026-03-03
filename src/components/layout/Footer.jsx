import { IconInstagram, IconFacebook, IconLinkedIn, IconPinterest } from "../ui/Icons";

const socials = [
  { href: "https://www.instagram.com/arduenna.gin/",                    Icon: IconInstagram, label: "Instagram" },
  { href: "https://www.facebook.com/ArduennaGin",                       Icon: IconFacebook,  label: "Facebook"  },
  { href: "https://be.linkedin.com/company/arduenna-organic-gin",       Icon: IconLinkedIn,  label: "LinkedIn"  },
  { href: "https://www.pinterest.com/ArduennaGin/",                     Icon: IconPinterest, label: "Pinterest" },
];

export const Footer = ({ t }) => (
  <footer className="footer">
    <div className="footer__brand">
      <img
        src="/Arduennagin_logo_vert_.webp"
        alt="Arduenna"
        className="footer__logo"
      />
      <div className="footer__tagline">{t.footer.tagline}</div>
    </div>

    <div className="footer__social">
      {socials.map(({ href, Icon, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="footer__social-link"
          aria-label={label}
        >
          <Icon />
        </a>
      ))}
    </div>

    <div className="footer__links">
      <a href="https://arduenna-gin.com" target="_blank" rel="noopener noreferrer" className="footer__link">{t.footer.shop}</a>
      <a href="https://arduenna-gin.com/conditions-generales-de-vente/" target="_blank" rel="noopener noreferrer" className="footer__link">{t.footer.legal}</a>
      <a href="https://arduenna-gin.com/confidentialite/" target="_blank" rel="noopener noreferrer" className="footer__link">{t.footer.privacy}</a>
      <a href="mailto:info@arduenna-gin.com" className="footer__link">info@arduenna-gin.com</a>
    </div>

    <div className="footer__legal">
      <p className="footer__copyright">{t.footer.copyright}</p>
      <p className="footer__warning">{t.footer.drink}</p>
    </div>
  </footer>
);
