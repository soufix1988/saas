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
      <h1 className="text-2xl font-bold mb-6">{t.crm}</h1>

      <div className="bg-white rounded-xl p-4 shadow-sm mb-4 flex flex-wrap gap-3 items-center">
        <select value={selectedFormId} onChange={e => setSelectedFormId(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
          {forms.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
        </select>
        <SearchBar value={search} onChange={setSearch} />
        <span className="text-sm text-gray-400 ml-auto">{filtered.length} {t.entries}</span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">{t.loading}</div>
      ) : editingEntry ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Modifier l'entrée #{editingEntry.id}</h2>
            <button onClick={() => setEditingEntry(null)} className="text-gray-400 hover:text-gray-600">
              <i className="fas fa-times" />
            </button>
          </div>
          <EditForm entry={editingEntry} fields={fields} onSave={handleEditSave} onCancel={() => setEditingEntry(null)} />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-xs text-gray-500 uppercase">
                <th className="px-4 py-3 text-left">ID</th>
                {fields.map(f => <th key={f.id} className="px-4 py-3 text-left">{f.label}</th>)}
                {isAppointment && <th className="px-4 py-3 text-left">Statut</th>}
                <th className="px-4 py-3 text-left">Score</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
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
            <div className="text-center py-8 text-gray-400 text-sm">Aucune entrée.</div>
          )}
        </div>
      )}
    </div>
  );
}

function EditForm({ entry, fields, onSave, onCancel }) {
  const [values, setValues] = useState({ ...entry.data });

  return (
    <div className="space-y-4">
      {fields.map(f => (
        <div key={f.id}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
          <FieldInput field={f} value={values[f.label]} onChange={val => setValues(v => ({ ...v, [f.label]: val }))} />
        </div>
      ))}
      <div className="flex gap-2 justify-end pt-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-200 text-sm">Annuler</button>
        <button onClick={() => onSave(values)} className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm">Sauvegarder</button>
      </div>
    </div>
  );
}
