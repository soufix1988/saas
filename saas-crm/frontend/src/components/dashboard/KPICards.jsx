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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {cards.map((card, idx) => (
        <div key={card.label}
          className="glass rounded-2xl p-6 flex items-center gap-5 border border-white/40 hover:border-white/80 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 group"
          style={{ animationDelay: `${idx * 0.1}s` }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
            style={{ background: card.bg + '25' }}>
            <i className={`fas ${card.icon} text-2xl transition-transform duration-300 group-hover:scale-125`} style={{ color: card.bg }} />
          </div>
          <div className="flex-1">
            <p className="text-3xl font-bold text-gray-900 tracking-tight">{card.value ?? '—'}</p>
            <p className="text-sm text-gray-600 font-medium mt-1">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
