import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiGlobe, FiPackage, FiSettings } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false); }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(next);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🍔</span>
          <span className="brand-name">{t('app.name')}</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>{t('nav.home')}</Link>
          <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>{t('nav.menu')}</Link>
          {user && <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>{t('nav.orders')}</Link>}
          {user?.role === 'admin' && <Link to="/admin" className="nav-link admin-link">{t('nav.admin')}</Link>}
        </div>

        <div className="navbar-actions">
          <button className="btn-icon lang-toggle" onClick={toggleLang} title="Language">
            <FiGlobe size={18} />
            <span className="lang-label">{i18n.language === 'en' ? 'ع' : 'EN'}</span>
          </button>

          <Link to="/cart" className="btn-icon cart-btn">
            <FiShoppingCart size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {user ? (
            <div className="user-dropdown" ref={dropdownRef}>
              <button className="btn-icon user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FiUser size={20} />
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-name">{user.name}</div>
                    <div className="dropdown-email">{user.email}</div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/profile" className="dropdown-item"><FiSettings size={14} /> {t('nav.profile')}</Link>
                  <Link to="/orders" className="dropdown-item"><FiPackage size={14} /> {t('nav.orders')}</Link>
                  {user.role === 'admin' && <Link to="/admin" className="dropdown-item"><FiSettings size={14} /> {t('nav.admin')}</Link>}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}><FiLogOut size={14} /> {t('nav.logout')}</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm">{t('nav.login')}</Link>
              <Link to="/register" className="btn btn-primary btn-sm">{t('nav.register')}</Link>
            </div>
          )}

          <button className="btn-icon mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
