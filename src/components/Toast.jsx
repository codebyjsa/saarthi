import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, toast.duration || 4000);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const iconMap = {
    success: { icon: 'fa-check-circle', color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
    error: { icon: 'fa-exclamation-circle', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    warning: { icon: 'fa-exclamation-triangle', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    info: { icon: 'fa-info-circle', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => {
          const style = iconMap[toast.type] || iconMap.info;
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl min-w-[340px] max-w-[420px] ${
                toast.exiting ? 'animate-toast-out' : 'animate-toast-in'
              } bg-white/95 ${style.border}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                <i className={`fas ${style.icon} ${style.color}`}></i>
              </div>
              <div className="flex-1 min-w-0">
                {toast.title && <p className="text-sm font-semibold text-slate-900">{toast.title}</p>}
                <p className="text-sm text-slate-600">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors mt-0.5 flex-shrink-0"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
