import React, { useState, useEffect } from 'react';
import { subscribeToast, ToastMessage } from '../utils/toast';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToast((newToast) => {
      setToasts(prev => [newToast, ...prev].slice(0, 5));

      // Auto dismiss after duration
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, newToast.duration || 4000);
    });

    return () => unsubscribe();
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 left-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none" dir="rtl">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info' || !toast.type;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border backdrop-blur-md flex items-start gap-3 transition-all transform animate-in slide-in-from-left-5 fade-in duration-200 ${
              isSuccess 
                ? 'bg-slate-900/95 text-white border-emerald-500/40 ring-1 ring-emerald-500/20' 
                : isWarning 
                ? 'bg-amber-950/95 text-amber-50 border-amber-500/40 ring-1 ring-amber-500/20' 
                : isError 
                ? 'bg-rose-950/95 text-rose-50 border-rose-500/40 ring-1 ring-rose-500/20' 
                : 'bg-slate-900/95 text-white border-blue-500/40 ring-1 ring-blue-500/20'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-amber-400" />}
              {isError && <XCircle className="w-5 h-5 text-rose-400" />}
              {isInfo && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="font-extrabold text-xs mb-0.5 tracking-tight">{toast.title}</h4>
              )}
              <p className="text-xs font-semibold leading-relaxed whitespace-pre-line opacity-90">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
