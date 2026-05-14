import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getOrderById } from '../api/api';
import { FiCheckCircle, FiClock, FiTruck, FiPackage, FiXCircle, FiArrowLeft } from 'react-icons/fi';

const STEPS = [
  { key: 'pending', icon: FiClock, label: 'Pending' },
  { key: 'confirmed', icon: FiCheckCircle, label: 'Confirmed' },
  { key: 'preparing', icon: FiPackage, label: 'Preparing' },
  { key: 'out_for_delivery', icon: FiTruck, label: 'On the way' },
  { key: 'delivered', icon: FiCheckCircle, label: 'Delivered' }
];

const STATUS_IDX = { pending: 0, confirmed: 1, preparing: 2, out_for_delivery: 3, delivered: 4 };

export default function OrderDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id).then(r => setOrder(r.data)).finally(() => setLoading(false));
    const interval = setInterval(() => {
      getOrderById(id).then(r => setOrder(r.data)).catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="page-loader" style={{ paddingTop: '80px' }}><div className="spinner" /></div>;
  if (!order) return <div className="page-loader" style={{ paddingTop: '80px' }}><p>Order not found</p></div>;

  const stepIdx = STATUS_IDX[order.status] ?? 0;
  const isCancelled = order.status === 'cancelled';

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: 800 }}>
        <Link to="/orders" className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
          <FiArrowLeft /> Back to Orders
        </Link>
        <div className="order-header">
          <div>
            <h1 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
              {t('orders.orderNumber')}{order._id.slice(-8).toUpperCase()}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span className={`badge badge-${isCancelled ? 'error' : 'primary'}`} style={{ fontSize: '0.85rem', padding: '0.3rem 0.9rem' }}>
            {t(`orders.statuses.${order.status}`)}
          </span>
        </div>

        {/* Progress Tracker */}
        {!isCancelled && (
          <div className="track-card">
            <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>📍 {t('orders.trackOrder')}</h3>
            <div className="track-steps">
              {STEPS.map((step, i) => {
                const done = i <= stepIdx;
                const active = i === stepIdx;
                const Icon = step.icon;
                return (
                  <div key={step.key} className={`track-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                    <div className="step-icon"><Icon size={18} /></div>
                    <div className="step-label">{t(`orders.statuses.${step.key}`)}</div>
                    {i < STEPS.length - 1 && <div className={`step-line ${i < stepIdx ? 'done' : ''}`} />}
                  </div>
                );
              })}
            </div>
            {order.estimatedDelivery && order.status !== 'delivered' && (
              <div className="eta-badge">
                <FiClock size={14} /> {t('orders.estimatedDelivery')}: {new Date(order.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        )}
        {isCancelled && (
          <div className="cancelled-banner"><FiXCircle size={20} /> This order has been cancelled.</div>
        )}

        {/* Details */}
        <div className="detail-grid">
          <div className="detail-card">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>🧾 Order Items</h3>
            {order.items.map(item => (
              <div key={item._id} className="detail-item">
                <img src={item.image} alt={item.name} onError={e => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>×{item.quantity} × {item.price} {t('app.currency')}</div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="detail-card">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>📋 Details</h3>
            <div className="detail-row"><span>Address</span><span>{order.deliveryAddress}</span></div>
            <div className="detail-row"><span>Phone</span><span>{order.phone}</span></div>
            <div className="detail-row"><span>Payment</span><span>{order.paymentMethod === 'cod' ? t('checkout.cod') : t('checkout.online')}</span></div>
            <div className="detail-row"><span>Payment Status</span><span style={{ color: order.paymentStatus === 'paid' ? 'var(--success)' : 'var(--warning)', textTransform: 'capitalize' }}>{order.paymentStatus}</span></div>
            {order.notes && <div className="detail-row"><span>Notes</span><span>{order.notes}</span></div>}
            <div className="divider" />
            <div className="detail-row"><span>{t('cart.subtotal')}</span><span>{(order.totalAmount - (order.totalAmount > 100 ? 0 : 10)).toFixed(2)} {t('app.currency')}</span></div>
            <div className="detail-row" style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
              <span>{t('cart.total')}</span><span style={{ color: 'var(--primary)' }}>{order.totalAmount.toFixed(2)} {t('app.currency')}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .order-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; }
        .track-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.25rem; }
        .track-steps { display: flex; align-items: flex-start; gap: 0; position: relative; }
        .track-step { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; flex: 1; position: relative; z-index: 1; }
        .step-icon { width: 44px; height: 44px; border-radius: 50%; background: var(--border); border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: var(--transition); }
        .track-step.done .step-icon { background: rgba(255,107,53,0.15); border-color: var(--primary); color: var(--primary); }
        .track-step.active .step-icon { background: var(--primary); border-color: var(--primary); color: #fff; box-shadow: 0 0 20px rgba(255,107,53,0.5); }
        .step-label { font-size: 0.7rem; text-align: center; color: var(--text-muted); font-weight: 600; }
        .track-step.done .step-label { color: var(--primary); }
        .step-line { position: absolute; top: 22px; left: 50%; width: 100%; height: 2px; background: var(--border); z-index: 0; }
        .step-line.done { background: var(--primary); }
        .eta-badge { margin-top: 1.25rem; display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.25); color: var(--primary); padding: 0.4rem 0.9rem; border-radius: 999px; font-size: 0.82rem; font-weight: 600; }
        .cancelled-banner { display: flex; align-items: center; gap: 0.6rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: var(--error); padding: 1rem 1.25rem; border-radius: var(--radius); margin-bottom: 1.25rem; font-weight: 600; }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .detail-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; }
        .detail-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0; border-bottom: 1px solid var(--border); }
        .detail-item:last-child { border-bottom: none; }
        .detail-item img { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 0.65rem; font-size: 0.85rem; }
        .detail-row span:first-child { color: var(--text-muted); }
        .detail-row span:last-child { font-weight: 600; text-align: end; max-width: 60%; }
        @media (max-width: 640px) { .detail-grid { grid-template-columns: 1fr; } .track-step .step-label { font-size: 0.6rem; } }
      `}</style>
    </div>
  );
}
