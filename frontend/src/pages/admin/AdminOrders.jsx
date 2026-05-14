import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllOrders, updateOrderStatus } from '../../api/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = (status) => {
    setLoading(true);
    getAllOrders(status ? { status } : {}).then(r => setOrders(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchOrders(filter); }, [filter]);

  const handleStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.3rem' }}>{t('admin.orders')} ({orders.length})</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['', ...STATUS_OPTIONS].map(s => (
            <button key={s} className={`cat-tab ${filter === s ? 'active' : ''}`} style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
              onClick={() => setFilter(s)}>
              {s ? t(`orders.statuses.${s}`) : 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="page-loader"><div className="spinner" /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {orders.map(o => (
            <div key={o._id} className="admin-order-card">
              <div className="ao-header" onClick={() => setExpanded(expanded === o._id ? null : o._id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="mono">#{o._id.slice(-8).toUpperCase()}</span>
                  <span style={{ fontWeight: 600 }}>{o.user?.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{o.user?.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{o.totalAmount.toFixed(2)} {t('app.currency')}</span>
                  <select className="status-select" value={o.status} onClick={e => e.stopPropagation()}
                    onChange={e => handleStatus(o._id, e.target.value)}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{t(`orders.statuses.${s}`)}</option>)}
                  </select>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(o.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {expanded === o._id && (
                <div className="ao-body">
                  <div className="ao-section">
                    <strong>Items:</strong>
                    {o.items.map(item => (
                      <div key={item._id} className="ao-item">
                        <img src={item.image} alt={item.name} onError={e => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} />
                        <span>{item.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>×{item.quantity}</span>
                        <span style={{ marginLeft: 'auto', fontWeight: 700 }}>{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="ao-meta">
                    <div><span>Address:</span> {o.deliveryAddress}</div>
                    <div><span>Payment:</span> {o.paymentMethod === 'cod' ? '💵 COD' : '💳 Online'} — <span style={{ color: o.paymentStatus === 'paid' ? 'var(--success)' : 'var(--warning)', textTransform: 'capitalize' }}>{o.paymentStatus}</span></div>
                    {o.notes && <div><span>Notes:</span> {o.notes}</div>}
                  </div>
                </div>
              )}
            </div>
          ))}
          {orders.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No orders found</div>}
        </div>
      )}

      <style>{`
        .cat-tab { padding: 0.5rem 1.1rem; border-radius: 999px; border: 1.5px solid var(--border); background: transparent; color: var(--text-muted); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: var(--transition); }
        .cat-tab:hover { border-color: var(--primary); color: var(--primary); }
        .cat-tab.active { background: var(--primary); border-color: var(--primary); color: #fff; }
        .admin-order-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; transition: var(--transition); }
        .admin-order-card:hover { border-color: rgba(255,107,53,0.2); }
        .ao-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; cursor: pointer; flex-wrap: wrap; gap: 0.75rem; }
        .ao-body { border-top: 1px solid var(--border); padding: 1.25rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; animation: fadeIn 0.2s ease; }
        .ao-section strong { display: block; font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.6rem; letter-spacing: 0.05em; }
        .ao-item { display: flex; align-items: center; gap: 0.6rem; padding: 0.4rem 0; font-size: 0.85rem; }
        .ao-item img { width: 34px; height: 34px; border-radius: 6px; object-fit: cover; }
        .ao-meta { display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.85rem; }
        .ao-meta div span:first-child { color: var(--text-muted); margin-right: 0.4rem; }
        .status-select { background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.25); border-radius: 8px; padding: 0.3rem 0.6rem; font-size: 0.78rem; font-weight: 700; cursor: pointer; color: var(--primary); }
        .mono { font-family: monospace; font-size: 0.82rem; color: var(--text-muted); }
        @media (max-width: 640px) { .ao-body { grid-template-columns: 1fr; } .ao-header { flex-direction: column; align-items: flex-start; } }
      `}</style>
    </div>
  );
}
