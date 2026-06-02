import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useForms } from '../../hooks/useForms';
import EntryRow from './EntryRow';
import SearchBar from '../ui/SearchBar';
import FieldInput from '../forms/FieldTypes';
import translations from '../../i18n/translations';

export default function EntriesTable() {
  const { user, appConfig } = useAuth();
  const { forms } = useForms();
  const { addToast } = useToast();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;

  const [selectedFormId, setSelectedFormId] = useState('');
  const [entries, setEntries] = useState([]);
  const [fields, setFields] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    if (forms.length && !selectedFormId) setSelectedFormId(forms[0].id);
  }, [forms]);

  useEffect(() => {
    if (!selectedFormId) return;
    setLoading(true);
    Promise.all([
      api.get(`/api/entries/${selectedFormId}`),
      api.get(`/api/forms/${selectedFormId}`),
    ]).then(([es, { fields: fs }]) => {
      setEntries(es);
      setFields(fs || []);
    }).catch(e => addToast(e.message, 'error'))
      .finally(() => setLoading(false));
  }, [selectedFormId]);

  async function handleDelete(id, notify) {
    try {
      await api.delete(`/api/entries/${selectedFormId}/${id}${notify ? '?notify=true' : ''}`);
      setEntries(prev => prev.filter(e => e.id !== id));
      addToast('Entrée supprimée');
    } catch (err) {
      addToast(err.message, 'error');
    }
  }

  async function handleEditSave(updatedData) {
    try {
      await api.put(`/api/entries/${selectedFormId}/${editingEntry.id}`, { data: updatedData });
      setEntries(prev => prev.map(e => e.id === editingEntry.id ? { ...e, data: updatedData } : e));
      setEditingEntry(null);
      addToast('Entrée modifiée');
    } catch (err) {
      addToast(err.message, 'error');
    }
  }

  const rights = user?.rights?.[selectedFormId];
  const selectedForm = forms.find(f => f.id === selectedFormId);
  const isAppointment = selectedForm?.adv_config?.isAppointment;

  const filtered = entries.filter(e =>
    !search || JSON.stringify(e.data).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">{t.crm}</h1>

      <div className="glass rounded-2xl p-5 mb-6 flex flex-wrap gap-4 items-center border border-white/40 hover:border-white/60 transition-all duration-500 shadow-md">
        <select value={selectedFormId} onChange={e => setSelectedFormId(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white hover:border-gray-300">
          {forms.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
        </select>
        <SearchBar value={search} onChange={setSearch} />
        <span className="text-sm font-semibold text-gray-600 ml-auto bg-white/60 px-4 py-2 rounded-lg">{filtered.length} {t.entries}</span>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-lg">{t.loading}</div>
      ) : editingEntry ? (
        <div className="glass rounded-2xl shadow-lg p-8 border border-white/40">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl text-gray-900">Modifier l'entrée #{editingEntry.id}</h2>
            <button onClick={() => setEditingEntry(null)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300">
              <i className="fas fa-times text-lg" />
            </button>
          </div>
          <EditForm entry={editingEntry} fields={fields} onSave={handleEditSave} onCancel={() => setEditingEntry(null)} />
        </div>
      ) : (
        <div className="glass rounded-2xl shadow-md overflow-hidden border border-white/40 hover:border-white/60 transition-all duration-500">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gradient-to-r from-gray-50 to-gray-100 text-xs text-gray-600 font-bold uppercase tracking-wider">
                <th className="px-5 py-4 text-left">ID</th>
                {fields.map(f => <th key={f.id} className="px-5 py-4 text-left">{f.label}</th>)}
                {isAppointment && <th className="px-5 py-4 text-left">Statut</th>}
                <th className="px-5 py-4 text-left">Score</th>
                <th className="px-5 py-4 text-left">Date</th>
                <th className="px-5 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {filtered.map(entry => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  fields={fields}
                  rights={rights}
                  onDelete={handleDelete}
                  onEdit={setEditingEntry}
                />
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500 text-base font-medium">
              <i className="fas fa-inbox text-4xl text-gray-300 mb-3 block opacity-50" />
              Aucune entrée.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EditForm({ entry, fields, onSave, onCancel }) {
  const [values, setValues] = useState({ ...entry.data });

  return (
    <div className="space-y-6">
      {fields.map(f => (
        <div key={f.id} className="group">
          <label className="block text-sm font-semibold text-gray-800 mb-2.5">{f.label}</label>
          <FieldInput field={f} value={values[f.label]} onChange={val => setValues(v => ({ ...v, [f.label]: val }))} />
        </div>
      ))}
      <div className="flex gap-3 justify-end pt-6 border-t border-gray-200/50">
        <button onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:-translate-y-0.5">
          Annuler
        </button>
        <button onClick={() => onSave(values)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
          Sauvegarder
        </button>
      </div>
    </div>
  );
}
