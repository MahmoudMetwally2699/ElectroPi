import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin } from 'react-icons/fi';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ icon: Icon, name, type = 'text', placeholder, required }) => (
    <div className="form-group">
      <label className="form-label">{t(`auth.${name}`)}</label>
      <div className="input-wrap">
        <Icon className="input-icon" />
        <input type={type} className="form-control input-with-icon" value={form[name]}
          onChange={e => set(name, e.target.value)} placeholder={placeholder} required={required} />
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="auth-logo">🍔</div>
        <h1 className="auth-title">{t('auth.registerTitle')}</h1>
        <p className="auth-sub">{t('auth.registerSubtitle')}</p>
        <form onSubmit={handleSubmit}>
          <Field icon={FiUser} name="name" placeholder="Ahmed Mohammed" required />
          <Field icon={FiMail} name="email" type="email" placeholder="you@example.com" required />
          <Field icon={FiLock} name="password" type="password" placeholder="••••••••" required />
          <Field icon={FiPhone} name="phone" placeholder="+966 50 000 0000" />
          <Field icon={FiMapPin} name="address" placeholder="Riyadh, Saudi Arabia" />
          <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
            {loading ? t('checkout.processing') : t('auth.register')}
          </button>
        </form>
        <p className="auth-switch">{t('auth.hasAccount')} <Link to="/login" className="text-primary">{t('auth.login')}</Link></p>
      </div>
      <style>{`
        .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; background: radial-gradient(ellipse at center, rgba(255,107,53,0.05) 0%, transparent 70%); }
        .auth-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 2.5rem; width: 100%; max-width: 420px; animation: fadeUp 0.4s ease; }
        .auth-logo { text-align: center; font-size: 3rem; margin-bottom: 0.75rem; }
        .auth-title { font-size: 1.6rem; font-weight: 800; text-align: center; margin-bottom: 0.25rem; }
        .auth-sub { text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
        .input-wrap { position: relative; }
        .input-icon { position: absolute; top: 50%; left: 1rem; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
        [dir="rtl"] .input-icon { left: unset; right: 1rem; }
        .input-with-icon { padding-left: 2.8rem; }
        [dir="rtl"] .input-with-icon { padding-left: 1rem; padding-right: 2.8rem; }
        .auth-switch { text-align: center; color: var(--text-muted); font-size: 0.875rem; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}
