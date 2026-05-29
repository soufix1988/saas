import { useState } from 'react';
import UsersManager from './UsersManager';
import AccessManager from './AccessManager';
import AppConfig from './AppConfig';
import { useAuth } from '../../hooks/useAuth.jsx';
import translations from '../../i18n/translations';

const TABS = ['users', 'access', 'config'];

export default function AdminPage() {
  const { appConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;
  const [tab, setTab] = useState('users');

  return (
    <div className="fade-in">
      <h1 className="text-2xl font-bold mb-6">{t.settings}</h1>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {TABS.map(k => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors
              ${tab === k ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}>
            {k === 'users' ? t.users : k === 'access' ? t.accessRights : t.settings}
          </button>
        ))}
      </div>

      {tab === 'users' && <UsersManager />}
      {tab === 'access' && <AccessManager />}
      {tab === 'config' && <AppConfig />}
    </div>
  );
}
