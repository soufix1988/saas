import { useState, useEffect } from 'react';
import { useAppointments } from '../../hooks/useAppointments';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../hooks/useAuth.jsx';
import api from '../../lib/api';
import SlidePanel from './SlidePanel';
import BulkActions from './BulkActions';
import SearchBar from '../ui/SearchBar';
import translations from '../../i18n/translations';

const STATUS_STYLES = {
  'Confirmé': { bg: '#dcfce7', color: '#166534', border: '#86efac', dot: '#22c55e' },
  'En attente': { bg: '#fef3c7', color: '#92400e', border: '#fcd34d', dot: '#eab308' },
  'Annulé': { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5', dot: '#ef4444' },
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">{t.appointments}</h1>
          <p className="text-sm text-gray-500 mt-1">{appointments.length} rendez-vous</p>
        </div>
        {selected.length > 0 && (
          <button onClick={() => setSelected(appointments.map(a => a.id))}
            className="text-sm font-bold px-4 py-2 rounded-lg bg-purple-100 text-purple-700 transition-all duration-300 hover:-translate-y-0.5">
            {t.selectAll}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card-float rounded-lg p-5 mb-6 flex flex-wrap gap-4 items-center">
        <SearchBar value={search} onChange={setSearch} placeholder={t.search + '...'} />
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 transition-all bg-white" />
        <div className="flex gap-2">
          {['all', 'En attente', 'Confirmé'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className="px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
              style={filterStatus === s ? {
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
              } : {
                background: '#f3f4f6',
                color: '#6b7280'
              }}>
              {s === 'all' ? t.all : s}
            </button>
          ))}
        </div>
        {selected.length > 0 && (
          <button onClick={() => setSelected([])}
            className="text-sm font-bold ml-auto px-4 py-2 rounded-lg bg-red-100 text-red-700 transition-all duration-300 hover:-translate-y-0.5">
            Désélectionner
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg mx-auto mb-4 bg-purple-100 flex items-center justify-center">
              <i className="fas fa-spinner fa-spin text-lg text-purple-600" />
            </div>
            <p className="font-semibold text-gray-500">{t.loading}</p>
          </div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-lg mx-auto mb-4 bg-gray-100 flex items-center justify-center">
            <i className="fas fa-calendar-times text-2xl text-gray-400" />
          </div>
          <p className="text-gray-400 font-medium">Aucun rendez-vous trouvé.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt, idx) => {
            const isSelected = selected.includes(apt.id);
            const patientName = Object.values(apt.data || {})[0] || '—';
            const statusStyle = STATUS_STYLES[apt.rdv_status] || STATUS_STYLES['En attente'];

            return (
              <div key={apt.id}
                className="card-float p-5 cursor-pointer transition-all duration-300 slide-in-up hover:-translate-y-1"
                style={{
                  animationDelay: `${idx * 0.05}s`,
                  border: isSelected ? '2px solid #6366f1' : '1px solid #f3f4f6',
                  background: isSelected ? '#f0f4ff' : 'white'
                }}>
                <div className="flex items-center gap-4">
                  <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(apt.id)}
                    onClick={e => e.stopPropagation()}
                    className="w-5 h-5 cursor-pointer accent-purple-600 rounded" />

                  <div className="flex-1" onClick={() => openPanel(apt)}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black text-white"
                          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}>
                          {patientName[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900">{patientName}</span>
                          {apt.form && (
                            <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                              {apt.form.nom}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1.5 rounded font-bold flex items-center gap-1.5"
                        style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusStyle.dot }} />
                        {apt.rdv_status}
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-2">
                        <i className="fas fa-calendar text-xs text-purple-400" />
                        {apt.rdv_date}
                      </span>
                      <span className="flex items-center gap-2">
                        <i className="fas fa-clock text-xs text-pink-400" />
                        {apt.rdv_time}
                      </span>
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
