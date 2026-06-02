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
  const color = appConfig?.app_color || '#111827';
  const textColor = appConfig?.app_text_color || '#ffffff';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          {appConfig?.app_logo ? (
            <img src={appConfig.app_logo} alt="logo" className="w-16 h-16 rounded-full object-cover mx-auto mb-3" />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: color }}>
              <i className={`fas ${appConfig?.app_icon || 'fa-layer-group'} text-2xl`} style={{ color: textColor }} />
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{appConfig?.app_name || 'FormSaaS'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.username}</label>
            <input
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-semibold transition-opacity disabled:opacity-60"
            style={{ background: color, color: textColor }}
          >
            {loading ? t.loading : t.login}
          </button>
        </form>
      </div>
    </div>
  );
}
