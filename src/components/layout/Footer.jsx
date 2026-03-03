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
