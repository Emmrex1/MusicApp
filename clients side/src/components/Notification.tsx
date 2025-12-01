import { useState } from 'react';
import { FaRegBell, FaCheck, FaExclamationTriangle, FaMusic, FaUsers } from 'react-icons/fa';

interface Notification {
  id: string;
  type: 'upload' | 'user' | 'system' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'upload', title: 'New Upload', message: 'User uploaded 5 songs', time: '2 min ago', read: false },
    { id: '2', type: 'user', title: 'New User', message: 'John Doe registered', time: '5 min ago', read: false },
    { id: '3', type: 'warning', title: 'System Alert', message: 'High server load detected', time: '1 hour ago', read: true },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'upload': return <FaMusic className="text-green-400" />;
      case 'user': return <FaUsers className="text-blue-400" />;
      case 'warning': return <FaExclamationTriangle className="text-red-400" />;
      default: return <FaRegBell className="text-gray-400" />;
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80  border border-gray-800 rounded-xl shadow-2xl z-50">
      <div className="p-4 border-b border-gray-800">
        <h3 className="font-bold text-white">Notifications</h3>
        <p className="text-sm text-gray-400">{notifications.filter(n => !n.read).length} unread</p>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-gray-800 hover:bg-gray-900/50 transition-colors ${
              !notification.read ? 'bg-gray-900/30' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gray-800/50">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-white">{notification.title}</h4>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1 hover:bg-gray-700 rounded"
                    >
                      <FaCheck className="w-3 h-3 text-gray-400" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Notifications;