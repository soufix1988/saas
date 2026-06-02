import { useAuth } from '../../hooks/useAuth.jsx';
import translations from '../../i18n/translations';

const CARD_STYLES = [
  {
    gradient: 'linear-gradient(135deg, #e9d5ff 0%, #f3e8ff 100%)',
    color: '#7c3aed',
    icon: 'text-purple-600',
    dot: 'bg-purple-500',
  },
  {
    gradient: 'linear-gradient(135deg, #fbcfe8 0%, #fce7f3 100%)',
    color: '#ec4899',
    icon: 'text-pink-600',
    dot: 'bg-pink-500',
  },
  {
    gradient: 'linear-gradient(135deg, #fed7aa 0%, #fef3c7 100%)',
    color: '#f59e0b',
    icon: 'text-amber-600',
    dot: 'bg-amber-500',
  },
];

export default function KPICards({ kpi }) {
  const { appConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;

  const cards = [
    { label: t.todayAppointments, value: kpi.todayConfirmed, icon: 'fa-calendar-check', trend: '+12%', idx: 0 },
    { label: t.awaitingApproval, value: kpi.pending, icon: 'fa-clock', trend: '3 new', idx: 1 },
    { label: t.avgSatisfaction, value: kpi.avgScore ? `${kpi.avgScore}` : '—', icon: 'fa-star', suffix: '⭐', trend: '+0.2', idx: 2 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => {
        const style = CARD_STYLES[card.idx % 3];
        return (
          <div key={card.label}
            className="card-float p-8 hover:-translate-y-2 transition-all duration-500 slide-in-up cursor-default"
            style={{
              background: style.gradient,
              animationDelay: `${card.idx * 0.1}s`,
              border: '1px solid rgba(255,255,255,0.8)'
            }}>

            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/70 transition-transform duration-300 hover:scale-110 hover:rotate-6"
                style={{ boxShadow: `0 4px 12px rgba(99,102,241,0.1)` }}>
                <i className={`fas ${card.icon} text-2xl ${style.icon}`} />
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/60"
                style={{ color: style.color }}>
                {card.trend}
              </span>
            </div>

            <p className="text-4xl font-black text-gray-900 mb-1 tracking-tight">
              {card.value ?? '—'}{card.suffix}
            </p>
            <p className="text-sm font-medium text-gray-600">{card.label}</p>

            {/* Bottom progress bar */}
            <div className="mt-5">
              <div className="h-1 rounded-full bg-white/40">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(100, ((card.value || 0) / 20) * 100)}%`,
                    background: style.color
                  }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
