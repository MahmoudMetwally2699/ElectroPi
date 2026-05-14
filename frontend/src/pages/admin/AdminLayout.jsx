import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiBox, FiShoppingBag, FiTag, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

export default function AdminLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/login');
  }, [user]);

  const nav = [
    { to: '/admin', icon: FiGrid, label: t('admin.dashboard'), exact: true },
    { to: '/admin/products', icon: FiBox, label: t('admin.products') },
    { to: '/admin/orders', icon: FiShoppingBag, label: t('admin.orders') },
    { to: '/admin/categories', icon: FiTag, label: t('admin.categories') },
  ];

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sideOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand"><span>🍔</span><span>ElectroPi</span></div>
          <button className="sidebar-close" onClick={() => setSideOpen(false)}><FiX /></button>
        </div>
        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.[0]}</div>
          <div><div className="user-name">{user?.name}</div><div className="user-role">Admin</div></div>
        </div>
        <nav className="sidebar-nav">
          {nav.map(item => (
            <Link key={item.to} to={item.to} className={`sidebar-link ${isActive(item.to, item.exact) ? 'active' : ''}`} onClick={() => setSideOpen(false)}>
              <item.icon size={18} /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="sidebar-link" style={{ color: 'var(--text-muted)' }}><FiGrid size={18} /> View Site</Link>
          <button className="sidebar-link danger" onClick={() => { logout(); navigate('/'); }}><FiLogOut size={18} /> {t('nav.logout')}</button>
        </div>
      </aside>
      {sideOpen && <div className="sidebar-overlay" onClick={() => setSideOpen(false)} />}

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="topbar-menu" onClick={() => setSideOpen(true)}><FiMenu size={22} /></button>
          <span className="topbar-title">{nav.find(n => isActive(n.to, n.exact))?.label || 'Admin'}</span>
        </header>
        <div className="admin-content"><Outlet /></div>
      </div>

      <style>{`
        .admin-layout { display: flex; min-height: 100vh; background: var(--bg); }
        .admin-sidebar { width: 240px; background: var(--bg-card2); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
        .sidebar-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1rem; border-bottom: 1px solid var(--border); }
        .sidebar-brand { display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem; font-weight: 800; color: var(--primary); }
        .sidebar-close { display: none; background: none; border: none; color: var(--text-muted); cursor: pointer; }
        .sidebar-user { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-bottom: 1px solid var(--border); }
        .user-avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
        .user-name { font-weight: 600; font-size: 0.9rem; }
        .user-role { font-size: 0.72rem; color: var(--primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .sidebar-nav { flex: 1; padding: 0.75rem 0.5rem; display: flex; flex-direction: column; gap: 0.15rem; }
        .sidebar-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0.75rem; border-radius: var(--radius); color: var(--text-muted); font-size: 0.88rem; font-weight: 500; transition: var(--transition); background: none; border: none; cursor: pointer; width: 100%; text-align: left; }
        .sidebar-link:hover { background: rgba(255,255,255,0.05); color: var(--text); }
        .sidebar-link.active { background: rgba(255,107,53,0.12); color: var(--primary); font-weight: 700; }
        .sidebar-link.danger:hover { color: var(--error); }
        .sidebar-footer { padding: 0.75rem 0.5rem; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 0.15rem; }
        .admin-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .admin-topbar { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1.5rem; background: var(--bg-card2); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
        .topbar-menu { display: none; background: none; border: none; color: var(--text); cursor: pointer; }
        .topbar-title { font-weight: 700; font-size: 1rem; }
        .admin-content { padding: 1.5rem; flex: 1; }
        @media (max-width: 900px) {
          .admin-sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 200; transform: translateX(-100%); transition: transform 0.3s ease; }
          [dir="rtl"] .admin-sidebar { left: unset; right: 0; transform: translateX(100%); }
          .admin-sidebar.open { transform: translateX(0); }
          .sidebar-close { display: flex; }
          .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 199; }
          .topbar-menu { display: flex; }
        }
      `}</style>
    </div>
  );
}
