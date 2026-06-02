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
  'Confirmé': {
    bg: 'rgba(16,185,129,0.12)',
    color: '#059669',
    border: 'rgba(16,185,129,0.3)',
    dot: '#10b981'
  },
  'En attente': {
    bg: 'rgba(245,158,11,0.12)',
    color: '#d97706',
    border: 'rgba(245,158,11,0.3)',
    dot: '#f59e0b'
  },
  'Annulé': {
    bg: 'rgba(239,68,68,0.12)',
    color: '#dc2626',
    border: 'rgba(239,68,68,0.3)',
    dot: '#ef4444'
  },
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
            className="text-sm font-bold px-4 py-2 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: 'rgba(123,97,255,0.1)', color: '#7b61ff', border: '1px solid rgba(123,97,255,0.2)' }}>
            {t.selectAll}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card-float rounded-3xl p-5 mb-6 flex flex-wrap gap-4 items-center">
        <SearchBar value={search} onChange={setSearch} placeholder={t.search + '...'} />
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-300 bg-white" />
        <div className="flex gap-2">
          {['all', 'En attente', 'Confirmé'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className="px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              style={filterStatus === s ? {
                background: 'linear-gradient(135deg, #7b61ff 0%, #e91e8c 100%)',
                color: 'white',
                boxShadow: '0 4px 16px rgba(123,97,255,0.4)'
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
            className="text-sm font-semibold ml-auto px-4 py-2 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.15)' }}>
            Désélectionner tout
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7b61ff20, #e91e8c20)' }}>
              <i className="fas fa-spinner fa-spin text-2xl" style={{ color: '#7b61ff' }} />
            </div>
            <p className="font-semibold text-gray-500">{t.loading}</p>
          </div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(123,97,255,0.1), rgba(233,30,140,0.1))' }}>
            <i className="fas fa-calendar-times text-3xl" style={{ color: '#c4b5fd' }} />
          </div>
          <p className="text-gray-400 font-medium text-lg">Aucun rendez-vous trouvé.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt, idx) => {
            const isSelected = selected.includes(apt.id);
            const patientName = Object.values(apt.data || {})[0] || '—';
            const statusStyle = STATUS_STYLES[apt.rdv_status] || STATUS_STYLES['En attente'];

            return (
              <div key={apt.id}
                className="card-float rounded-2xl p-5 cursor-pointer transition-all duration-300 slide-in-up"
                style={{
                  animationDelay: `${idx * 0.05}s`,
                  outline: isSelected ? '2px solid #7b61ff' : 'none',
                  outlineOffset: '2px',
                }}>
                <div className="flex items-center gap-4">
                  <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(apt.id)}
                    onClick={e => e.stopPropagation()}
                    className="w-5 h-5 cursor-pointer rounded-md accent-purple-600" />

                  <div className="flex-1" onClick={() => openPanel(apt)}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white"
                          style={{ background: 'linear-gradient(135deg, #7b61ff 0%, #e91e8c 100%)' }}>
                          {patientName[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 text-base">{patientName}</span>
                          {apt.form && (
                            <span className="ml-2 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                              {apt.form.nom}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5"
                        style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusStyle.dot }} />
                        {apt.rdv_status}
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-500 font-medium">
                      <span className="flex items-center gap-2">
                        <i className="fas fa-calendar text-xs" style={{ color: '#a78bfa' }} />
                        {apt.rdv_date}
                      </span>
                      <span className="flex items-center gap-2">
                        <i className="fas fa-clock text-xs" style={{ color: '#f0abfc' }} />
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
