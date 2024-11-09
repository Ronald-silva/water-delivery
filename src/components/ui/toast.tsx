import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info
} from 'lucide-react';
import { ToastType } from '@/contexts/ToastContext';

interface ToastProps {
  message: string;
  type: ToastType;
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const variants = {
    success: {
      icon: CheckCircle,
      bg: 'bg-green-500',
      iconColor: 'text-green-200'
    },
    error: {
      icon: XCircle,
      bg: 'bg-red-500',
      iconColor: 'text-red-200'
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-yellow-500',
      iconColor: 'text-yellow-200'
    },
    info: {
      icon: Info,
      bg: 'bg-blue-500',
      iconColor: 'text-blue-200'
    }
  };

  const { icon: Icon, bg, iconColor } = variants[type];

  return (
    <div className={`${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-in`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default Toast;