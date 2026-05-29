import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../hooks/useAuth.jsx';
import KPICards from './KPICards';
import WeeklyChart from './WeeklyChart';
import TodayAgenda from './TodayAgenda';
import MonthlyCalendar from './MonthlyCalendar';
import SlidePanel from '../appointments/SlidePanel';
import translations from '../../i18n/translations';

export default function Dashboard() {
  const { user, appConfig } = useAuth();
  const { addToast } = useToast();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedApt, setSelectedApt] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    api.get('/api/dashboard').then(setData).catch(e => addToast(e.message, 'error')).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-400">{t.loading}</div>;

  return (
    <div className="fade-in">
      <h1 className="text-2xl font-bold mb-6">{t.dashboard}</h1>

      <KPICards kpi={data?.kpi || {}} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <WeeklyChart weeklyData={data?.weeklyData} />
        <TodayAgenda
          todayAgenda={data?.todayAgenda}
          onClickEntry={apt => { setSelectedApt(apt); setPanelOpen(true); }}
        />
      </div>

      <MonthlyCalendar monthlyData={data?.monthlyData} />

      <SlidePanel
        appointment={selectedApt}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onApprove={async apt => {
          await api.put(`/api/entries/${apt.form_id}/${apt.id}`, { rdv_status: 'Confirmé', notify: true });
          addToast('Confirmé');
          setPanelOpen(false);
        }}
      />
    </div>
  );
}
