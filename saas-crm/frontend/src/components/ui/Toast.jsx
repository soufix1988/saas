import { useState, useEffect, createContext, useContext, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div
            key={t.id}
            onClick={() => removeToast(t.id)}
            className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl cursor-pointer min-w-72 fade-in backdrop-blur-sm border transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 group
              ${t.type === 'success'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400/30'
                : 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-red-400/30'}`}
          >
            <i className={`fas ${t.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} text-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110`} />
            <span className="text-sm font-medium flex-1">{t.message}</span>
            <i className="fas fa-times opacity-60 hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
