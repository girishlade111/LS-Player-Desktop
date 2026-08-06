import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';
import { useUiStore } from '../../stores/useUiStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import type { CodecMetadata } from '../../types';
import { formatFileSize } from '../../utils/formatters';

export const FileInfoModal: React.FC = () => {
  const { isFileInfoModalOpen, setFileInfoModalOpen } = useUiStore();
  const { currentMedia, adapter } = usePlayerStore();
  const [metadata, setMetadata] = useState<CodecMetadata | undefined>(undefined);

  useEffect(() => {
    if (isFileInfoModalOpen) {
      adapter.getMetadata().then(setMetadata);
    }
  }, [isFileInfoModalOpen, adapter]);

  if (!isFileInfoModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={() => setFileInfoModalOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass-panel w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-[#0c1220] p-6 text-slate-100 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Info size={20} className="text-cyan-400" />
              <h2 className="text-sm font-bold tracking-wide">Media & Codec Details</h2>
            </div>
            <button
              onClick={() => setFileInfoModalOpen(false)}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Details Content */}
          <div className="mt-4 space-y-4 text-xs font-mono">
            {/* File Path */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase">File Path</span>
              <p className="mt-1 font-semibold text-slate-200 truncate">{currentMedia?.path || 'N/A'}</p>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Video Codec</span>
                <p className="mt-1 font-semibold text-cyan-400">{metadata?.videoCodec || 'H.264 / AVC'}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Audio Codec</span>
                <p className="mt-1 font-semibold text-cyan-400">{metadata?.audioCodec || 'AAC-LC'}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Resolution</span>
                <p className="mt-1 font-semibold text-slate-200">{metadata?.resolution || '1920x1080'}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Frame Rate</span>
                <p className="mt-1 font-semibold text-slate-200">{metadata?.frameRate || 60} FPS</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Bitrate</span>
                <p className="mt-1 font-semibold text-slate-200">{metadata?.bitrate || '12.4 Mbps'}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">File Size</span>
                <p className="mt-1 font-semibold text-slate-200">{currentMedia ? formatFileSize(currentMedia.size) : '0 B'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
