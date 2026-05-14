import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/api';
import toast from 'react-hot-toast';
import { FiCreditCard, FiDollarSign, FiMapPin, FiPhone, FiCheckCircle } from 'react-icons/fi';

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    deliveryAddress: user?.address || '',
    phone: user?.phone || '',
    notes: '',
    paymentMethod: 'cod',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.deliveryAddress || !form.phone) { toast.error('Please fill all required fields'); return; }
    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        product: item._id, name: item.name, price: item.price, quantity: item.quantity, image: item.image
      }));
      const { data } = await createOrder({
        items: orderItems, totalAmount: total,
        deliveryAddress: form.deliveryAddress, phone: form.phone,
        paymentMethod: form.paymentMethod, notes: form.notes
      });
      clearCart();
      setOrderId(data._id);
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="success-card">
        <div className="success-icon"><FiCheckCircle /></div>
        <h2>{t('checkout.orderPlaced')}</h2>
        <p>{t('checkout.orderConfirm')}</p>
        <div className="success-actions">
          <button className="btn btn-primary" onClick={() => navigate(`/orders/${orderId}`)}>{t('orders.trackOrder')}</button>
          <button className="btn btn-ghost" onClick={() => navigate('/menu')}>Back to Menu</button>
        </div>
      </div>
      <style>{`
        .success-card { text-align: center; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 3rem 2rem; max-width: 420px; width: 100%; animation: fadeUp 0.5s ease; }
        .success-icon { font-size: 4rem; color: var(--success); margin-bottom: 1rem; display: flex; justify-content: center; }
        .success-card h2 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; }
        .success-card p { color: var(--text-muted); margin-bottom: 1.5rem; }
        .success-actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      `}</style>
    </div>
  );

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <h1 className="section-title" style={{ marginBottom: '2rem' }}>{t('checkout.title')}</h1>
        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            {/* Left: Form */}
            <div className="checkout-form">
              {/* Delivery */}
              <div className="checkout-section">
                <h3 className="checkout-heading">🚚 Delivery Details</h3>
                <div className="form-group">
                  <label className="form-label"><FiMapPin size={13} /> {t('checkout.deliveryAddress')} *</label>
                  <textarea className="form-control" rows={3} value={form.deliveryAddress}
                    onChange={e => set('deliveryAddress', e.target.value)} required placeholder="Enter full delivery address..." />
                </div>
                <div className="form-group">
                  <label className="form-label"><FiPhone size={13} /> {t('checkout.phone')} *</label>
                  <input type="tel" className="form-control" value={form.phone}
                    onChange={e => set('phone', e.target.value)} required placeholder="+966 50 000 0000" />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('checkout.notes')}</label>
                  <textarea className="form-control" rows={2} value={form.notes}
                    onChange={e => set('notes', e.target.value)} placeholder="Any special instructions..." />
                </div>
              </div>

              {/* Payment */}
              <div className="checkout-section">
                <h3 className="checkout-heading">💳 {t('checkout.paymentMethod')}</h3>
                <div className="payment-options">
                  <label className={`payment-option ${form.paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value="cod" checked={form.paymentMethod === 'cod'}
                      onChange={() => set('paymentMethod', 'cod')} />
                    <div className="payment-icon"><FiDollarSign size={22} /></div>
                    <div><div className="payment-title">{t('checkout.cod')}</div><div className="payment-desc">Pay when you receive</div></div>
                  </label>
                  <label className={`payment-option ${form.paymentMethod === 'online' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value="online" checked={form.paymentMethod === 'online'}
                      onChange={() => set('paymentMethod', 'online')} />
                    <div className="payment-icon"><FiCreditCard size={22} /></div>
                    <div><div className="payment-title">{t('checkout.online')}</div><div className="payment-desc">Pay securely online</div></div>
                  </label>
                </div>
                {form.paymentMethod === 'online' && (
                  <div className="card-fields">
                    <div className="form-group">
                      <label className="form-label">{t('checkout.cardNumber')}</label>
                      <input className="form-control" placeholder="1234 5678 9012 3456" maxLength={19}
                        value={form.cardNumber} onChange={e => set('cardNumber', e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">{t('checkout.expiry')}</label>
                        <input className="form-control" placeholder="MM/YY" maxLength={5}
                          value={form.cardExpiry} onChange={e => set('cardExpiry', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t('checkout.cvv')}</label>
                        <input className="form-control" placeholder="123" maxLength={4}
                          value={form.cardCvv} onChange={e => set('cardCvv', e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Summary */}
            <div className="checkout-summary">
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Order Summary</h3>
              <div className="checkout-items">
                {items.map(item => (
                  <div key={item._id} className="co-item">
                    <img src={item.image} alt={item.name} onError={e => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} />
                    <div className="co-info"><div className="co-name">{item.name}</div><div className="co-qty">x{item.quantity}</div></div>
                    <div className="co-price">{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="divider" />
              <div className="summary-row"><span>{t('cart.subtotal')}</span><span>{subtotal.toFixed(2)} {t('app.currency')}</span></div>
              <div className="summary-row"><span>{t('cart.deliveryFee')}</span><span style={{ color: deliveryFee === 0 ? 'var(--success)' : 'inherit' }}>{deliveryFee === 0 ? t('cart.free') : `${deliveryFee} ${t('app.currency')}`}</span></div>
              <div className="divider" />
              <div className="summary-row" style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)' }}>
                <span>{t('cart.total')}</span>
                <span style={{ color: 'var(--primary)' }}>{total.toFixed(2)} {t('app.currency')}</span>
              </div>
              <button type="submit" className="btn btn-primary w-full btn-lg" style={{ marginTop: '1.25rem' }} disabled={loading || items.length === 0}>
                {loading ? t('checkout.processing') : t('checkout.placeOrder')}
              </button>
            </div>
          </div>
        </form>
      </div>
      <style>{`
        .checkout-layout { display: grid; grid-template-columns: 1fr 360px; gap: 2rem; align-items: start; }
        .checkout-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.25rem; }
        .checkout-heading { font-size: 1rem; font-weight: 700; margin-bottom: 1.25rem; }
        .payment-options { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }
        .payment-option { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; border: 2px solid var(--border); border-radius: var(--radius); cursor: pointer; transition: var(--transition); }
        .payment-option input { display: none; }
        .payment-option.selected { border-color: var(--primary); background: rgba(255,107,53,0.07); }
        .payment-icon { width: 44px; height: 44px; border-radius: 10px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; color: var(--primary); flex-shrink: 0; }
        .payment-title { font-weight: 700; font-size: 0.9rem; }
        .payment-desc { font-size: 0.78rem; color: var(--text-muted); }
        .card-fields { animation: fadeUp 0.3s ease; }
        .checkout-summary { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; position: sticky; top: 100px; }
        .checkout-items { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 0.5rem; }
        .co-item { display: flex; align-items: center; gap: 0.75rem; }
        .co-item img { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
        .co-info { flex: 1; min-width: 0; }
        .co-name { font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .co-qty { font-size: 0.75rem; color: var(--text-muted); }
        .co-price { font-size: 0.85rem; font-weight: 700; color: var(--primary); }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.9rem; color: var(--text-muted); }
        @media (max-width: 900px) { .checkout-layout { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
