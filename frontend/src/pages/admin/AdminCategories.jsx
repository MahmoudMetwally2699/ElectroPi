import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const EMPTY = { name: { en: '', ar: '' }, image: '', isActive: true };

export default function AdminCategories() {
  const { t } = useTranslation();
  const [cats, setCats] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { getCategories().then(r => setCats(r.data)); }, []);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (c) => { setForm(c); setEditing(c._id); setModal(true); };

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
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { const r = await updateCategory(editing, form); setCats(prev => prev.map(c => c._id === editing ? r.data : c)); toast.success('Updated'); }
      else { const r = await createCategory(form); setCats(prev => [...prev, r.data]); toast.success('Created'); }
      setModal(false);
    } catch { toast.error('Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    await deleteCategory(id); setCats(prev => prev.filter(c => c._id !== id)); toast.success('Deleted');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.3rem' }}>{t('admin.categories')} ({cats.length})</h2>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Category</button>
      </div>

      <div className="cats-grid">
        {cats.map(c => (
          <div key={c._id} className="cat-manage-card">
            <img src={c.image} alt={c.name.en} onError={e => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'} />
            <div className="cat-manage-body">
              <div className="cat-manage-names">
                <span className="cat-manage-en">{c.name.en}</span>
                <span className="cat-manage-ar">{c.name.ar}</span>
              </div>
              <div className="cat-manage-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}><FiEdit2 size={14} /></button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}><FiTrash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Category' : 'Add Category'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSave} className="modal-body">
              <div className="form-group">
                <label className="form-label">{t('admin.name_en')}</label>
                <input className="form-control" value={form.name.en} onChange={e => setField('name.en', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('admin.name_ar')}</label>
                <input className="form-control" value={form.name.ar} onChange={e => setField('name.ar', e.target.value)} required dir="rtl" />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input className="form-control" value={form.image} onChange={e => setField('image', e.target.value)} placeholder="https://..." />
              </div>
              {form.image && <img src={form.image} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10, marginBottom: '1rem' }} onError={e => e.target.style.display = 'none'} />}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>{t('admin.cancel')}</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : t('admin.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .cats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        .cat-manage-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; transition: var(--transition); }
        .cat-manage-card:hover { border-color: rgba(255,107,53,0.3); transform: translateY(-2px); }
        .cat-manage-card img { width: 100%; height: 130px; object-fit: cover; }
        .cat-manage-body { padding: 0.85rem 1rem; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
        .cat-manage-names { min-width: 0; }
        .cat-manage-en { display: block; font-weight: 700; font-size: 0.88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cat-manage-ar { display: block; font-size: 0.75rem; color: var(--text-muted); }
        .cat-manage-actions { display: flex; gap: 0.3rem; flex-shrink: 0; }
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
