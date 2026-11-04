import React from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertCircle,
  Heart,
  Calendar,
  ShieldCheck,
  CheckSquare,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCRM } from '../../context/CRMContext';

export const NotificationsDrawer: React.FC = () => {
  const {
    notificationsOpen,
    setNotificationsOpen,
    notifications,
    markNotificationAsRead,
    navigateToContact,
    navigateToGift,
    navigateToTask,
    navigateToBoardMember,
    navigateToMeeting,
  } = useCRM();

  const handleNotificationClick = (item: (typeof notifications)[0]) => {
    markNotificationAsRead(item.id);
    setNotificationsOpen(false);

    if (item.linkId) {
      if (item.type === 'gift') navigateToGift(item.linkId);
      if (item.type === 'task') navigateToTask(item.linkId);
      if (item.type === 'governance') navigateToBoardMember(item.linkId);
      if (item.type === 'meeting') navigateToMeeting(item.linkId);
      if (item.type === 'donor') navigateToContact(item.linkId);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'gift':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-amber-500" />;
      case 'governance':
        return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-teal-600" />;
    }
  };

  return (
    <AnimatePresence>
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNotificationsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col z-10"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Notifications & Alerts
                </h3>
              </div>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 p-4 overflow-y-auto divide-y divide-slate-100">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`py-3.5 px-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 ${
                    item.read
                      ? 'bg-transparent opacity-75 hover:bg-slate-50'
                      : 'bg-teal-50/40 hover:bg-teal-50/70 border border-teal-100/80 mb-2'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-semibold ${
                          item.read ? 'text-slate-700' : 'text-slate-900'
                        }`}
                      >
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      {item.message || item.description}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1.5 font-mono">
                      {item.timestamp || item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
