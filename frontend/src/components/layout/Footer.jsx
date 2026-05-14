import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMail, FiPhone, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-brand">
              <span>🍔</span>
              <span>{t('app.name')}</span>
            </div>
            <p className="footer-about">{t('footer.about')}</p>
            <div className="footer-socials">
              <a href="#" className="social-link"><FiInstagram /></a>
              <a href="#" className="social-link"><FiTwitter /></a>
              <a href="#" className="social-link"><FiFacebook /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">{t('footer.quickLinks')}</h4>
            <ul className="footer-links">
              <li><Link to="/">{t('nav.home')}</Link></li>
              <li><Link to="/menu">{t('nav.menu')}</Link></li>
              <li><Link to="/orders">{t('nav.orders')}</Link></li>
              <li><Link to="/login">{t('nav.login')}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">{t('footer.contact')}</h4>
            <ul className="footer-links">
              <li className="contact-item"><FiMail size={14} /> {t('footer.email')}</li>
              <li className="contact-item"><FiPhone size={14} /> {t('footer.phone')}</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}</span>
        </div>
      </div>

      <style>{`
        .footer { background: #0a0a14; border-top: 1px solid var(--border); padding: 3rem 0 1.5rem; margin-top: auto; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
        .footer-brand { display: flex; align-items: center; gap: 0.5rem; font-size: 1.3rem; font-weight: 800; color: var(--primary); margin-bottom: 0.75rem; }
        .footer-about { color: var(--text-muted); font-size: 0.85rem; line-height: 1.7; max-width: 300px; }
        .footer-socials { display: flex; gap: 0.5rem; margin-top: 1rem; }
        .social-link { width: 36px; height: 36px; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: var(--transition); }
        .social-link:hover { background: var(--primary); color: #fff; border-color: var(--primary); }
        .footer-heading { font-size: 0.9rem; font-weight: 700; color: var(--text); margin-bottom: 1rem; }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
        .footer-links a, .contact-item { color: var(--text-muted); font-size: 0.85rem; transition: var(--transition); display: flex; align-items: center; gap: 0.4rem; }
        .footer-links a:hover { color: var(--primary); }
        .footer-bottom { border-top: 1px solid var(--border); padding-top: 1.25rem; text-align: center; color: var(--text-muted); font-size: 0.8rem; }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; } .footer-col:first-child { grid-column: 1 / -1; } }
        @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr; } }
      `}</style>
    </footer>
  );
}
