import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProducts, getCategories } from '../api/api';
import ProductCard from '../components/ProductCard';
import { FiArrowRight, FiStar, FiClock, FiTruck } from 'react-icons/fi';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const lang = i18n.language;

  useEffect(() => {
    getProducts({ available: true }).then(r => setFeatured(r.data.filter(p => p.isFeatured).slice(0, 6)));
    getCategories().then(r => setCategories(r.data));
  }, []);

  const features = [
    { icon: '🍕', title: lang === 'ar' ? 'أطباق طازجة' : 'Fresh Dishes', desc: lang === 'ar' ? 'مكونات طازجة يومياً' : 'Fresh ingredients daily' },
    { icon: '⚡', title: lang === 'ar' ? 'توصيل سريع' : 'Fast Delivery', desc: lang === 'ar' ? 'توصيل في 45 دقيقة' : 'Delivery within 45 mins' },
    { icon: '🔒', title: lang === 'ar' ? 'دفع آمن' : 'Secure Payment', desc: lang === 'ar' ? 'طرق دفع متعددة' : 'Multiple payment methods' },
    { icon: '⭐', title: lang === 'ar' ? 'أفضل جودة' : 'Best Quality', desc: lang === 'ar' ? 'طعام عالي الجودة' : 'Premium quality food' },
  ];

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-text fade-up">
            <div className="hero-pill">🔥 {lang === 'ar' ? 'الأكثر طلباً اليوم' : 'Most Ordered Today'}</div>
            <h1 className="hero-title">{t('hero.title')}</h1>
            <p className="hero-sub">{t('hero.subtitle')}</p>
            <div className="hero-btns">
              <Link to="/menu" className="btn btn-primary btn-lg">{t('hero.cta')} <FiArrowRight /></Link>
              <div className="hero-stats">
                <div className="stat"><FiStar className="stat-icon" /><strong>4.9</strong><span>{lang === 'ar' ? 'تقييم' : 'Rating'}</span></div>
                <div className="stat-div" />
                <div className="stat"><FiClock className="stat-icon" /><strong>30</strong><span>{lang === 'ar' ? 'دقيقة' : 'Mins'}</span></div>
                <div className="stat-div" />
                <div className="stat"><FiTruck className="stat-icon" /><strong>500+</strong><span>{lang === 'ar' ? 'طلب يومي' : 'Daily Orders'}</span></div>
              </div>
            </div>
          </div>
          <div className="hero-image fade-in">
            <div className="hero-img-wrap">
              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600" alt="hero food" />
              <div className="hero-float-card">
                <span>🛵</span>
                <div><div className="float-title">{lang === 'ar' ? 'في الطريق!' : 'On the way!'}</div><div className="float-sub">ETA: 25 mins</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <div><div className="feature-title">{f.title}</div><div className="feature-desc">{f.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">{lang === 'ar' ? 'تصفح الفئات' : 'Browse Categories'}</h2>
            <p className="section-sub">{lang === 'ar' ? 'اختر من مجموعة متنوعة من الأطباق' : 'Choose from a wide variety of dishes'}</p>
            <div className="categories-grid">
              {categories.map(cat => (
                <Link to={`/menu?category=${cat._id}`} key={cat._id} className="cat-card">
                  <img src={cat.image} alt={cat.name[lang]} onError={e => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'} />
                  <div className="cat-overlay"><span>{cat.name[lang]}</span></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">{t('menu.featured')}</h2>
                <p className="section-sub">{lang === 'ar' ? 'الأطباق الأكثر شعبية لدينا' : 'Our most popular dishes'}</p>
              </div>
              <Link to="/menu" className="btn btn-outline">{lang === 'ar' ? 'عرض الكل' : 'View All'} <FiArrowRight /></Link>
            </div>
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-text">
              <h2>{lang === 'ar' ? 'جاهز للطلب؟' : 'Ready to Order?'}</h2>
              <p>{lang === 'ar' ? 'أنشئ حسابك واحصل على أول طلب مجاني التوصيل' : 'Create your account and get free delivery on your first order'}</p>
            </div>
            <Link to="/register" className="btn btn-primary btn-lg">{t('nav.register')}</Link>
          </div>
        </div>
      </section>

      <style>{`
        .hero { min-height: 100vh; display: flex; align-items: center; position: relative; overflow: hidden; padding-top: 80px; }
        .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 80% at 50% -20%, rgba(255,107,53,0.15), transparent); pointer-events: none; }
        .hero-content { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; padding: 4rem 1.5rem; }
        .hero-pill { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(255,107,53,0.12); border: 1px solid rgba(255,107,53,0.3); color: var(--primary); padding: 0.4rem 1rem; border-radius: 999px; font-size: 0.85rem; font-weight: 600; margin-bottom: 1.25rem; }
        .hero-title { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; line-height: 1.15; margin-bottom: 1rem; background: linear-gradient(135deg, #fff 60%, var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-sub { font-size: 1.05rem; color: var(--text-muted); max-width: 450px; margin-bottom: 2rem; line-height: 1.8; }
        .hero-btns { display: flex; flex-direction: column; gap: 1.5rem; align-items: flex-start; }
        [dir="rtl"] .hero-btns { align-items: flex-end; }
        .hero-stats { display: flex; align-items: center; gap: 1rem; }
        .stat { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; }
        .stat strong { color: var(--text); font-size: 1rem; }
        .stat span { color: var(--text-muted); }
        .stat-icon { color: var(--primary); }
        .stat-div { width: 1px; height: 24px; background: var(--border); }
        .hero-img-wrap { position: relative; }
        .hero-img-wrap img { width: 100%; border-radius: 24px; box-shadow: 0 30px 80px rgba(0,0,0,0.5); }
        .hero-float-card { position: absolute; bottom: -16px; left: -16px; background: rgba(26,26,46,0.95); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: var(--radius); padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.6rem; font-size: 1.5rem; box-shadow: var(--shadow); }
        [dir="rtl"] .hero-float-card { left: unset; right: -16px; }
        .float-title { font-size: 0.85rem; font-weight: 600; }
        .float-sub { font-size: 0.75rem; color: var(--text-muted); }
        .features-section { padding: 3rem 0; }
        .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .feature-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; display: flex; align-items: center; gap: 1rem; transition: var(--transition); }
        .feature-card:hover { border-color: var(--primary); transform: translateY(-2px); }
        .feature-icon { font-size: 2rem; }
        .feature-title { font-weight: 700; font-size: 0.9rem; }
        .feature-desc { font-size: 0.78rem; color: var(--text-muted); }
        .categories-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1rem; }
        .cat-card { position: relative; border-radius: var(--radius); overflow: hidden; height: 130px; cursor: pointer; }
        .cat-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .cat-card:hover img { transform: scale(1.1); }
        .cat-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%); display: flex; align-items: flex-end; justify-content: center; padding: 0.6rem; }
        .cat-overlay span { font-size: 0.85rem; font-weight: 700; color: #fff; text-align: center; }
        .products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2rem; }
        .cta-section { padding: 4rem 0; }
        .cta-inner { background: linear-gradient(135deg, rgba(255,107,53,0.15), rgba(247,197,159,0.08)); border: 1px solid rgba(255,107,53,0.25); border-radius: var(--radius-lg); padding: 3rem; display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
        .cta-text h2 { font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem; }
        .cta-text p { color: var(--text-muted); }
        @media (max-width: 1024px) { .features-grid { grid-template-columns: repeat(2,1fr); } .categories-grid { grid-template-columns: repeat(4,1fr); } }
        @media (max-width: 768px) {
          .hero-content { grid-template-columns: 1fr; text-align: center; }
          [dir="rtl"] .hero-content { text-align: center; }
          .hero-image { display: none; }
          .hero-btns { align-items: center; }
          .products-grid { grid-template-columns: 1fr 1fr; }
          .categories-grid { grid-template-columns: repeat(3,1fr); }
          .cta-inner { flex-direction: column; text-align: center; }
          .section-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
        }
        @media (max-width: 480px) { .products-grid { grid-template-columns: 1fr; } .categories-grid { grid-template-columns: repeat(2,1fr); } .features-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
