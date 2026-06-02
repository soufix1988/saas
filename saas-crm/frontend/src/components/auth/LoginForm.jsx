import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useToast } from '../ui/Toast';
import translations from '../../i18n/translations';

export default function LoginForm() {
  const { login, appConfig } = useAuth();
  const { addToast } = useToast();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;
  const color = appConfig?.app_color || '#7b61ff';

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(identifier, password);
    } catch (err) {
      addToast(err.message || t.error, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>

      {/* Ambient blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7b61ff, transparent)' }} />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #e91e8c, transparent)' }} />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4facfe, transparent)' }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md px-4 scale-in">
        <div className="rounded-3xl p-10 transition-all duration-500"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)'
          }}>

          {/* Header */}
          <div className="text-center mb-10">
            {appConfig?.app_logo ? (
              <img src={appConfig.app_logo} alt="logo"
                className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 shadow-2xl" />
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-105 hover:rotate-3"
                style={{
                  background: 'linear-gradient(135deg, #7b61ff 0%, #e91e8c 100%)',
                  boxShadow: '0 16px 48px rgba(123,97,255,0.5)'
                }}>
                <i className={`fas ${appConfig?.app_icon || 'fa-layer-group'} text-3xl text-white`} />
              </div>
            )}
            <h1 className="text-3xl font-black text-white mb-2">
              {appConfig?.app_name || 'FormSaaS'}
            </h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Connectez-vous à votre espace
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {t.username}
              </label>
              <div className="relative">
                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-white/30 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    outline: 'none',
                  }}
                  onFocus={e => {
                    e.target.style.border = '1px solid rgba(123,97,255,0.6)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(123,97,255,0.15)';
                  }}
                  onBlur={e => {
                    e.target.style.border = '1px solid rgba(255,255,255,0.12)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {t.password}
              </label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-white/30 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    outline: 'none',
                  }}
                  onFocus={e => {
                    e.target.style.border = '1px solid rgba(123,97,255,0.6)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(123,97,255,0.15)';
                  }}
                  onBlur={e => {
                    e.target.style.border = '1px solid rgba(255,255,255,0.12)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-base text-white transition-all duration-300 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #7b61ff 0%, #e91e8c 100%)',
                boxShadow: loading ? 'none' : '0 8px 32px rgba(123,97,255,0.5)',
                opacity: loading ? 0.7 : 1
              }}>
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <i className="fas fa-spinner fa-spin" />
                  {t.loading}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {t.login}
                  <i className="fas fa-arrow-right" />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
