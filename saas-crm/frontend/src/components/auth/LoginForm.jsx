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
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #f8f5ff 0%, #faf5ff 50%, #f0fdf4 100%)'
    }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            {appConfig?.app_logo ? (
              <img src={appConfig.app_logo} alt="logo" className="w-16 h-16 rounded-xl object-cover mx-auto mb-4 shadow-md" />
            ) : (
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  boxShadow: '0 8px 24px rgba(99,102,241,0.3)'
                }}>
                <i className={`fas ${appConfig?.app_icon || 'fa-layer-group'} text-2xl text-white`} />
              </div>
            )}
            <h1 className="text-2xl font-black text-gray-900">{appConfig?.app_name || 'FormSaaS'}</h1>
            <p className="text-gray-500 text-sm mt-2">Connectez-vous à votre compte</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.username}</label>
              <div className="relative">
                <i className="fas fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-gray-900 placeholder-gray-400"
                  placeholder="nom d'utilisateur"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.password}</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
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

          <p className="text-center text-xs text-gray-400 mt-6">
            Gratuit pour toujours · Pas de carte bancaire requise
          </p>
        </div>
      </div>
    </div>
  );
}
