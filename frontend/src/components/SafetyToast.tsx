import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdShield, MdWarning, MdError, MdClose } from 'react-icons/md';

interface SafetyToastProps {
  message: string | null;
  type?: 'safety' | 'error' | 'warning';
  onDismiss: () => void;
}

const TOAST_CONFIG = {
  safety: {
    icon: MdShield,
    bg: 'bg-amber-950/90 border-amber-700/60',
    iconColor: 'text-amber-400',
    textColor: 'text-amber-100',
    label: '🛡️ Safety Block',
    labelColor: 'text-amber-300',
  },
  error: {
    icon: MdError,
    bg: 'bg-red-950/90 border-red-700/60',
    iconColor: 'text-red-400',
    textColor: 'text-red-100',
    label: '⚠️ Error',
    labelColor: 'text-red-300',
  },
  warning: {
    icon: MdWarning,
    bg: 'bg-slate-900/90 border-slate-700/60',
    iconColor: 'text-yellow-400',
    textColor: 'text-slate-200',
    label: '⚠️ Warning',
    labelColor: 'text-yellow-300',
  },
};

const AUTO_DISMISS_MS = 6000;

export const SafetyToast: React.FC<SafetyToastProps> = ({
  message,
  type = 'safety',
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300); // let exit animation finish
      }, AUTO_DISMISS_MS);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message]);

  const cfg = TOAST_CONFIG[type];
  const Icon = cfg.icon;

  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] flex items-start gap-3 px-5 py-4 rounded-2xl border shadow-2xl backdrop-blur-md max-w-md w-[calc(100%-2rem)] ${cfg.bg}`}
          role="alert"
          aria-live="assertive"
        >
          {/* Shield / icon */}
          <div className={`mt-0.5 shrink-0 ${cfg.iconColor}`}>
            <Icon className="text-xl" />
          </div>

          {/* Message body */}
          <div className="flex-1 min-w-0">
            <p className={`text-[10px] font-extrabold uppercase tracking-widest ${cfg.labelColor} mb-0.5`}>
              {cfg.label}
            </p>
            <p className={`text-sm font-semibold leading-snug ${cfg.textColor}`}>
              {message}
            </p>
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
            className="shrink-0 mt-0.5 text-slate-400 hover:text-white transition-colors"
            aria-label="Dismiss notification"
          >
            <MdClose className="text-lg" />
          </button>

          {/* Auto-dismiss progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-white/20 rounded-b-2xl"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: AUTO_DISMISS_MS / 1000, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
