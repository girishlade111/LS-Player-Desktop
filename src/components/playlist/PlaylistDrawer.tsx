import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Shuffle,
  Repeat,
  Repeat1,
  Trash2,
  Download,
  GripVertical,
  ListVideo,
} from 'lucide-react';
import { usePlaylistStore } from '../../stores/usePlaylistStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { formatTime } from '../../utils/formatters';

export const PlaylistDrawer: React.FC = () => {
  const {
    isOpen,
    setOpen,
    currentPlaylist,
    currentIndex,
    setCurrentIndex,
    removeItem,
    clearPlaylist,
    repeatMode,
    toggleRepeatMode,
    isShuffle,
    toggleShuffle,
    exportM3U,
  } = usePlaylistStore();

  const { loadMedia } = usePlayerStore();

  if (!isOpen) return null;

  const handlePlayItem = (index: number) => {
    setCurrentIndex(index);
    const item = currentPlaylist.items[index];
    if (item) {
      loadMedia(item, true);
    }
  };

  const handleExportM3U = () => {
    const content = exportM3U();
    const blob = new Blob([content], { type: 'audio/x-mpegurl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPlaylist.title.replace(/\s+/g, '_')}.m3u`;
    a.click();
  };

  const totalDuration = currentPlaylist.items.reduce((acc, item) => acc + item.duration, 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex justify-end"
        onClick={() => setOpen(false)}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="glass-panel h-full w-96 flex flex-col border-l border-slate-700 bg-[#0c1220] p-4 text-slate-100 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ListVideo size={20} className="text-cyan-400" />
              <h2 className="text-sm font-bold tracking-wide">{currentPlaylist.title}</h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Stats Bar & Controls */}
          <div className="my-3 flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex flex-col text-[11px] font-mono text-slate-400">
              <span>{currentPlaylist.items.length} items</span>
              <span>Total: {formatTime(totalDuration)}</span>
            </div>

            <div className="flex items-center gap-1">
              {/* Shuffle Toggle */}
              <button
                onClick={toggleShuffle}
                className={`rounded-lg p-1.5 transition-colors ${
                  isShuffle ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
                title="Shuffle Queue"
              >
                <Shuffle size={16} />
              </button>

              {/* Repeat Toggle */}
              <button
                onClick={toggleRepeatMode}
                className={`rounded-lg p-1.5 transition-colors ${
                  repeatMode !== 'off' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
              </button>

              {/* Export M3U */}
              <button
                onClick={handleExportM3U}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                title="Export M3U Playlist File"
              >
                <Download size={16} />
              </button>

              {/* Clear Playlist */}
              <button
                onClick={clearPlaylist}
                className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/20"
                title="Clear Playlist Queue"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {currentPlaylist.items.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-center text-slate-500 text-xs">
                <span>Playlist queue is empty</span>
              </div>
            ) : (
              currentPlaylist.items.map((item, idx) => {
                const isCurrent = idx === currentIndex;
                return (
                  <div
                    key={`${item.id}-${idx}`}
                    onClick={() => handlePlayItem(idx)}
                    className={`group flex cursor-pointer items-center justify-between rounded-xl border p-2.5 transition-all ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-600/20 text-white shadow-md shadow-blue-500/10'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <GripVertical size={14} className="text-slate-600 opacity-0 group-hover:opacity-100" />
                      {isCurrent ? (
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white animate-pulse">
                          <Play size={12} className="ml-0.5" />
                        </div>
                      ) : (
                        <span className="w-5 text-center text-[10px] font-mono text-slate-500">
                          {idx + 1}
                        </span>
                      )}

                      <div className="flex flex-col truncate">
                        <span className="text-xs font-semibold truncate">{item.title}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {formatTime(item.duration)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(idx);
                      }}
                      className="rounded p-1 text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
