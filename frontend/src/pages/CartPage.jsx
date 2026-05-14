import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';

export default function CartPage() {
  const { t } = useTranslation();
  const { items, removeFromCart, updateQuantity, subtotal, deliveryFee, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) { navigate('/login?redirect=checkout'); return; }
    navigate('/checkout');
  };

  if (items.length === 0) return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center" style={{ padding: '2rem' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('cart.empty')}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{t('menu.noItems')}</p>
        <Link to="/menu" className="btn btn-primary">{t('cart.continueShopping')}</Link>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <h1 className="section-title" style={{ marginBottom: '2rem' }}>{t('cart.title')}</h1>
        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-img"
                  onError={e => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'} />
                <div className="cart-info">
                  <h3 className="cart-name">{item.name}</h3>
                  <div className="cart-price">{item.price} {t('app.currency')}</div>
                </div>
                <div className="cart-qty">
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}><FiMinus size={14} /></button>
                  <span className="qty-val">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}><FiPlus size={14} /></button>
                </div>
                <div className="cart-total">{(item.price * item.quantity).toFixed(2)} {t('app.currency')}</div>
                <button className="cart-remove" onClick={() => removeFromCart(item._id)}><FiTrash2 size={16} /></button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h3>
            <div className="summary-row"><span>{t('cart.subtotal')}</span><span>{subtotal.toFixed(2)} {t('app.currency')}</span></div>
            <div className="summary-row">
              <span>{t('cart.deliveryFee')}</span>
              <span style={{ color: deliveryFee === 0 ? 'var(--success)' : 'inherit' }}>
                {deliveryFee === 0 ? t('cart.free') : `${deliveryFee} ${t('app.currency')}`}
              </span>
            </div>
            {deliveryFee > 0 && <p className="free-hint">Order 100+ SAR for free delivery!</p>}
            <div className="divider" />
            <div className="summary-row total">
              <span>{t('cart.total')}</span>
              <span style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 800 }}>{total.toFixed(2)} {t('app.currency')}</span>
            </div>
            <button className="btn btn-primary w-full btn-lg" style={{ marginTop: '1.25rem' }} onClick={handleCheckout}>
              <FiShoppingBag /> {t('cart.checkout')}
            </button>
            <Link to="/menu" className="btn btn-ghost w-full" style={{ marginTop: '0.75rem' }}>{t('cart.continueShopping')}</Link>
          </div>
        </div>
      </div>

      <style>{`
        .cart-layout { display: grid; grid-template-columns: 1fr 360px; gap: 2rem; align-items: start; }
        .cart-items { display: flex; flex-direction: column; gap: 1rem; }
        .cart-item { display: flex; align-items: center; gap: 1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem; transition: var(--transition); }
        .cart-item:hover { border-color: rgba(255,107,53,0.2); }
        .cart-img { width: 72px; height: 72px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
        .cart-info { flex: 1; min-width: 0; }
        .cart-name { font-weight: 600; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cart-price { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem; }
        .cart-qty { display: flex; align-items: center; gap: 0.5rem; }
        .qty-btn { width: 28px; height: 28px; border-radius: 8px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: var(--text); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); }
        .qty-btn:hover { background: var(--primary); border-color: var(--primary); }
        .qty-val { min-width: 24px; text-align: center; font-weight: 700; }
        .cart-total { font-weight: 700; color: var(--primary); min-width: 80px; text-align: end; }
        .cart-remove { width: 32px; height: 32px; border-radius: 8px; border: none; background: rgba(239,68,68,0.1); color: var(--error); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); }
        .cart-remove:hover { background: var(--error); color: #fff; }
        .cart-summary { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; position: sticky; top: 100px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.9rem; color: var(--text-muted); }
        .summary-row.total { font-weight: 700; color: var(--text); font-size: 1rem; margin-bottom: 0; }
        .free-hint { font-size: 0.75rem; color: var(--success); margin-top: -0.5rem; margin-bottom: 0.5rem; }
        @media (max-width: 900px) { .cart-layout { grid-template-columns: 1fr; } }
        @media (max-width: 480px) { .cart-item { flex-wrap: wrap; } .cart-total { min-width: unset; } }
      `}</style>
    </div>
  );
}
