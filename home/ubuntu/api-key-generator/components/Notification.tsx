
import React from 'react';
import { type NotificationMessage } from '../types';
import { CheckCircleIcon, ExclamationCircleIcon } from './icons/Icons';

interface NotificationProps {
  notification: NotificationMessage | null;
}

export const Notification: React.FC<NotificationProps> = ({ notification }) => {
  if (!notification) {
    return null;
  }

  const isSuccess = notification.type === 'success';
  const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
  const Icon = isSuccess ? CheckCircleIcon : ExclamationCircleIcon;

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white ${bgColor} animate-slide-in`}
    >
      <Icon className="h-6 w-6 mr-3" />
      <span>{notification.message}</span>
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
