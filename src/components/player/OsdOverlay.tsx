import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../../stores/usePlayerStore';

export const OsdOverlay: React.FC = () => {
  const { osdMessage } = usePlayerStore();
  const [visibleMessage, setVisibleMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!osdMessage) return;
    setVisibleMessage(osdMessage.text);
    const timer = setTimeout(() => {
      setVisibleMessage(null);
    }, 1600);
    return () => clearTimeout(timer);
  }, [osdMessage]);

  return (
    <AnimatePresence>
      {visibleMessage && (
        <motion.div
          key="osd-toast"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-2xl border border-blue-500/30 bg-slate-900/90 px-4 py-2 text-xs font-semibold text-white shadow-2xl backdrop-blur-md"
        >
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>{visibleMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
