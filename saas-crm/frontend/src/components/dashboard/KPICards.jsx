import { useAuth } from '../../hooks/useAuth.jsx';
import translations from '../../i18n/translations';

export default function KPICards({ kpi }) {
  const { appConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;
  const color = appConfig?.app_color || '#111827';

  const cards = [
    { label: t.todayAppointments, value: kpi.todayConfirmed, icon: 'fa-calendar-check', bg: color },
    { label: t.awaitingApproval, value: kpi.pending, icon: 'fa-clock', bg: '#f59e0b' },
    { label: t.avgSatisfaction, value: kpi.avgScore ? `${kpi.avgScore} ⭐` : '—', icon: 'fa-star', bg: '#10b981' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map(card => (
        <div key={card.label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ background: card.bg + '20' }}>
            <i className={`fas ${card.icon} text-lg`} style={{ color: card.bg }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{card.value ?? '—'}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
