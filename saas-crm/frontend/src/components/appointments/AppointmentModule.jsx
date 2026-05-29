import { useState, useEffect } from 'react';
import { useAppointments } from '../../hooks/useAppointments';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../hooks/useAuth.jsx';
import api from '../../lib/api';
import SlidePanel from './SlidePanel';
import BulkActions from './BulkActions';
import SearchBar from '../ui/SearchBar';
import translations from '../../i18n/translations';

const STATUS_COLORS = {
  'Confirmé': 'bg-green-100 text-green-700',
  'En attente': 'bg-yellow-100 text-yellow-700',
  'Annulé': 'bg-red-100 text-red-700',
};

export default function AppointmentModule() {
  const { appointments, loading, load } = useAppointments();
  const { addToast } = useToast();
  const { appConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;

  const [selectedApt, setSelectedApt] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selected, setSelected] = useState([]);

  useEffect(() => { load(); }, []);

  useEffect(() => {
    load({ status: filterStatus !== 'all' ? filterStatus : '', date: filterDate, search });
  }, [filterStatus, filterDate, search]);

  function openPanel(apt) {
    setSelectedApt(apt);
    setPanelOpen(true);
  }

  async function handleApprove(apt) {
    try {
      await api.put(`/api/entries/${apt.form_id}/${apt.id}`, { rdv_status: 'Confirmé', notify: true });
      addToast('Rendez-vous confirmé');
      setPanelOpen(false);
      load();
    } catch (err) {
      addToast(err.message, 'error');
    }
  }

  async function handleBulkAction(action, notify) {
    try {
      await api.post('/api/appointments/bulk', { ids: selected, action, notify });
      addToast(`${selected.length} rendez-vous traité(s)`);
      setSelected([]);
      load();
    } catch (err) {
      addToast(err.message, 'error');
    }
  }

  function toggleSelect(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t.appointments}</h1>
        {selected.length > 0 && (
          <button onClick={() => { setSelected(appointments.map(a => a.id)); }}
            className="text-sm text-gray-500 hover:text-gray-800">
            {t.selectAll}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm flex flex-wrap gap-3 items-center">
        <SearchBar value={search} onChange={setSearch} placeholder={t.search + '...'} />
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
        <div className="flex gap-1">
          {['all', 'En attente', 'Confirmé'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors
                ${filterStatus === s ? 'bg-gray-900 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {s === 'all' ? t.all : s}
            </button>
          ))}
        </div>
        {selected.length > 0 && (
          <button onClick={() => setSelected([])} className="text-sm text-gray-500 hover:text-gray-800 ml-auto">
            Désélectionner tout
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">{t.loading}</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Aucun rendez-vous trouvé.</div>
      ) : (
        <div className="space-y-2">
          {appointments.map(apt => {
            const isSelected = selected.includes(apt.id);
            const patientName = Object.values(apt.data || {})[0] || '—';
            return (
              <div key={apt.id}
                className={`bg-white rounded-xl p-4 shadow-sm border-2 cursor-pointer transition-all
                  ${isSelected ? 'border-gray-900' : 'border-transparent hover:border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(apt.id)}
                    onClick={e => e.stopPropagation()} className="w-4 h-4" />
                  <div className="flex-1" onClick={() => openPanel(apt)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{patientName}</span>
                        {apt.form && <span className="ml-2 text-xs text-gray-400">{apt.form.nom}</span>}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[apt.rdv_status] || 'bg-gray-100 text-gray-600'}`}>
                        {apt.rdv_status}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-1 text-sm text-gray-500">
                      <span><i className="fas fa-calendar mr-1" />{apt.rdv_date}</span>
                      <span><i className="fas fa-clock mr-1" />{apt.rdv_time}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <SlidePanel
        appointment={selectedApt}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onApprove={handleApprove}
      />

      <BulkActions
        selectedIds={selected}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelected([])}
      />
    </div>
  );
}
