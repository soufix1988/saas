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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t.appointments}</h1>
        {selected.length > 0 && (
          <button onClick={() => { setSelected(appointments.map(a => a.id)); }}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all duration-300">
            {t.selectAll}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-5 mb-6 flex flex-wrap gap-4 items-center border border-white/40 hover:border-white/60 transition-all duration-500 shadow-md">
        <SearchBar value={search} onChange={setSearch} placeholder={t.search + '...'} />
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white hover:border-gray-300" />
        <div className="flex gap-2">
          {['all', 'En attente', 'Confirmé'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${filterStatus === s ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:-translate-y-0.5' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'}`}>
              {s === 'all' ? t.all : s}
            </button>
          ))}
        </div>
        {selected.length > 0 && (
          <button onClick={() => setSelected([])} className="text-sm font-semibold text-gray-600 hover:text-gray-800 ml-auto hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-300">
            Désélectionner tout
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-lg">{t.loading}</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-base font-medium">
          <i className="fas fa-calendar-times text-4xl text-gray-300 mb-3 block opacity-50" />
          Aucun rendez-vous trouvé.
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt, idx) => {
            const isSelected = selected.includes(apt.id);
            const patientName = Object.values(apt.data || {})[0] || '—';
            return (
              <div key={apt.id}
                className={`glass rounded-xl p-5 cursor-pointer transition-all duration-300 border ${isSelected ? 'border-indigo-400 bg-indigo-50/40 shadow-lg ring-2 ring-indigo-200' : 'border-white/40 hover:border-white/80 hover:shadow-lg hover:-translate-y-1'}`}
                style={{animationDelay: `${idx * 0.05}s`}}>
                <div className="flex items-center gap-4">
                  <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(apt.id)}
                    onClick={e => e.stopPropagation()} className="w-5 h-5 accent-indigo-600 cursor-pointer" />
                  <div className="flex-1" onClick={() => openPanel(apt)}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-bold text-gray-900 text-base">{patientName}</span>
                        {apt.form && <span className="ml-3 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{apt.form.nom}</span>}
                      </div>
                      <span className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-300 ${STATUS_COLORS[apt.rdv_status] || 'bg-gray-100 text-gray-600'}`}>
                        {apt.rdv_status}
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-600 font-medium">
                      <span className="flex items-center gap-2"><i className="fas fa-calendar text-indigo-500" />{apt.rdv_date}</span>
                      <span className="flex items-center gap-2"><i className="fas fa-clock text-indigo-500" />{apt.rdv_time}</span>
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
