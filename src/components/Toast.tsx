import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 4000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Wait for fade-out animation
  };

  const config = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      borderColor: 'border-l-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800'
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      borderColor: 'border-l-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800'
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-500" />,
      borderColor: 'border-l-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800'
    }
  };

  const current = config[type];

  return (
    <div 
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-md 
        transition-all duration-300 ease-out transform
        ${isExiting ? 'opacity-0 -translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}
    >
      <div className={`flex items-center gap-3 p-4 bg-white rounded-2xl shadow-2xl border ${current.borderColor} border-l-[6px] border-slate-100`}>
        <div className={`p-2 rounded-xl ${current.bgColor}`}>
          {current.icon}
        </div>
        
        <div className="flex-grow">
          <p className={`text-sm font-bold ${current.textColor} leading-tight`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </p>
          <p className="text-sm text-slate-600 mt-0.5">
            {message}
          </p>
        </div>

        <button 
          onClick={handleClose}
          className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-[6px] right-0 h-1 bg-slate-100 overflow-hidden rounded-br-2xl">
          <div 
            className={`h-full ${current.icon.props.className.split(' ')[2].replace('text-', 'bg-')} transition-all duration-[4000ms] ease-linear`}
            style={{ 
              width: isExiting ? '0%' : '100%',
              animation: `shrink ${duration}ms linear forwards` 
            }}
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}} />
    </div>
  );
};

export default Toast;
