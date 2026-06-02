import { useAuth } from '../../hooks/useAuth.jsx';
import translations from '../../i18n/translations';

export default function TodayAgenda({ todayAgenda, onClickEntry }) {
  const { appConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;

  return (
    <div className="glass rounded-2xl p-6 border border-white/40 hover:border-white/80 transition-all duration-500 hover:shadow-lg">
      <h3 className="font-bold text-gray-900 text-lg mb-5">{t.todayAgenda}</h3>
      {(!todayAgenda || !todayAgenda.length) ? (
        <p className="text-gray-500 text-sm text-center py-8 italic">Aucun rendez-vous aujourd'hui.</p>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {todayAgenda.map((apt, idx) => (
            <div key={apt.id}
              onClick={() => onClickEntry?.(apt)}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/30 cursor-pointer transition-all duration-300 group border border-transparent hover:border-white/40"
              style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="text-sm font-mono font-bold text-gray-700 w-14 shrink-0 px-2 py-1 rounded-lg bg-white/20 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-all duration-300 text-center">
                {apt.rdv_time}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                  {Object.values(apt.data || {})[0] || '—'}
                </p>
              </div>
              <i className="fas fa-chevron-right text-gray-400 text-xs group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
