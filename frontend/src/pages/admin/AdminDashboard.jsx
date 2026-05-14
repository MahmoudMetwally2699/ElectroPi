import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getOrderStats, getAllOrders, updateOrderStatus } from '../../api/api';
import { FiShoppingBag, FiDollarSign, FiTrendingUp, FiClock } from 'react-icons/fi';

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
const STATUS_COLORS = { pending: 'badge-warning', confirmed: 'badge-info', preparing: 'badge-primary', out_for_delivery: 'badge-info', delivered: 'badge-success', cancelled: 'badge-error' };

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [s, o] = await Promise.all([getOrderStats(), getAllOrders()]);
    setStats(s.data);
    setOrders(o.data.slice(0, 10));
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, { status });
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    if (stats) fetchData();
  };

  const statCards = stats ? [
    { label: t('admin.totalOrders'), value: stats.totalOrders, icon: FiShoppingBag, color: '#3b82f6' },
    { label: t('admin.todayOrders'), value: stats.todayOrders, icon: FiTrendingUp, color: '#22c55e' },
    { label: t('admin.totalRevenue'), value: `${stats.totalRevenue.toFixed(0)} ${t('app.currency')}`, icon: FiDollarSign, color: '#f59e0b' },
    { label: t('admin.pendingOrders'), value: stats.pendingOrders, icon: FiClock, color: '#ff6b35' },
  ] : [];

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div>
      <h2 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '1.3rem' }}>{t('admin.dashboard')}</h2>

      {/* Stat cards */}
      <div className="stat-grid">
        {statCards.map((c, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-icon" style={{ background: `${c.color}18`, color: c.color }}><c.icon size={22} /></div>
            <div><div className="stat-card-val">{c.value}</div><div className="stat-card-label">{c.label}</div></div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Recent Orders</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td className="mono">#{o._id.slice(-8).toUpperCase()}</td>
                  <td>{o.user?.name || 'N/A'}</td>
                  <td>{o.items.length} items</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{o.totalAmount.toFixed(2)}</td>
                  <td>{o.paymentMethod === 'cod' ? '💵 COD' : '💳 Online'}</td>
                  <td>
                    <select className="status-select"
                      value={o.status}
                      onChange={e => handleStatusChange(o._id, e.target.value)}
                      style={{ color: o.status === 'delivered' ? 'var(--success)' : o.status === 'cancelled' ? 'var(--error)' : 'var(--primary)' }}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{t(`orders.statuses.${s}`)}</option>)}
                    </select>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.25rem; display: flex; align-items: center; gap: 1rem; transition: var(--transition); }
        .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
        .stat-card-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-card-val { font-size: 1.6rem; font-weight: 900; }
        .stat-card-label { font-size: 0.78rem; color: var(--text-muted); font-weight: 500; margin-top: 0.1rem; }
        .admin-table-wrap { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow-x: auto; }
        .admin-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .admin-table th { padding: 0.85rem 1rem; text-align: left; color: var(--text-muted); font-weight: 600; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--border); white-space: nowrap; }
        [dir="rtl"] .admin-table th { text-align: right; }
        .admin-table td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--border); vertical-align: middle; }
        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tr:hover td { background: rgba(255,255,255,0.02); }
        .mono { font-family: monospace; font-size: 0.8rem; color: var(--text-muted); }
        .status-select { background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.25); border-radius: 8px; padding: 0.3rem 0.6rem; font-size: 0.78rem; font-weight: 700; cursor: pointer; color: var(--primary); }
        @media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .stat-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
