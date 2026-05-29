import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import translations from '../../i18n/translations';

export default function BulkActions({ selectedIds, onBulkAction, onClearSelection }) {
  const { appConfig } = useAuth();
  const lang = appConfig?.app_lang || 'fr';
  const t = translations[lang] || translations.fr;
  const [notifyModal, setNotifyModal] = useState(null); // 'cancel' | 'delete'
  const [notify, setNotify] = useState(true);

  if (!selectedIds.length) return null;

  function handleAction(action) {
    if (action === 'confirm') {
      onBulkAction('confirm', false);
    } else {
      setNotifyModal(action);
    }
  }

  function handleConfirmModal() {
    onBulkAction(notifyModal, notify);
    setNotifyModal(null);
    setNotify(true);
  }

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-2xl shadow-xl px-6 py-3 flex items-center gap-4 z-20 fade-in">
        <span className="text-sm font-medium">{selectedIds.length} sélectionné(s)</span>
        <div className="flex gap-2">
          <button onClick={() => handleAction('confirm')}
            className="px-3 py-1.5 bg-green-500 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
            <i className="fas fa-check mr-1" /> {t.bulkConfirm}
          </button>
          <button onClick={() => handleAction('cancel')}
            className="px-3 py-1.5 bg-yellow-500 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors">
            <i className="fas fa-ban mr-1" /> {t.bulkCancel}
          </button>
          <button onClick={() => handleAction('delete')}
            className="px-3 py-1.5 bg-red-500 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
            <i className="fas fa-trash mr-1" /> {t.bulkDelete}
          </button>
        </div>
        <button onClick={onClearSelection} className="text-gray-400 hover:text-white ml-2"><i className="fas fa-times" /></button>
      </div>

      {notifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setNotifyModal(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 w-80 fade-in">
            <h3 className="text-base font-semibold mb-4">
              {notifyModal === 'cancel' ? t.bulkCancel : t.bulkDelete} ({selectedIds.length})
            </h3>
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} />
              <span className="text-sm">{t.notifyClient}</span>
            </label>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setNotifyModal(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm">{t.cancel}</button>
              <button onClick={handleConfirmModal}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600">{t.confirm}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
