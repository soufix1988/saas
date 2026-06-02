import { useAuth } from '../../hooks/useAuth.jsx';
import translations from '../../i18n/translations';

const CARD_STYLES = [
  {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    shadow: 'rgba(102,126,234,0.45)',
    iconBg: 'rgba(255,255,255,0.2)',
  },
  {
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    shadow: 'rgba(240,147,251,0.45)',
    iconBg: 'rgba(255,255,255,0.2)',
  },
  {
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00d4aa 100%)',
    shadow: 'rgba(79,172,254,0.45)',
    iconBg: 'rgba(255,255,255,0.2)',
  },
];

export default function KPICards({ kpi }) {
  const { appConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;

  const cards = [
    { label: t.todayAppointments, value: kpi.todayConfirmed, icon: 'fa-calendar-check', trend: '+12%' },
    { label: t.awaitingApproval, value: kpi.pending, icon: 'fa-clock', trend: '3 new' },
    { label: t.avgSatisfaction, value: kpi.avgScore ? `${kpi.avgScore}` : '—', icon: 'fa-star', suffix: '⭐', trend: '+0.2' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {cards.map((card, idx) => {
        const style = CARD_STYLES[idx];
        return (
          <div key={card.label}
            className="relative rounded-3xl p-6 overflow-hidden group cursor-default transition-all duration-500 hover:-translate-y-2 slide-in-up"
            style={{
              background: style.gradient,
              boxShadow: `0 16px 48px ${style.shadow}, 0 4px 12px rgba(0,0,0,0.1)`,
              animationDelay: `${idx * 0.1}s`
            }}>
            {/* Background shimmer pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)'
              }} />

            {/* Top row: icon + trend */}
            <div className="flex items-start justify-between mb-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{ background: style.iconBg, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                <i className={`fas ${card.icon} text-2xl text-white`} />
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)' }}>
                {card.trend}
              </span>
            </div>

            {/* Value */}
            <div className="relative z-10">
              <p className="text-4xl font-black text-white mb-1 tracking-tight">
                {card.value ?? '—'}{card.suffix}
              </p>
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{card.label}</p>
            </div>

            {/* Bottom progress bar */}
            <div className="mt-5 relative z-10">
              <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, ((card.value || 0) / 20) * 100)}%`, background: 'rgba(255,255,255,0.7)' }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
