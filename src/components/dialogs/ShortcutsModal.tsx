import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import { useUiStore } from '../../stores/useUiStore';

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setShortcutsModalOpen } = useUiStore();

  if (!isShortcutsModalOpen) return null;

  const shortcutsList = [
    { key: 'Space / K', desc: 'Play / Pause Video' },
    { key: 'F', desc: 'Toggle Fullscreen' },
    { key: 'Esc', desc: 'Exit Fullscreen' },
    { key: 'M', desc: 'Mute / Unmute Audio' },
    { key: 'Right / Left Arrow', desc: 'Seek 5 Seconds Forward / Backward' },
    { key: 'Shift + Right / Left', desc: 'Seek 10 Seconds Forward / Backward' },
    { key: 'Ctrl + Right / Left', desc: 'Seek 30 Seconds Forward / Backward' },
    { key: 'Up / Down Arrow', desc: 'Volume Up / Down' },
    { key: 'N', desc: 'Next Playlist Item' },
    { key: 'P', desc: 'Previous Playlist Item' },
    { key: '[ / ]', desc: 'Speed Down / Up' },
    { key: 'S', desc: 'Cycle Subtitle Track' },
    { key: 'A', desc: 'Cycle Audio Track' },
    { key: 'I', desc: 'Media & Codec Details' },
    { key: 'Ctrl + O', desc: 'Open File' },
    { key: 'Ctrl + K', desc: 'Command Palette' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={() => setShortcutsModalOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass-panel w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-[#0c1220] p-6 text-slate-100 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Keyboard size={20} className="text-cyan-400" />
              <h2 className="text-sm font-bold tracking-wide">LS Player Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={() => setShortcutsModalOpen(false)}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Grid of Shortcuts */}
          <div className="mt-4 grid grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
            {shortcutsList.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-xs"
              >
                <span className="text-slate-300 font-medium">{s.desc}</span>
                <kbd className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 font-mono text-[11px] font-bold text-cyan-400">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
