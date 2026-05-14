import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(redirect ? `/${redirect}` : user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🍔</div>
        <h1 className="auth-title">{t('auth.loginTitle')}</h1>
        <p className="auth-sub">{t('auth.loginSubtitle')}</p>


        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('auth.email')}</label>
            <div className="input-wrap">
              <FiMail className="input-icon" />
              <input type="email" className="form-control input-with-icon" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.password')}</label>
            <div className="input-wrap">
              <FiLock className="input-icon" />
              <input type={showPass ? 'text' : 'password'} className="form-control input-with-icon" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="••••••••" />
              <button type="button" className="input-suffix" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
            {loading ? t('checkout.processing') : t('auth.login')}
          </button>
        </form>

        <p className="auth-switch">{t('auth.noAccount')} <Link to="/register" className="text-primary">{t('auth.register')}</Link></p>
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
        .input-suffix { position: absolute; top: 50%; right: 0.75rem; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 0.2rem; }
        [dir="rtl"] .input-suffix { right: unset; left: 0.75rem; }
        .auth-switch { text-align: center; color: var(--text-muted); font-size: 0.875rem; margin-top: 1.5rem; }
      `}</style>
    </div>
  );
}
