import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../hooks/useAuth.jsx';
import translations from '../../i18n/translations';

export default function AccessManager() {
  const { appConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;
  const { addToast } = useToast();

  const [data, setData] = useState({ rights: [], users: [], forms: [] });
  const [form, setForm] = useState({
    user_id: '', form_id: '', can_view: false, can_edit: false, can_delete: false, can_view_dashboard: false
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const d = await api.get('/api/users/access').catch(() => ({ rights: [], users: [], forms: [] }));
    setData(d);
  }

  async function handleAssign() {
    if (!form.user_id || !form.form_id) { addToast('Sélectionner un utilisateur et un formulaire', 'error'); return; }
    setSaving(true);
    try {
      await api.post('/api/users/access', form);
      addToast('Droits assignés');
      setForm({ user_id: '', form_id: '', can_view: false, can_edit: false, can_delete: false, can_view_dashboard: false });
      load();
    } catch (err) { addToast(err.message, 'error'); }
    finally { setSaving(false); }
  }

  async function handleRemove(id) {
    await api.delete(`/api/users/access/${id}`);
    addToast('Droit supprimé');
    load();
  }

  const getUserName = id => {
    const u = data.users.find(u => u.id === id);
    return u ? `${u.prenom || ''} ${u.nom || ''} (${u.id})` : id;
  };

  const getFormName = id => data.forms.find(f => f.id === id)?.nom || id;

  const RIGHT_KEYS = ['can_view','can_edit','can_delete','can_view_dashboard'];
  const RIGHT_LABELS = [t.canView, t.canEdit, t.canDelete, t.canViewDashboard];

  return (
    <div className="space-y-6 fade-in">
      <h2 className="text-xl font-bold">{t.accessRights}</h2>

      {/* Assign form */}
      <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
        <h3 className="font-semibold text-gray-700">{t.assign}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Utilisateur</label>
            <select value={form.user_id} onChange={e => setForm(f => ({ ...f, user_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="">—</option>
              {data.users.map(u => <option key={u.id} value={u.id}>{u.prenom} {u.nom} ({u.id})</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Formulaire</label>
            <select value={form.form_id} onChange={e => setForm(f => ({ ...f, form_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="">—</option>
              {data.forms.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {RIGHT_KEYS.map((key, i) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
              {RIGHT_LABELS[i]}
            </label>
          ))}
        </div>
        <button onClick={handleAssign} disabled={saving}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-60">
          {saving ? '...' : t.assign}
        </button>
      </div>

      {/* Rights table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-xs text-gray-500 uppercase">
              <th className="px-4 py-3 text-left">Utilisateur</th>
              <th className="px-4 py-3 text-left">Formulaire</th>
              {RIGHT_LABELS.map(l => <th key={l} className="px-4 py-3 text-center">{l}</th>)}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {data.rights.map(r => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{getUserName(r.user_id)}</td>
                <td className="px-4 py-3">{getFormName(r.form_id)}</td>
                {RIGHT_KEYS.map(k => (
                  <td key={k} className="px-4 py-3 text-center">
                    {r[k] ? <i className="fas fa-check text-green-500" /> : <i className="fas fa-times text-red-300" />}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <button onClick={() => handleRemove(r.id)} className="text-red-400 hover:text-red-600">
                    <i className="fas fa-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
