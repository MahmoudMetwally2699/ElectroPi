import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProducts, getCategories } from '../api/api';
import ProductCard from '../components/ProductCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

export default function MenuPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const lang = i18n.language;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    getCategories().then(r => setCategories(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { available: true };
    if (activeCategory) params.category = activeCategory;
    if (search) params.search = search;
    getProducts(params)
      .then(r => setProducts(r.data))
      .finally(() => setLoading(false));
  }, [activeCategory, search]);

  const handleCategory = (id) => {
    setActiveCategory(id);
    if (id) setSearchParams({ category: id });
    else setSearchParams({});
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="menu-hero">
        <div className="container">
          <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>{t('menu.title')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{lang === 'ar' ? 'اكتشف طعامنا اللذيذ' : 'Discover our delicious food'}</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Search */}
        <div className="menu-search">
          <div className="search-wrap">
            <FiSearch className="search-icon" />
            <input className="form-control search-input" placeholder={t('menu.search')}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Categories */}
        <div className="cat-tabs">
          <button className={`cat-tab ${!activeCategory ? 'active' : ''}`} onClick={() => handleCategory('')}>
            {t('menu.all')}
          </button>
          {categories.map(cat => (
            <button key={cat._id} className={`cat-tab ${activeCategory === cat._id ? 'active' : ''}`}
              onClick={() => handleCategory(cat._id)}>
              {cat.name[lang]}
            </button>
          ))}
        </div>

        {/* Products */}
        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="page-loader" style={{ gap: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>🍽️</div>
            <p style={{ color: 'var(--text-muted)' }}>{t('menu.noItems')}</p>
          </div>
        ) : (
          <div className="menu-grid">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>

      <style>{`
        .menu-hero { background: linear-gradient(135deg, rgba(255,107,53,0.1), transparent); border-bottom: 1px solid var(--border); padding: 2.5rem 0; }
        .menu-search { margin-bottom: 1.5rem; }
        .search-wrap { position: relative; max-width: 480px; }
        .search-icon { position: absolute; top: 50%; left: 1rem; transform: translateY(-50%); color: var(--text-muted); }
        [dir="rtl"] .search-icon { left: unset; right: 1rem; }
        .search-input { padding-left: 2.8rem; }
        [dir="rtl"] .search-input { padding-left: 1rem; padding-right: 2.8rem; }
        .cat-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem; }
        .cat-tab { padding: 0.5rem 1.1rem; border-radius: 999px; border: 1.5px solid var(--border); background: transparent; color: var(--text-muted); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: var(--transition); }
        .cat-tab:hover { border-color: var(--primary); color: var(--primary); }
        .cat-tab.active { background: var(--primary); border-color: var(--primary); color: #fff; }
        .menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 1.5rem; }
      `}</style>
    </div>
  );
}
