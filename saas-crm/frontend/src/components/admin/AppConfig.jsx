import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../hooks/useAuth.jsx';
import translations from '../../i18n/translations';

const PATTERNS = ['bg-solid','bg-dots','bg-grid','bg-waves','bg-zigzag','bg-hexagons','bg-triangles','bg-circles','bg-crosshatch'];
const ICONS = ['fa-layer-group','fa-leaf','fa-star','fa-heart','fa-bolt','fa-graduation-cap','fa-stethoscope','fa-briefcase','fa-home','fa-globe','fa-rocket'];
const LANGS = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ar', label: 'العربية' },
  { code: 'he', label: 'עברית' },
];

export default function AppConfig() {
  const { appConfig, setAppConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;
  const { addToast } = useToast();

  const [cfg, setCfg] = useState(appConfig || {});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/api/config').then(setCfg).catch(console.error);
  }, []);

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setCfg(c => ({ ...c, app_logo: ev.target.result }));
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.put('/api/config', cfg);
      setAppConfig(cfg);
      addToast('Configuration sauvegardée');
      // Apply RTL if needed
      document.documentElement.dir = ['ar','he'].includes(cfg.app_lang) ? 'rtl' : 'ltr';
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{t.settings}</h2>
        <button onClick={handleSave} disabled={saving}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-60">
          {saving ? '...' : t.save}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        {/* App name */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">{t.appName}</label>
          <input value={cfg.app_name || ''} onChange={e => setCfg(c => ({ ...c, app_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
        </div>

        {/* Icon */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">{t.icon}</label>
          <div className="flex gap-2 flex-wrap">
            {ICONS.map(ic => (
              <button key={ic} type="button" onClick={() => setCfg(c => ({ ...c, app_icon: ic }))}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-colors
                  ${cfg.app_icon === ic ? 'border-gray-900 bg-gray-100' : 'border-gray-200 hover:border-gray-400'}`}>
                <i className={`fas ${ic}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Logo upload */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">{t.logo}</label>
          <div className="flex items-center gap-3">
            {cfg.app_logo && (
              <img src={cfg.app_logo} alt="logo" className="w-12 h-12 rounded-full object-cover border" />
            )}
            <label className="px-3 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
              <i className="fas fa-upload mr-2" />Choisir une image
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
            {cfg.app_logo && (
              <button onClick={() => setCfg(c => ({ ...c, app_logo: '' }))} className="text-red-400 hover:text-red-600 text-sm">
                Supprimer
              </button>
            )}
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">{t.language}</label>
          <select value={cfg.app_lang || 'fr'} onChange={e => setCfg(c => ({ ...c, app_lang: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
            {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t.primaryColor}</label>
            <div className="flex gap-2">
              <input type="color" value={cfg.app_color || '#111827'} onChange={e => setCfg(c => ({ ...c, app_color: e.target.value }))}
                className="w-12 h-10 rounded-lg cursor-pointer border-0" />
              <input type="text" value={cfg.app_color || '#111827'} onChange={e => setCfg(c => ({ ...c, app_color: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Couleur texte bouton</label>
            <div className="flex gap-2">
              <input type="color" value={cfg.app_text_color || '#ffffff'} onChange={e => setCfg(c => ({ ...c, app_text_color: e.target.value }))}
                className="w-12 h-10 rounded-lg cursor-pointer border-0" />
              <input type="text" value={cfg.app_text_color || '#ffffff'} onChange={e => setCfg(c => ({ ...c, app_text_color: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none" />
            </div>
          </div>
        </div>

        {/* BG color */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">{t.bgColor}</label>
          <div className="flex gap-2">
            <input type="color" value={cfg.app_bg_color || '#f7f9fc'} onChange={e => setCfg(c => ({ ...c, app_bg_color: e.target.value }))}
              className="w-12 h-10 rounded-lg cursor-pointer border-0" />
            <input type="text" value={cfg.app_bg_color || '#f7f9fc'} onChange={e => setCfg(c => ({ ...c, app_bg_color: e.target.value }))}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none" />
          </div>
        </div>

        {/* Patterns */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">{t.bgPattern}</label>
          <div className="grid grid-cols-3 gap-2">
            {PATTERNS.map(p => (
              <button key={p} type="button" onClick={() => setCfg(c => ({ ...c, app_pattern: p }))}
                className={`h-14 rounded-lg border-2 flex items-center justify-center transition-colors ${p}
                  ${cfg.app_pattern === p ? 'border-gray-900' : 'border-gray-200'}`}>
                <span className="text-xs text-gray-600 bg-white/80 px-1 rounded">{p.replace('bg-','')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* BG image */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Image de fond URL</label>
          <input value={cfg.app_bg_img || ''} onChange={e => setCfg(c => ({ ...c, app_bg_img: e.target.value }))}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
        </div>

        {/* Slack */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
            <i className="fab fa-slack text-purple-500" /> Slack Webhook URL
          </label>
          <input value={cfg.slack_webhook_url || ''} onChange={e => setCfg(c => ({ ...c, slack_webhook_url: e.target.value }))}
            placeholder="https://hooks.slack.com/services/..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none font-mono" />
          <p className="text-xs text-gray-400 mt-1">Recevez une notification Slack à chaque nouvelle réponse de formulaire.</p>
        </div>

        {/* Live preview */}
        <div className="border rounded-xl p-4" style={{ background: cfg.app_bg_color || '#f7f9fc' }}>
          <p className="text-xs text-gray-500 mb-2">Aperçu</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: cfg.app_color || '#111827' }}>
              <i className={`fas ${cfg.app_icon || 'fa-layer-group'}`} style={{ color: cfg.app_text_color || '#fff' }} />
            </div>
            <span className="font-bold" style={{ color: cfg.app_color || '#111827' }}>
              {cfg.app_name || 'FormSaaS'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
