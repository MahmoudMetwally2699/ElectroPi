import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { FiPlus, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const lang = i18n.language;

  const name = product.name?.[lang] || product.name?.en || '';
  const desc = product.description?.[lang] || product.description?.en || '';

  const handleAdd = () => {
    addToCart({
      _id: product._id,
      name: name,
      price: product.price,
      image: product.image
    });
    toast.success(`${name} added to cart!`, { icon: '🛒', style: { background: '#1a1a2e', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.08)' } });
  };

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <img src={product.image} alt={name} className="product-img" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'; }} />
        {product.isFeatured && <span className="product-badge">⭐ Featured</span>}
        {!product.isAvailable && <div className="product-overlay"><span>Unavailable</span></div>}
      </div>
      <div className="product-body">
        <h3 className="product-name">{name}</h3>
        <p className="product-desc">{desc}</p>
        <div className="product-meta">
          <span className="product-prep"><FiClock size={12} /> {product.preparationTime} {t('menu.prepTime')}</span>
        </div>
        <div className="product-footer">
          <span className="product-price">{product.price} {t('app.currency')}</span>
          <button className="btn btn-primary btn-sm add-btn" onClick={handleAdd} disabled={!product.isAvailable}>
            <FiPlus size={14} /> {t('menu.addToCart')}
          </button>
        </div>
      </div>

      <style>{`
        .product-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; transition: var(--transition); }
        .product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); border-color: rgba(255,107,53,0.3); }
        .product-img-wrap { position: relative; height: 200px; overflow: hidden; }
        .product-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .product-card:hover .product-img { transform: scale(1.06); }
        .product-badge { position: absolute; top: 10px; left: 10px; background: var(--primary); color: #fff; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px; }
        [dir="rtl"] .product-badge { left: unset; right: 10px; }
        .product-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; }
        .product-body { padding: 1rem 1.1rem; }
        .product-name { font-size: 1rem; font-weight: 700; margin-bottom: 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .product-desc { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; height: 2.4em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .product-meta { margin: 0.5rem 0; }
        .product-prep { display: flex; align-items: center; gap: 0.3rem; font-size: 0.75rem; color: var(--text-muted); }
        .product-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 0.75rem; }
        .product-price { font-size: 1.1rem; font-weight: 800; color: var(--primary); }
        .add-btn { border-radius: 8px; }
      `}</style>
    </div>
  );
}
