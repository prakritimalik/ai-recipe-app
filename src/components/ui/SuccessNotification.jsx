import React, { useState, useEffect } from 'react';
import { Check, AlertTriangle, Trash2 } from 'lucide-react';

/**
 * Success notification component that auto-dismisses
 * @param {Object} props - Component props
 * @param {string} props.message - Notification message
 * @param {string} props.type - Notification type ('success' | 'warning' | 'error')
 * @param {boolean} props.show - Whether to show the notification
 * @param {Function} props.onClose - Callback when notification closes
 * @param {number} props.duration - Auto-dismiss duration in ms (default: 3000)
 * @returns {JSX.Element|null} SuccessNotification component
 */
const SuccessNotification = ({ 
  message, 
  type = 'success', 
  show = false, 
  onClose, 
  duration = 3000 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // Auto-dismiss after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, duration, onClose]);

  if (!isVisible) return null;

  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'warning':
        return 'bg-orange-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'error':
        return <Trash2 size={20} />;
      default:
        return <Check size={20} />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`px-6 py-3 rounded-lg shadow-lg ${getNotificationStyles()}`}>
        <div className="flex items-center space-x-2">
          {getIcon()}
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;