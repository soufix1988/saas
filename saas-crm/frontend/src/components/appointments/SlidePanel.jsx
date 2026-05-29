import { useAuth } from '../../hooks/useAuth.jsx';
import translations from '../../i18n/translations';

const STATUS_COLORS = {
  'Confirmé': 'bg-green-100 text-green-700',
  'En attente': 'bg-yellow-100 text-yellow-700',
  'Annulé': 'bg-red-100 text-red-700',
};

export default function SlidePanel({ appointment, open, onClose, onApprove, onStatusChange }) {
  const { appConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;

  return (
    <div className={`slide-panel bg-white shadow-2xl ${open ? 'open' : ''}`}>
      {open && <div className="fixed inset-0 bg-black/30 z-[-1]" onClick={onClose} />}

      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Détails du rendez-vous</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl"><i className="fas fa-times" /></button>
        </div>

        {appointment && (
          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Form name */}
            {appointment.form && (
              <div className="flex items-center gap-2 mb-2">
                <i className={`fas ${appointment.form.icon || 'fa-list'} text-gray-500`} />
                <span className="font-medium">{appointment.form.nom}</span>
              </div>
            )}

            {/* Status badge */}
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[appointment.rdv_status] || 'bg-gray-100 text-gray-600'}`}>
              {appointment.rdv_status}
            </div>

            {/* Date/time */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex gap-2 text-sm">
                <i className="fas fa-calendar text-gray-400 w-4" />
                <span>{appointment.rdv_date}</span>
              </div>
              <div className="flex gap-2 text-sm">
                <i className="fas fa-clock text-gray-400 w-4" />
                <span>{appointment.rdv_time}</span>
              </div>
            </div>

            {/* Data fields */}
            <div className="space-y-2">
              {Object.entries(appointment.data || {}).map(([key, val]) => (
                <div key={key} className="text-sm">
                  <span className="text-gray-500">{key}: </span>
                  <span className="font-medium">{Array.isArray(val) ? val.join(', ') : String(val)}</span>
                </div>
              ))}
            </div>

            {/* Score */}
            {appointment.score_quiz && (
              <div className="bg-green-50 rounded-lg p-3 text-sm">
                <span className="text-gray-500">Score: </span>
                <span className="font-bold text-green-700">{appointment.score_quiz}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {appointment && appointment.rdv_status === 'En attente' && (
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={() => onApprove(appointment)}
              className="w-full py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              <i className="fas fa-check mr-2" /> {t.approve}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
