import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import Portal from '../admin/projects/Portal';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
};

const COLORS = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-amber-500 text-white',
};

function ToastItem({ toast, onRemove }) {
  const [isExiting, setIsExiting] = useState(false);
  const Icon = ICONS[toast.type] || ICONS.success;

  useEffect(() => {
    const exitTimer = setTimeout(() => setIsExiting(true), 2700);
    const removeTimer = setTimeout(() => onRemove(toast.id), 3000);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, onRemove]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg min-w-[280px] max-w-[420px] ${COLORS[toast.type] || COLORS.success}`}
      style={{
        animation: isExiting
          ? 'toastOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          : 'toastIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      }}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button
        onClick={handleDismiss}
        className="shrink-0 p-0.5 rounded-full hover:bg-white/20 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function Toast({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <Portal>
      <div
        className="fixed top-6 right-6 flex flex-col gap-2"
        style={{ zIndex: 10000 }}
      >
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </div>
    </Portal>
  );
}

export default Toast;
