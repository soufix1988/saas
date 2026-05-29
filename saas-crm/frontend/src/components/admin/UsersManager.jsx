import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../hooks/useAuth.jsx';
import translations from '../../i18n/translations';
import Modal from '../ui/Modal';

export default function UsersManager() {
  const { appConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;
  const { addToast } = useToast();

  const [users, setUsers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ nom: '', prenom: '', password: '', email: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await api.get('/api/users').catch(() => []);
    setUsers(data);
  }

  async function handleCreate() {
    setSaving(true);
    try {
      await api.post('/api/users', form);
      addToast('Utilisateur créé');
      setShowCreate(false);
      setForm({ nom: '', prenom: '', password: '', email: '' });
      load();
    } catch (err) { addToast(err.message, 'error'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    await api.delete(`/api/users/${id}`).catch(e => addToast(e.message, 'error'));
    addToast('Utilisateur supprimé');
    setConfirmDelete(null);
    load();
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{t.users}</h2>
        <button onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
          <i className="fas fa-plus mr-2" />{t.createUser}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50 text-xs text-gray-500 uppercase">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">{t.firstName} / {t.lastName}</th>
              <th className="px-4 py-3 text-left">{t.email}</th>
              <th className="px-4 py-3 text-left">{t.password}</th>
              <th className="px-4 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b hover:bg-gray-50 text-sm">
                <td className="px-4 py-3 font-mono text-xs text-blue-600">{u.id}</td>
                <td className="px-4 py-3">{u.prenom} {u.nom}</td>
                <td className="px-4 py-3 text-gray-500">{u.email || '—'}</td>
                <td className="px-4 py-3 font-mono text-xs">{u.password}</td>
                <td className="px-4 py-3">
                  {u.id !== 'admin' && (
                    <button onClick={() => setConfirmDelete(u)} className="text-red-400 hover:text-red-600">
                      <i className="fas fa-trash" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create modal */}
      <Modal open={showCreate} title={t.createUser} onConfirm={handleCreate} onCancel={() => setShowCreate(false)}
        confirmLabel={saving ? '...' : t.save}>
        <div className="space-y-3">
          {['prenom','nom','email','password'].map(key => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{t[key] || key}</label>
              <input type={key === 'password' ? 'password' : 'text'}
                value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
            </div>
          ))}
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!confirmDelete} title="Supprimer l'utilisateur ?"
        onConfirm={() => handleDelete(confirmDelete.id)} onCancel={() => setConfirmDelete(null)}
        confirmLabel="Supprimer" danger>
        <p className="text-sm text-gray-600">Supprimer <strong>{confirmDelete?.prenom} {confirmDelete?.nom}</strong> et tous ses droits ?</p>
      </Modal>
    </div>
  );
}
