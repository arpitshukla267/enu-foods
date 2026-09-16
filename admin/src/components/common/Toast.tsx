import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 3500
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible || !message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-60 max-w-sm w-full p-2 sm:p-0 pointer-events-auto animate-in slide-in-from-bottom-4 duration-200">
      <div
        className={`flex items-center justify-between gap-3 p-4 rounded-xl border shadow-xl ${
          type === 'success'
            ? 'bg-[#173D2A] text-white border-[#245A3F]'
            : type === 'error'
            ? 'bg-[#9E382B] text-white border-[#B84537]'
            : 'bg-[#2A241C] text-white border-[#3F372C]'
        }`}
      >
        <div className="flex items-center gap-3">
          {type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#D99B26] shrink-0" />}
          {type === 'error' && <AlertCircle className="w-5 h-5 text-white shrink-0" />}
          {type === 'info' && <Info className="w-5 h-5 text-[#D99B26] shrink-0" />}
          <span className="text-xs font-semibold leading-tight">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-60 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2 sm:p-0">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-lg animate-in slide-in-from-bottom-5 duration-200 ${
              toast.type === 'success'
                ? 'bg-[#173D2A] text-white border-[#245A3F]'
                : toast.type === 'error'
                ? 'bg-[#9E382B] text-white border-[#B84537]'
                : 'bg-[#2A241C] text-white border-[#3F372C]'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#D99B26] shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-white shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-[#D99B26] shrink-0" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
