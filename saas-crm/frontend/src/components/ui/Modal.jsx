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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 fade-in border border-gray-100 hover:shadow-3xl transition-all duration-500">
        {title && <h3 className="text-2xl font-bold mb-6 text-gray-900">{title}</h3>}
        <div className="mb-8">{children}</div>
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
          {onCancel && (
            <button onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:-translate-y-0.5">
              {cancelLabel}
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`px-5 py-2.5 rounded-xl text-white font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${danger ? 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-red-200' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-200'}`}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
