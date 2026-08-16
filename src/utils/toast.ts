export interface ToastMessage {
  id: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
  duration?: number;
}

type ToastListener = (toast: ToastMessage) => void;
const listeners: ToastListener[] = [];

export const showToast = (
  message: string, 
  type: 'success' | 'info' | 'warning' | 'error' = 'success', 
  title?: string,
  duration = 4000
) => {
  const toast: ToastMessage = {
    id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    type,
    title,
    message,
    duration
  };
  listeners.forEach(fn => fn(toast));
};

export const subscribeToast = (fn: ToastListener) => {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
};
