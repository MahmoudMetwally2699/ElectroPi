import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../../api/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const EMPTY = { name: { en: '', ar: '' }, description: { en: '', ar: '' }, price: '', image: '', category: '', isAvailable: true, isFeatured: false, preparationTime: 15 };

export default function AdminProducts() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    const [p, c] = await Promise.all([getProducts(), getCategories()]);
    setProducts(p.data); setCategories(c.data); setLoading(false);
  };
  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (p) => {
    setForm({ ...p, category: p.category?._id || p.category });
    setEditing(p._id); setModal(true);
  };

  const setField = (path, val) => {
    const parts = path.split('.');
    setForm(f => {
      const next = { ...f };
      if (parts.length === 2) next[parts[0]] = { ...next[parts[0]], [parts[1]]: val };
      else next[parts[0]] = val;
      return next;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editing) { const r = await updateProduct(editing, payload); setProducts(prev => prev.map(p => p._id === editing ? r.data : p)); toast.success('Product updated'); }
      else { const r = await createProduct(payload); setProducts(prev => [r.data, ...prev]); toast.success('Product created'); }
      setModal(false);
    } catch (e) { toast.error(e.response?.data?.message || 'Error saving product'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    await deleteProduct(id);
    setProducts(prev => prev.filter(p => p._id !== id));
    toast.success('Product deleted');
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.3rem' }}>{t('admin.products')} ({products.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> {t('admin.addProduct')}</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th>{t('admin.actions')}</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td><img src={p.image} alt={p.name?.[lang]} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} onError={e => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} /></td>
                <td><div style={{ fontWeight: 600 }}>{p.name?.[lang]}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.name?.['ar']}</div></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{p.category?.name?.[lang] || '-'}</td>
                <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{p.price} {t('app.currency')}</td>
                <td>
                  <span className={`badge ${p.isAvailable ? 'badge-success' : 'badge-error'}`}>
                    {p.isAvailable ? t('menu.available') : t('menu.unavailable')}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}><FiEdit2 size={14} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}><FiTrash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? t('admin.editProduct') : t('admin.addProduct')}</h3>
              <button className="modal-close" onClick={() => setModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSave} className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('admin.name_en')}</label>
                  <input className="form-control" value={form.name.en} onChange={e => setField('name.en', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('admin.name_ar')}</label>
                  <input className="form-control" value={form.name.ar} onChange={e => setField('name.ar', e.target.value)} required dir="rtl" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('admin.desc_en')}</label>
                  <textarea className="form-control" rows={2} value={form.description.en} onChange={e => setField('description.en', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('admin.desc_ar')}</label>
                  <textarea className="form-control" rows={2} value={form.description.ar} onChange={e => setField('description.ar', e.target.value)} dir="rtl" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('admin.price')} (SAR)</label>
                  <input type="number" className="form-control" value={form.price} onChange={e => setField('price', e.target.value)} required min="0" step="0.5" />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('admin.category')}</label>
                  <select className="form-control" value={form.category} onChange={e => setField('category', e.target.value)} required>
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name.en}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Prep Time (min)</label>
                  <input type="number" className="form-control" value={form.preparationTime} onChange={e => setField('preparationTime', e.target.value)} min="1" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.image')}</label>
                <input className="form-control" value={form.image} onChange={e => setField('image', e.target.value)} placeholder="https://..." />
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={form.isAvailable} onChange={e => setField('isAvailable', e.target.checked)} /> Available
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setField('isFeatured', e.target.checked)} /> Featured
                </label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>{t('admin.cancel')}</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : t('admin.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-table-wrap { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow-x: auto; }
        .admin-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .admin-table th { padding: 0.85rem 1rem; text-align: left; color: var(--text-muted); font-weight: 600; font-size: 0.78rem; text-transform: uppercase; border-bottom: 1px solid var(--border); white-space: nowrap; }
        [dir="rtl"] .admin-table th { text-align: right; }
        .admin-table td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--border); vertical-align: middle; }
        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tr:hover td { background: rgba(255,255,255,0.02); }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 500; padding: 1rem; }
        .modal { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; animation: fadeUp 0.3s ease; }
        .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
        .modal-header h3 { font-weight: 700; font-size: 1rem; }
        .modal-close { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.2rem; display: flex; }
        .modal-close:hover { color: var(--error); }
        .modal-body { padding: 1.5rem; }
      `}</style>
    </div>
  );
}
