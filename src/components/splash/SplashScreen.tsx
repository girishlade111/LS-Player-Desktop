import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LSLogo } from '../assets/LSLogo';
import { useUiStore } from '../../stores/useUiStore';

export const SplashScreen: React.FC = () => {
  const { isSplashActive, setSplashActive } = useUiStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isSplashActive) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setSplashActive(false), 200);
          return 100;
        }
        return prev + 5;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isSplashActive, setSplashActive]);

  return (
    <AnimatePresence>
      {isSplashActive && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080c14] text-white"
        >
          {/* Ambient Background Glow */}
          <div className="absolute h-96 w-96 rounded-full bg-blue-600/15 blur-[120px] animate-pulse-glow" />

          {/* Logo Container */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center gap-6"
          >
            <LSLogo size={72} />

            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold tracking-wider text-slate-100 font-sans">
                LS <span className="text-cyan-400 font-extrabold">PLAYER</span>
              </h1>
              <p className="mt-1 text-xs tracking-widest text-slate-400 uppercase font-medium">
                Enterprise Windows Video Engine
              </p>
            </div>

            {/* Progress Bar Container */}
            <div className="mt-4 flex w-48 flex-col items-center gap-2">
              <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800/80">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Initializing Hardware Acceleration... {progress}%
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
