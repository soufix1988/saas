import { useEffect } from 'react';

export default function Modal({ open, title, children, onConfirm, onCancel, confirmLabel = 'Confirmer', cancelLabel = 'Annuler', danger = false }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 fade-in">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <div className="mb-6">{children}</div>
        <div className="flex gap-3 justify-end">
          {onCancel && (
            <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              {cancelLabel}
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg text-white transition-colors ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-900 hover:bg-gray-700'}`}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
