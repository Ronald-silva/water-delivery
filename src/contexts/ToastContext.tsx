import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Toast from '@/components/ui/toast';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextData {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random();
    const toast = { id, message, type };
    
    setMessages(state => [...state, toast]);

    setTimeout(() => {
      setMessages(state => state.filter(msg => msg.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {mounted && messages.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {messages.map(message => (
            <Toast
              key={message.id}
              message={message.message}
              type={message.type}
            />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};