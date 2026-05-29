import { useAuth } from '../../hooks/useAuth.jsx';
import translations from '../../i18n/translations';

export default function TodayAgenda({ todayAgenda, onClickEntry }) {
  const { appConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="font-semibold text-gray-700 mb-4">{t.todayAgenda}</h3>
      {(!todayAgenda || !todayAgenda.length) ? (
        <p className="text-gray-400 text-sm text-center py-4">Aucun rendez-vous aujourd'hui.</p>
      ) : (
        <div className="space-y-2">
          {todayAgenda.map(apt => (
            <div key={apt.id}
              onClick={() => onClickEntry?.(apt)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="text-sm font-mono font-bold text-gray-700 w-12 shrink-0">{apt.rdv_time}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {Object.values(apt.data || {})[0] || '—'}
                </p>
              </div>
              <i className="fas fa-chevron-right text-gray-300 text-xs" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
