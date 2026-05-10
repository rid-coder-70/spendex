'use client';

import{ useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore, ToastType } from '@/lib/stores/toastStore';

const toastStyles: Record<ToastType, { icon: any; color: string; bg: string; border: string }> = {
  success: {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50/90',
    border: 'border-green-200',
  },
  error: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50/90',
    border: 'border-red-200',
  },
  info: {
    icon: Info,
    color: 'text-blue-600',
    bg: 'bg-blue-50/90',
    border: 'border-blue-200',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-50/90',
    border: 'border-amber-200',
  },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: any; onClose: () => void }) {
  const style = toastStyles[toast.type as ToastType];
  const Icon = style.icon;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`
        pointer-events-auto
        flex items-center gap-3 p-4 pr-10 rounded-xl border shadow-lg backdrop-blur-md
        transition-all duration-300 transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
        ${style.bg} ${style.border}
      `}
    >
      <Icon className={`w-5 h-5 ${style.color}`} />
      <p className="text-sm font-medium text-gray-800">{toast.message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="absolute top-4 right-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
