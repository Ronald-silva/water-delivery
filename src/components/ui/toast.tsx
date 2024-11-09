import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const types = {
    success: {
      icon: CheckCircle,
      className: 'bg-green-50 text-green-800 border-green-200',
      iconClass: 'text-green-400'
    },
    error: {
      icon: AlertCircle,
      className: 'bg-red-50 text-red-800 border-red-200',
      iconClass: 'text-red-400'
    },
    warning: {
      icon: AlertCircle,
      className: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      iconClass: 'text-yellow-400'
    },
    info: {
      icon: AlertCircle,
      className: 'bg-blue-50 text-blue-800 border-blue-200',
      iconClass: 'text-blue-400'
    }
  };

  const { icon: Icon, className, iconClass } = types[type];

  return (
    <div className={`fixed top-4 right-4 w-96 border rounded-lg shadow-lg ${className}`}>
      <div className="p-4 flex items-center gap-3">
        <Icon className={`w-5 h-5 ${iconClass}`} />
        <p className="flex-1">{message}</p>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;