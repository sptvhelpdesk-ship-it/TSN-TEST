import { useEffect, useState } from "react";

interface ToastItem {
  id: number;
  message: string;
}

let toastListeners: ((msg: string) => void)[] = [];

export function showToast(message: string) {
  toastListeners.forEach(fn => fn(message));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  let counter = 0;

  useEffect(() => {
    const handler = (msg: string) => {
      const id = ++counter;
      setToasts(prev => [...prev, { id, message: msg }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    };
    toastListeners.push(handler);
    return () => { toastListeners = toastListeners.filter(fn => fn !== handler); };
  }, []);

  return (
    <div className="fixed top-24 right-6 z-[110] flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="bg-[#15212D] border border-white/10 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-right">
          {t.message}
        </div>
      ))}
    </div>
  );
}
