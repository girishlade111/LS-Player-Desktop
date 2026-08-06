import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, FolderOpen, FileVideo, Settings, Camera, Sliders, X } from 'lucide-react';
import { useUiStore } from '../../stores/useUiStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useLibraryStore } from '../../stores/useLibraryStore';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, setFileInfoModalOpen } = useUiStore();
  const { togglePlayPause, toggleFullscreen, takeScreenshot } = usePlayerStore();
  const { scanDirectory } = useLibraryStore();

  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const commands = [
    {
      id: 'cmd-play',
      title: 'Play / Pause Video',
      category: 'Playback',
      icon: <Play size={16} className="text-blue-400" />,
      action: () => {
        togglePlayPause();
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-open-file',
      title: 'Open Local Media File',
      category: 'File',
      icon: <FileVideo size={16} className="text-cyan-400" />,
      action: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*,audio/*';
        input.click();
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-scan',
      title: 'Scan Videos Directory',
      category: 'Library',
      icon: <FolderOpen size={16} className="text-amber-400" />,
      action: () => {
        scanDirectory('C:\\Videos');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-fullscreen',
      title: 'Toggle Fullscreen Mode',
      category: 'Display',
      icon: <Sliders size={16} className="text-emerald-400" />,
      action: () => {
        toggleFullscreen();
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-screenshot',
      title: 'Take High-Res Screenshot',
      category: 'Playback',
      icon: <Camera size={16} className="text-indigo-400" />,
      action: () => {
        takeScreenshot();
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-info',
      title: 'View Codec & File Info',
      category: 'Metadata',
      icon: <Settings size={16} className="text-purple-400" />,
      action: () => {
        setFileInfoModalOpen(true);
        setCommandPaletteOpen(false);
      },
    },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24 backdrop-blur-sm"
        onClick={() => setCommandPaletteOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="glass-panel w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-[#0d1424] text-slate-100 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Input Header */}
          <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
            <Search size={18} className="text-cyan-400" />
            <input
              type="text"
              autoFocus
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
            />
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Command List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {filteredCommands.map((cmd) => (
              <div
                key={cmd.id}
                onClick={cmd.action}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-blue-600 hover:text-white group"
              >
                <div className="flex items-center gap-3">
                  {cmd.icon}
                  <span className="text-xs font-semibold">{cmd.title}</span>
                </div>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 group-hover:bg-blue-700 group-hover:text-white">
                  {cmd.category}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
