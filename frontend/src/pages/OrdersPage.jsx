import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMyOrders } from '../api/api';
import { FiPackage, FiArrowRight } from 'react-icons/fi';

const STATUS_COLORS = {
  pending: 'badge-warning',
  confirmed: 'badge-info',
  preparing: 'badge-primary',
  out_for_delivery: 'badge-info',
  delivered: 'badge-success',
  cancelled: 'badge-error'
};

export default function OrdersPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders().then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader" style={{ paddingTop: '80px' }}><div className="spinner" /></div>;

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <h1 className="section-title" style={{ marginBottom: '2rem' }}>{t('orders.title')}</h1>
        {orders.length === 0 ? (
          <div className="page-loader">
            <FiPackage size={56} style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-muted)' }}>{t('orders.noOrders')}</p>
            <Link to="/menu" className="btn btn-primary">{t('cart.continueShopping')}</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-card-top">
                  <div>
                    <div className="order-id">{t('orders.orderNumber')}{order._id.slice(-8).toUpperCase()}</div>
                    <div className="order-date">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={`badge ${STATUS_COLORS[order.status]}`}>
                      {t(`orders.statuses.${order.status}`)}
                    </span>
                    <div className="order-total">{order.totalAmount.toFixed(2)} {t('app.currency')}</div>
                  </div>
                </div>
                <div className="order-items-preview">
                  {order.items.slice(0, 3).map(item => (
                    <div key={item._id} className="order-item-mini">
                      <img src={item.image} alt={item.name} onError={e => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} />
                      <span>{item.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>×{item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>+{order.items.length - 3} more</span>}
                </div>
                <div className="order-card-bottom">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {order.paymentMethod === 'cod' ? '💵 ' : '💳 '}
                    {order.paymentMethod === 'cod' ? t('checkout.cod') : t('checkout.online')}
                  </span>
                  <Link to={`/orders/${order._id}`} className="btn btn-ghost btn-sm">
                    {t('orders.trackOrder')} <FiArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .order-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; transition: var(--transition); }
        .order-card:hover { border-color: rgba(255,107,53,0.3); }
        .order-card-top { display: flex; align-items: flex-start; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
        .order-id { font-weight: 700; font-size: 0.95rem; }
        .order-date { font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem; }
        .order-total { font-weight: 800; font-size: 1rem; color: var(--primary); }
        .order-items-preview { padding: 0.75rem 1.5rem; display: flex; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--border); }
        .order-item-mini { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; }
        .order-item-mini img { width: 32px; height: 32px; border-radius: 6px; object-fit: cover; }
        .order-card-bottom { display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1.5rem; }
      `}</style>
    </div>
  );
}
