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

    <div className="footer__links">
      <a href="https://arduenna-gin.com" target="_blank" rel="noopener noreferrer" className="footer__link">{t.footer.shop}</a>
      <span className="footer__link">{t.footer.legal}</span>
      <span className="footer__link">{t.footer.contact}</span>
    </div>

    <div className="footer__legal">
      <p className="footer__copyright">{t.footer.copyright}</p>
      <p className="footer__warning">{t.footer.drink}</p>
    </div>
  </footer>
);
