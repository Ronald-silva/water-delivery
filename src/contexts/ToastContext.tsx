import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextData {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Toast[]>([]);

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
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {messages.map(message => (
          <div
            key={message.id}
            className={`p-4 rounded-lg shadow-lg ${
              message.type === 'success' ? 'bg-green-500' :
              message.type === 'error' ? 'bg-red-500' :
              message.type === 'warning' ? 'bg-yellow-500' :
              'bg-blue-500'
            } text-white`}
          >
            {message.message}
          </div>
        ))}
      </div>
      {children}
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